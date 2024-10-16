import type { AddonType, IconType, LostConfig } from "../lib/common.ts";
import type { PluginProperty } from "../lib/plugin-props.ts";
import type { LostCategoryBase } from "../lib/entities.ts";
import type { AddonScript } from "./get-addon-scripts.ts";
import type { AddonFile } from "./get-addon-files.ts";
import { BUILD_PATH } from "./paths.ts";
import type { AddonIcon } from "./get-addon-icon.ts";
import { Project } from "./cli-deps.ts";
import { path } from './cli-deps.ts';

type AddonFiles = {
    [K in AddonType]: [
        `c3runtime/${K}.js`,
        'c3runtime/type.js',
        'instance.js',
        'plugin.js',
        'type.js'
    ]
}

const addonFiles: AddonFiles = {
    plugin: [
        'c3runtime/plugin.js',
        'c3runtime/type.js',
        'instance.js',
        'plugin.js',
        'type.js'
    ],
    behavior: [
        'c3runtime/behavior.js',
        'c3runtime/type.js',
        'instance.js',
        'plugin.js',
        'type.js'    
    ]
}

export async function createAddonStructure(
    config: LostConfig<'plugin' | 'behavior'>, 
    pluginProperties: PluginProperty[],
    scripts: AddonScript[], 
    files: AddonFile[], 
    categories: LostCategoryBase[],
    icon: AddonIcon
) {
    try {
        await Deno.remove(BUILD_PATH, { recursive: true });
    } catch (e) {
        //return;
    }
    await Deno.mkdir(BUILD_PATH);
    await Deno.mkdir(`${BUILD_PATH}/c3runtime`);
    await Deno.mkdir(`${BUILD_PATH}/lang`);
    if (scripts.length > 0) {
        await Deno.mkdir(`${BUILD_PATH}/scripts`);
        scripts.forEach(script => {
            Deno.copyFile(script.path, `${BUILD_PATH}/scripts/${script.filename}`);
        })
    };
    if (files.length > 0) {
        await Deno.mkdir(`${BUILD_PATH}/files`);
        files.forEach(file => {
            Deno.copyFile(file.path, `${BUILD_PATH}/files/${file.filename}`);
        })
    };

    await Deno.copyFile(icon.path, `${BUILD_PATH}/${icon.filename}`);

    let instanceFileData = await transpileTsToJs(`${Deno.cwd()}/Addon/Instance.ts`) as string;
    instanceFileData = instanceFileData.replace(/import\s*{?\s*Config\s*}?\s*from\s*["'](?:@config|(?:\.\.\/)?lost\.config\.ts)["'];/, `const Config = ${JSON.stringify(config)};`);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/instance.js`, instanceFileData);

    addonFiles[config.Type].forEach(async (file) => {
        const __dirname = import.meta.dirname as string;
        let data = await Deno.readTextFile(path.resolve(__dirname, 'addon_base', config.Type, file));
        data = data
            .replace(/const\s+ADDON_ID\s*=\s*"";/, `const ADDON_ID = ${JSON.stringify(config.AddonId)};`)
            .replace(/const\s+CONFIG\s*=\s*\{\};/, `const CONFIG = ${JSON.stringify(config)};`)
            .replace(/const\s+PLUGIN_PROPERTIES\s*=\s*\{\};/, `const PLUGIN_PROPERTIES = ${JSON.stringify(pluginProperties)};`)
            .replace(/const\s+REMOTE_SCRIPTS\s*=\s*\[\];/, `const REMOTE_SCRIPTS = ${JSON.stringify(config.RemoteScripts || [])};`)
            .replace(/const\s+SCRIPTS\s*=\s*\[\];/, `const SCRIPTS = ${JSON.stringify(scripts)};`)
            .replace(/const\s+FILES\s*=\s*\[\];/, `const FILES = ${JSON.stringify(files)};`)
        await Deno.writeTextFile(path.resolve(BUILD_PATH, file), data);
    })

    const setializedEntities = serializeEntities(categories);

    let entities = `const ADDON_ID = ${JSON.stringify(config.AddonId)};\nconst C3 = globalThis.C3;\nC3.Plugins[ADDON_ID].Acts = ${setializedEntities.Actions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'actions.js'), entities);
    entities = `const ADDON_ID = ${JSON.stringify(config.AddonId)};\nconst C3 = globalThis.C3;\nC3.Plugins[ADDON_ID].Cnds = ${setializedEntities.Conditions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'conditions.js'), entities);
    entities = `const ADDON_ID = ${JSON.stringify(config.AddonId)};\nconst C3 = globalThis.C3;\nC3.Plugins[ADDON_ID].Exps = ${setializedEntities.Expressions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'expressions.js'), entities);



}

function serializeEntities(categories: LostCategoryBase[]) {
    let actions: any = {};
    let conditions: any = {};
    let expressions: any = {};

    categories.forEach(category => {
        category.Actions.forEach(entity => {
            const {ScriptName, Script} = entity.Options;
            actions[ScriptName] = Script;
        })
        
        category.Conditions.forEach(entity => {
            const {ScriptName, Script} = entity.Options;
            conditions[ScriptName] = Script;
        })

        category.Expressions.forEach(entity => {
            const {ScriptName, Script} = entity.Options;
            expressions[ScriptName] = Script;
        })
    })

    const serializeObjectWithFunctions = (obj: any): string => {
        let str = '{\n';
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                if (typeof value === 'function') {
                    // Преобразование функции в строку
                    str += `  ${key}: function ${value.toString().replace(/^function\s*\w*\s*/, '')},\n`;
                } else {
                    str += `  ${key}: ${JSON.stringify(value, null, 2)},\n`;
                }
            }
        }
        str = str.replace(/,\n$/, '\n'); // Удаляем последнюю запятую
        str += '}';
        return str;
    }

    return {
        Actions: serializeObjectWithFunctions(actions),
        Conditions: serializeObjectWithFunctions(conditions),
        Expressions: serializeObjectWithFunctions(expressions)
    }
}

// interface ReplaceLostConfig {
//     Config: LostConfig<'plugin' | 'behavior'>;
//     PluginProperties: PluginProperty[];
//     IconName: string;
//     IconType: IconType;
//     Scripts: string[];
//     Files: string[];
//     RemoteScripts: string[];
// }

// async function copyBaseAddonFiles(addonType: AddonType, lostConfig: ReplaceLostConfig, entitiesFunctions: AllEntitiesFunctions) {
//     const lostConfigVariableName = 'LOST_CONFIG';
//     const lostConfigRegex = new RegExp(`const\\s+${lostConfigVariableName}\\s*=\\s*{\\s*};`);
//     const configImportRegex = /import\s*{?\s*Config\s*}?\s*from\s*["'](?:@config|(?:\.\.\/)?lost\.config\.ts)["'];/;
//     const lostConfigReplace = `const ${lostConfigVariableName} = ${JSON.stringify(lostConfig)};`;

//     let instanceJSFile: string;
//     let pluginJSFile: string;
//     let typeJSFile: string;

//     let _actionsJSFile: string;
//     let _conditionsJSFile: string; 
//     let _expressionsJSFile: string; 
//     let _instanceJSFile: string;
//     let _pluginJSFile: string;
//     let _typeJSFile: string;

//     /**
//      * ./ folder
//      */
//     instanceJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['instance.js']));
//     instanceJSFile = instanceJSFile.replace(lostConfigRegex, lostConfigReplace);
//     await Deno.writeTextFile(`${BUILD_PATH}/instance.js`, instanceJSFile);

//     pluginJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['plugin.js']));
//     pluginJSFile = pluginJSFile.replace(lostConfigRegex, lostConfigReplace);
//     await Deno.writeTextFile(`${BUILD_PATH}/plugin.js`, pluginJSFile);

//     typeJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['type.js']));
//     typeJSFile = typeJSFile.replace(lostConfigRegex, lostConfigReplace);
//     await Deno.writeTextFile(`${BUILD_PATH}/type.js`, typeJSFile);

//     /**
//      * ./c3runtime folder
//      */
//     _actionsJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['c3runtime', 'actions.js']));
//     _actionsJSFile = _actionsJSFile.replace(lostConfigRegex, lostConfigReplace);
//     _actionsJSFile = _actionsJSFile.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Acts\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Acts = ${entitiesFunctions.Actions}`)
//     await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/actions.js`, _actionsJSFile);

//     _conditionsJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['c3runtime', 'conditions.js']));
//     _conditionsJSFile = _conditionsJSFile.replace(lostConfigRegex, lostConfigReplace);
//     _conditionsJSFile = _conditionsJSFile.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Cnds\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Cnds = ${entitiesFunctions.Conditions}`);
//     await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/conditions.js`, _conditionsJSFile);

//     _expressionsJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['c3runtime', 'expressions.js']));
//     _expressionsJSFile = _expressionsJSFile.replace(lostConfigRegex, lostConfigReplace);
//     _expressionsJSFile = _expressionsJSFile.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Exps\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Exps = ${entitiesFunctions.Expressions}`);
//     await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/expressions.js`, _expressionsJSFile);

//     _instanceJSFile = await transpileTsToJs(`${Deno.cwd()}/Addon/Instance.ts`) as string;
//     _instanceJSFile = _instanceJSFile.replace(configImportRegex, `${lostConfigReplace}\nconst Config = ${lostConfigVariableName}.Config;\n`);
//     await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/instance.js`, _instanceJSFile);

//     _pluginJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['c3runtime', 'plugin.js']));
//     _pluginJSFile = _pluginJSFile.replace(lostConfigRegex, lostConfigReplace);
//     await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/plugin.js`, _pluginJSFile);

//     _typeJSFile = await Deno.readTextFile(getBaseAddonFilePath(addonType, ['c3runtime', 'type.js']));
//     _typeJSFile = _typeJSFile.replace(lostConfigRegex, lostConfigReplace);
//     await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/type.js`, _typeJSFile);
// }

async function transpileTsToJs(filePath: string): Promise<string | null> {
    const project = new Project({
        compilerOptions: {
            target: 8,
            module: 7
        }
    });
    const sourceFile = project.addSourceFileAtPath(filePath);
    const transpiled = sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();
    return transpiled || null;
}
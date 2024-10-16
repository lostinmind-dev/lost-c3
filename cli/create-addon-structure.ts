import type { AddonType, IconType, LostConfig } from "../lib/common.ts";
import type { PluginProperty } from "../lib/plugin-props.ts";
import type { LostCategoryBase } from "../lib/entities.ts";
import type { AddonScript } from "./get-addon-scripts.ts";
import type { AddonFile } from "./get-addon-files.ts";
import { __dirname, BUILD_PATH } from "./paths.ts";
import type { AddonIcon, DefaultIcon } from "./get-addon-icon.ts";
import { Project } from "./cli-deps.ts";

export async function createAddonStructure(
    config: LostConfig<'plugin' | 'behavior'>, 
    pluginProperties: PluginProperty[],
    scripts: AddonScript[], 
    files: AddonFile[], 
    categories: LostCategoryBase[],
    icon: AddonIcon | DefaultIcon
) {
    try {
        await Deno.remove(BUILD_PATH, { recursive: true });
    } catch (e) {
        //return;
    }
    await Deno.mkdir(BUILD_PATH);
    await Deno.mkdir(`${BUILD_PATH}/c3runtime`);
    await Deno.mkdir(`${BUILD_PATH}/lang`);
    if (scripts.length > 0) await Deno.mkdir(`${BUILD_PATH}/scripts`);
    if (files.length > 0) await Deno.mkdir(`${BUILD_PATH}/files`);

    await Deno.copyFile(icon.path, `${BUILD_PATH}/${icon.filename}`);

    await copyBaseAddonFiles(config.Type, {
        Config: config,
        PluginProperties: pluginProperties,
        IconName: icon.filename,
        IconType: icon.type,
        Scripts: scripts.map(s => s.filename),
        Files: files.map(f => f.filename),
        RemoteScripts: config.RemoteScripts || []
    }, getEntitiesFunctions(categories));

    scripts.forEach(s => {
        Deno.copyFile(s.path, `${BUILD_PATH}/scripts/${s.filename}`);
    })

    files.forEach(f => {
        Deno.copyFile(f.path, `${BUILD_PATH}/files/${f.filename}`);
    })

}

interface AllEntitiesFunctions {
    Actions: any;
    Conditions: any;
    Expressions: any;
}

function getEntitiesFunctions(categories: LostCategoryBase[]): AllEntitiesFunctions {
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

interface ReplaceLostConfig {
    Config: LostConfig<'plugin' | 'behavior'>;
    PluginProperties: PluginProperty[];
    IconName: string;
    IconType: IconType;
    Scripts: string[];
    Files: string[];
    RemoteScripts: string[];
}

async function copyBaseAddonFiles(addonType: AddonType, lostConfig: ReplaceLostConfig, entitiesFunctions: AllEntitiesFunctions) {
    const lostConfigVariableName = 'LOST_CONFIG';
    const baseAddonPath = `${__dirname}/${addonType}_base/dist`;
    const lostConfigRegex = new RegExp(`const\\s+${lostConfigVariableName}\\s*=\\s*{\\s*};`);
    const configImportRegex = /import\s*{?\s*Config\s*}?\s*from\s*["'](?:@config|(?:\.\.\/)?lost\.config\.ts)["'];/;
    const lostConfigReplace = `const ${lostConfigVariableName} = ${JSON.stringify(lostConfig)};`;

    let instanceJSFile: string;
    let pluginJSFile: string;
    let typeJSFile: string;

    let _actionsJSFile: string;
    let _conditionsJSFile: string; 
    let _expressionsJSFile: string; 
    let _instanceJSFile: string;
    let _pluginJSFile: string;
    let _typeJSFile: string;

    /**
     * ./ folder
     */
    instanceJSFile = await Deno.readTextFile(`${baseAddonPath}/instance.js`);
    instanceJSFile = instanceJSFile.replace(lostConfigRegex, lostConfigReplace);
    await Deno.writeTextFile(`${BUILD_PATH}/instance.js`, instanceJSFile);

    pluginJSFile = await Deno.readTextFile(`${baseAddonPath}/plugin.js`);
    pluginJSFile = pluginJSFile.replace(lostConfigRegex, lostConfigReplace);
    await Deno.writeTextFile(`${BUILD_PATH}/plugin.js`, pluginJSFile);

    typeJSFile = await Deno.readTextFile(`${baseAddonPath}/type.js`);
    typeJSFile = typeJSFile.replace(lostConfigRegex, lostConfigReplace);
    await Deno.writeTextFile(`${BUILD_PATH}/type.js`, typeJSFile);

    /**
     * ./c3runtime folder
     */
    _actionsJSFile = await Deno.readTextFile(`${baseAddonPath}/c3runtime/actions.js`);
    _actionsJSFile = _actionsJSFile.replace(lostConfigRegex, lostConfigReplace);
    _actionsJSFile = _actionsJSFile.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Acts\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Acts = ${entitiesFunctions.Actions}`)
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/actions.js`, _actionsJSFile);

    _conditionsJSFile = await Deno.readTextFile(`${baseAddonPath}/c3runtime/conditions.js`);
    _conditionsJSFile = _conditionsJSFile.replace(lostConfigRegex, lostConfigReplace);
    _conditionsJSFile = _conditionsJSFile.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Cnds\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Cnds = ${entitiesFunctions.Conditions}`);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/conditions.js`, _conditionsJSFile);

    _expressionsJSFile = await Deno.readTextFile(`${baseAddonPath}/c3runtime/expressions.js`);
    _expressionsJSFile = _expressionsJSFile.replace(lostConfigRegex, lostConfigReplace);
    _expressionsJSFile = _expressionsJSFile.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Exps\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Exps = ${entitiesFunctions.Expressions}`);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/expressions.js`, _expressionsJSFile);

    _instanceJSFile = await transpileTsToJs(`${Deno.cwd()}/Addon/Instance.ts`) as string;
    _instanceJSFile = _instanceJSFile.replace(configImportRegex, `${lostConfigReplace}\nconst Config = ${lostConfigVariableName}.Config;\n`);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/instance.js`, _instanceJSFile);

    _pluginJSFile = await Deno.readTextFile(`${baseAddonPath}/c3runtime/plugin.js`);
    _pluginJSFile = _pluginJSFile.replace(lostConfigRegex, lostConfigReplace);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/plugin.js`, _pluginJSFile);

    _typeJSFile = await Deno.readTextFile(`${baseAddonPath}/c3runtime/type.js`);
    _typeJSFile = _typeJSFile.replace(lostConfigRegex, lostConfigReplace);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/type.js`, _typeJSFile);
}

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
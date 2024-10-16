import type { AddonType, LostConfig } from "../lib/common.ts";
import type { PluginProperty } from "../lib/plugin-props.ts";
import type { LostCategoryDefault } from "../lib/entities.ts";
import type { AddonScript } from "./get-addon-scripts.ts";
import type { AddonFile } from "./get-addon-files.ts";
import { ADDON_BASE_URL, ADDON_ICON_FOLDER_PATH, BUILD_PATH, LOCAL_ADDON_BASE_PATH } from "./paths.ts";
import type { AddonIcon } from "./get-addon-icon.ts";
import { Project } from "./cli-deps.ts";
import { path } from '../deps.ts';
import { LOGGER } from './misc.ts';

type AddonFiles = {
    readonly [K in AddonType]: [
        `c3runtime/${K}.js`,
        'c3runtime/type.js',
        'instance.js',
        'plugin.js',
        'type.js'
    ]
}

const ADDON_FILES: AddonFiles = {
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

interface CreateAddonStructureOptions {
    CONFIG: LostConfig<'plugin' | 'behavior'>;
    PLUGIN_PROPERTIES: PluginProperty[];
    SCRIPTS: AddonScript[];
    FILES: AddonFile[];
    CATEGORIES: LostCategoryDefault[];
    ICON: AddonIcon;
}

export async function createAddonStructure(options: CreateAddonStructureOptions, localBase: boolean) {
    const { CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, ICON, CATEGORIES } = options;
    try {
        await Deno.remove(BUILD_PATH, { recursive: true });
    } catch (e) {
        //return;
    }
    await Deno.mkdir(BUILD_PATH);
    await Deno.mkdir(`${BUILD_PATH}/c3runtime`);
    await Deno.mkdir(`${BUILD_PATH}/lang`);
    if (SCRIPTS.length > 0) {
        await Deno.mkdir(`${BUILD_PATH}/scripts`);
        SCRIPTS.forEach(script => {
            Deno.copyFile(script.path, `${BUILD_PATH}/scripts/${script.filename}`);
        })
    };
    if (FILES.length > 0) {
        await Deno.mkdir(`${BUILD_PATH}/files`);
        FILES.forEach(file => {
            Deno.copyFile(file.path, `${BUILD_PATH}/files/${file.filename}`);
        })
    };

    let instanceFileData = await transpileTsToJs(`${Deno.cwd()}/Addon/Instance.ts`) as string;
    instanceFileData = instanceFileData.replace(/import\s+Config\s+from\s+["'](?:@config|\.\.\/lost\.config\.ts)["'];/, `const Config = ${JSON.stringify(CONFIG)};`);
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/instance.js`, instanceFileData);

    if (!localBase) {
        if (!ICON.isDefault) {
            await Deno.copyFile(ICON.path, `${BUILD_PATH}/${ICON.filename}`);
        } else {
            const getIcon = await fetch(ICON.path);

            if (!getIcon.ok) {
                // failed to get default icon
                LOGGER.Error('build', `Failed to download default icon from url: ${ICON.path}`)
                Deno.exit();
            } else {
                const iconContent = await getIcon.text();
                await Deno.writeTextFile(`${BUILD_PATH}/${ICON.filename}`, iconContent)
            }
        }

        for await (const fileOrPath of ADDON_FILES[CONFIG.Type]) {
            try {
                const response = await fetch(`${ADDON_BASE_URL}/${CONFIG.Type}/${fileOrPath}`);
    
                if (!response.ok) {
                    LOGGER.Error('build', `Failed to fetch ${fileOrPath}`, response.statusText);
                    Deno.exit();
                }
    
                let fileContent = await response.text();
    
                fileContent = fileContent
                    .replace(/const\s+ADDON_ID\s*=\s*"";/, `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};`)
                    .replace(/const\s+CONFIG\s*=\s*\{\};/, `const CONFIG = ${JSON.stringify(CONFIG)};`)
                    .replace(/const\s+PLUGIN_PROPERTIES\s*=\s*\{\};/, `const PLUGIN_PROPERTIES = ${JSON.stringify(PLUGIN_PROPERTIES)};`)
                    .replace(/const\s+REMOTE_SCRIPTS\s*=\s*\[\];/, `const REMOTE_SCRIPTS = ${JSON.stringify(CONFIG.RemoteScripts || [])};`)
                    .replace(/const\s+SCRIPTS\s*=\s*\[\];/, `const SCRIPTS = ${JSON.stringify(SCRIPTS)};`)
                    .replace(/const\s+FILES\s*=\s*\[\];/, `const FILES = ${JSON.stringify(FILES)};`)
                    .replace(/const\s+ICON_NAME\s*=\s*"";/, `const ICON_NAME = ${JSON.stringify(ICON.filename)};`)
                    .replace(/const\s+ICON_TYPE\s*=\s*"";/, `const ICON_TYPE = ${JSON.stringify(ICON.type)};`)
    
                await Deno.writeTextFile(path.resolve(BUILD_PATH, fileOrPath), fileContent);
    
            } catch (error) {
                LOGGER.Error('build', `Error processing ${fileOrPath}:`, error);
                Deno.exit();
            }
        }
    } else {
        if (!ICON.isDefault) {
            await Deno.copyFile(`${ADDON_ICON_FOLDER_PATH}/${ICON.filename}`, `${BUILD_PATH}/${ICON.filename}`);
        } else {
            await Deno.copyFile(`${LOCAL_ADDON_BASE_PATH}/${ICON.filename}`, `${BUILD_PATH}/${ICON.filename}`);
        }

        for await (const fileOrPath of ADDON_FILES[CONFIG.Type]) {

            let fileContent = await Deno.readTextFile(`${LOCAL_ADDON_BASE_PATH}/${CONFIG.Type}/${fileOrPath}`);

            fileContent = fileContent
                    .replace(/const\s+ADDON_ID\s*=\s*"";/, `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};`)
                    .replace(/const\s+CONFIG\s*=\s*\{\};/, `const CONFIG = ${JSON.stringify(CONFIG)};`)
                    .replace(/const\s+PLUGIN_PROPERTIES\s*=\s*\{\};/, `const PLUGIN_PROPERTIES = ${JSON.stringify(PLUGIN_PROPERTIES)};`)
                    .replace(/const\s+REMOTE_SCRIPTS\s*=\s*\[\];/, `const REMOTE_SCRIPTS = ${JSON.stringify(CONFIG.RemoteScripts || [])};`)
                    .replace(/const\s+SCRIPTS\s*=\s*\[\];/, `const SCRIPTS = ${JSON.stringify(SCRIPTS)};`)
                    .replace(/const\s+FILES\s*=\s*\[\];/, `const FILES = ${JSON.stringify(FILES)};`)
                    .replace(/const\s+ICON_NAME\s*=\s*"";/, `const ICON_NAME = ${JSON.stringify(ICON.filename)};`)
                    .replace(/const\s+ICON_TYPE\s*=\s*"";/, `const ICON_TYPE = ${JSON.stringify(ICON.type)};`)
    
            await Deno.writeTextFile(path.resolve(BUILD_PATH, fileOrPath), fileContent);
        }        
    }

    const setializedEntities = serializeEntities(CATEGORIES);

    let entities = `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};\nconst C3 = globalThis.C3;\nC3.Plugins[ADDON_ID].Acts = ${setializedEntities.Actions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'actions.js'), entities);
    entities = `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};\nconst C3 = globalThis.C3;\nC3.Plugins[ADDON_ID].Cnds = ${setializedEntities.Conditions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'conditions.js'), entities);
    entities = `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};\nconst C3 = globalThis.C3;\nC3.Plugins[ADDON_ID].Exps = ${setializedEntities.Expressions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'expressions.js'), entities);

}

function serializeEntities(categories: LostCategoryDefault[]) {
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
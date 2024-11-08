// deno-lint-ignore-file
import type { LostConfig } from "../../lib/common.ts";
import type { Property } from "../../lib/plugin-props.ts";
import type { CategoryClassType } from "../../lib/entities.ts";
import type { AddonScript } from "../get-addon-scripts.ts";
import type { AddonFile } from "../get-addon-files.ts";
import type { AddonModule } from '../get-addon-modules.ts';
import type { AddonIcon } from "../get-addon-icon.ts";

import { ADDON_BASE_URL, BUILD_PATH } from "../paths.ts";
import { Project } from "../cli-deps.ts";
import { path } from '../../deps.ts';
import { LOGGER } from '../misc.ts';

const ADDON_FILES = {
    behavior: [
        'instance.js',
        'behavior.js',
        'type.js'
    ]
}

interface CreateAddonStructureOptions {
    CONFIG: LostConfig<'behavior'>;
    PLUGIN_PROPERTIES: Property[];
    SCRIPTS: AddonScript[];
    FILES: AddonFile[];
    MODULES: AddonModule[];
    CATEGORIES: CategoryClassType[];
    ICON: AddonIcon;
}

export async function createAddonBehaviorStructure(
    {CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, ICON, CATEGORIES}: CreateAddonStructureOptions
) {
    const localBase = false;

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
        let destinationPath: string;
        let destDir: string;

        SCRIPTS.forEach(async (script) => {
            switch (script.language) {
                case 'js':
                    destinationPath  = `${BUILD_PATH}/scripts/${script.relativePath}`;
                    destDir = destinationPath.substring(0, destinationPath.lastIndexOf("/"));

                    await Deno.mkdir(destDir, { recursive: true });

                    await Deno.copyFile(script.path, `${BUILD_PATH}/scripts/${script.relativePath}`);
                    break;
                case 'ts':
                    const newFileNameWithPath = script.relativePath.replace('.ts', '.js');

                    destinationPath  = `${BUILD_PATH}/scripts/${newFileNameWithPath}`;
                    destDir = destinationPath.substring(0, destinationPath.lastIndexOf("/"));

                    await Deno.mkdir(destDir, { recursive: true });

                    const scriptFileData = await transpileTsToJs(script.path) as string || '';

                    await Deno.writeTextFile(`${BUILD_PATH}/scripts/${newFileNameWithPath}`, scriptFileData);
                    break;
                default:
                    break;
            }
        })
    };
    if (FILES.length > 0) {
        await Deno.mkdir(`${BUILD_PATH}/files`);
        FILES.forEach(file => {
            Deno.copyFile(file.path, `${BUILD_PATH}/files/${file.filename}`);
        })
    };
    if (MODULES.length > 0) {
        await Deno.mkdir(`${BUILD_PATH}/c3runtime/Modules`);
        MODULES.forEach(module => {
            Deno.copyFile(module.path, `${BUILD_PATH}/c3runtime/Modules/${module.filename}`);
        })
    }

    let instanceFileData = await transpileTsToJs(`${Deno.cwd()}/Addon/Instance.ts`) as string;
    instanceFileData = `const Config = {AddonId: ${JSON.stringify(CONFIG.AddonId)}};\n${instanceFileData}`
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/instance.js`, instanceFileData);

    let behaviorFileData = await transpileTsToJs(`${Deno.cwd()}/Addon/Behavior.ts`) as string;
    behaviorFileData = `const Config = {AddonId: ${JSON.stringify(CONFIG.AddonId)}};\n${behaviorFileData}`
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/behavior.js`, behaviorFileData);

    let typeFileData = await transpileTsToJs(`${Deno.cwd()}/Addon/Type.ts`) as string;
    typeFileData = `const Config = {AddonId: ${JSON.stringify(CONFIG.AddonId)}};\n${typeFileData}`
    await Deno.writeTextFile(`${BUILD_PATH}/c3runtime/type.js`, typeFileData);

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
                    .replace(/const\s+PLUGIN_PROPERTIES\s*=\s*\[\];/, `const PLUGIN_PROPERTIES = ${JSON.stringify(PLUGIN_PROPERTIES)};`)
                    .replace(/const\s+REMOTE_SCRIPTS\s*=\s*\[\];/, `const REMOTE_SCRIPTS = ${JSON.stringify(CONFIG.RemoteScripts || [])};`)
                    .replace(/const\s+SCRIPTS\s*=\s*\[\];/, `const SCRIPTS = ${JSON.stringify(SCRIPTS)};`)
                    .replace(/const\s+FILES\s*=\s*\[\];/, `const FILES = ${JSON.stringify(FILES)};`)
                    .replace(/const\s+MODULES\s*=\s*\[\];/, `const MODULES = ${JSON.stringify(MODULES)};`)
                    .replace(/const\s+ICON_NAME\s*=\s*"";/, `const ICON_NAME = ${JSON.stringify(ICON.filename)};`)
                    .replace(/const\s+ICON_TYPE\s*=\s*"";/, `const ICON_TYPE = ${JSON.stringify(ICON.type)};`)
    
                await Deno.writeTextFile(path.resolve(BUILD_PATH, fileOrPath), fileContent);
    
            } catch (error) {
                LOGGER.Error('build', `Error processing ${fileOrPath}:`, error);
                Deno.exit();
            }
        }
    }

    const setializedEntities = serializeEntities(CATEGORIES);

    let entities = `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};\nconst C3 = globalThis.C3;\nC3.Behaviors[ADDON_ID].Acts = ${setializedEntities.Actions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'actions.js'), entities);
    entities = `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};\nconst C3 = globalThis.C3;\nC3.Behaviors[ADDON_ID].Cnds = ${setializedEntities.Conditions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'conditions.js'), entities);
    entities = `const ADDON_ID = ${JSON.stringify(CONFIG.AddonId)};\nconst C3 = globalThis.C3;\nC3.Behaviors[ADDON_ID].Exps = ${setializedEntities.Expressions};`;
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'expressions.js'), entities);
    
    const main = `import "./behavior.js";\nimport "./type.js";\nimport "./instance.js";\nimport "./conditions.js";\nimport "./actions.js";\nimport "./expressions.js";`
    await Deno.writeTextFile(path.resolve(BUILD_PATH, 'c3runtime', 'main.js'), main);

}

function serializeEntities(categories: CategoryClassType[]) {
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
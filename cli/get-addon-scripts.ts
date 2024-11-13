import { Colors } from '../deps.ts';
import type { LostConfig, ScriptDependencyType } from "../lib/common.ts";
import { LOGGER } from "./misc.ts";
import { ADDON_SCRIPTS_FOLDER_PATH } from "./paths.ts";

export interface AddonScript {
    filename: string;
    scriptType?: 'module';
    path: string;
    relativePath: string;
    dependencyType: ScriptDependencyType;
    language: 'js' | 'ts';
}

export async function getAddonScripts(config: LostConfig<'plugin' | 'behavior' | 'drawing-plugin'>) {
    LOGGER.Searching('Searching for scripts');

    const scripts: AddonScript[] = [];

    try {
        const dirInfo = await Deno.stat(ADDON_SCRIPTS_FOLDER_PATH);

        const readScriptsDirectory = async (path: string) => {
            for await (const entry of Deno.readDir(path)) {
                if (entry.isDirectory) {
                    await readScriptsDirectory(`${path}/${entry.name}`);
                }
                if (entry.isFile && (entry.name.endsWith('.js') || entry.name.endsWith('.ts'))) {
                    const language = (entry.name.endsWith('.js')) ? 'js' : 'ts';
                    const scriptInConfig = config.Scripts?.find(script => script.FileName === entry.name);
                    if (scriptInConfig) {
                        LOGGER.Info(`Founded ${(language === 'js') ? Colors.yellow('Javascript') : Colors.blue('Typescript')} script: ${entry.name}`, `Loading with dependency type: ${scriptInConfig.Type}`);
                    } else {
                        LOGGER.Info(`Founded ${(language === 'js') ? Colors.yellow('Javascript') : Colors.blue('Typescript')} script: ${entry.name}`, `Loading with default dependency type: ${"external-dom-script"}`);
                    }
    
                    const basePath = 'Addon/Scripts';
                    const relativePathIndex = path.indexOf(basePath);
    
                    const relativePath = path.substring(relativePathIndex + basePath.length + 1);
    
                    scripts.push({
                        filename: entry.name,
                        scriptType: (scriptInConfig && scriptInConfig.Type === 'external-dom-script' && scriptInConfig.ScriptType) ? scriptInConfig.ScriptType : undefined,
                        path: `${path}/${entry.name}`,
                        relativePath: `${relativePath}/${entry.name}`,
                        dependencyType: (scriptInConfig) ? scriptInConfig.Type : 'external-dom-script',
                        language: language
                    })
                }
            }
        }

        if (dirInfo.isDirectory) {
            await readScriptsDirectory(ADDON_SCRIPTS_FOLDER_PATH);
            return scripts;
        }
    } catch (e) {
        return scripts;
    }

    return scripts;
}
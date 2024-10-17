import type { LostConfig, ScriptDependencyType } from "../lib/common.ts";
import { LOGGER } from "./misc.ts";
import { ADDON_SCRIPTS_FOLDER_PATH } from "./paths.ts";

export interface AddonScript {
    filename: string;
    scriptType?: 'module';
    path: string;
    dependencyType: ScriptDependencyType;
}

export async function getAddonScripts(config: LostConfig<'plugin' | 'behavior'>) {
    LOGGER.Searching('Searching for scripts');

    const scripts: AddonScript[] = [];

    const readScriptsDirectory = async (path: string) => {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await readScriptsDirectory(`${path}/${entry.name}`);
            }
            if (entry.isFile && entry.name.endsWith('.js')) {
                const scriptInConfig = config.Scripts?.find(script => script.FileName === entry.name);
                if (scriptInConfig) {
                    LOGGER.Info(`Founded script: ${entry.name}`, `Loading with dependency type: ${scriptInConfig.Type}`);
                } else {
                    LOGGER.Info(`Founded script: ${entry.name}`, `Loading with default dependency type: ${"external-dom-script"}`);
                }
                scripts.push({
                    filename: entry.name,
                    scriptType: (scriptInConfig && scriptInConfig.Type === 'external-dom-script' && scriptInConfig.ScriptType) ? scriptInConfig.ScriptType : undefined,
                    path: `${path}/${entry.name}`,
                    dependencyType: (scriptInConfig) ? scriptInConfig.Type : 'external-dom-script'
                })
            }
        }
    }
    
    await readScriptsDirectory(ADDON_SCRIPTS_FOLDER_PATH);

    return scripts;
}
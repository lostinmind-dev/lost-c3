import { LOGGER } from "./misc.ts";
import { ADDON_MODULES_FOLDER_PATH } from "./paths.ts";

export interface AddonModule {
    filename: string;
    path: string;
}

export async function getAddonModules() {
    LOGGER.Searching('Searching for modules');
    
    const modules: AddonModule[] = [];

    const readModulesDirectory = async (path: string) => {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await readModulesDirectory(`${path}/${entry.name}`);
            }
            if (entry.isFile && entry.name.endsWith('.js')) {
                LOGGER.Info(`Founded module: ${entry.name}`);
                modules.push({
                    filename: entry.name,
                    path: `${path}/${entry.name}`
                })
            }
        }
    }
    
    await readModulesDirectory(ADDON_MODULES_FOLDER_PATH);

    return modules;
}
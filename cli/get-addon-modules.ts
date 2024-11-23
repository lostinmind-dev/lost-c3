import { LOGGER } from "./misc.ts";
import { ADDON_MODULES_FOLDER_PATH } from "./paths.ts";

export interface AddonModule {
    filename: string;
    path: string;
}

export async function getAddonModules() {
    const modules: AddonModule[] = [];

    try {
        const dirInfo = await Deno.stat(ADDON_MODULES_FOLDER_PATH);

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

        if (dirInfo.isDirectory) {
            LOGGER.Searching('Searching for modules');
            await readModulesDirectory(ADDON_MODULES_FOLDER_PATH);
            return modules;
        }
    } catch (e) {
        return modules;
    }

    return modules;
}
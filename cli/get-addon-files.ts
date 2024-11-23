import type { LostConfig, FileDependencyType } from "../lib/common.ts";
import { getMIMEFileType, LOGGER } from "./misc.ts";
import { ADDON_FILES_FOLDER_PATH } from "./paths.ts";

export interface AddonFile {
    filename: string;
    fileType?: string;
    path: string;
    dependencyType: FileDependencyType;
}

export async function getAddonFiles(config: LostConfig<'plugin' | 'behavior' | 'drawing-plugin'>) {
    
    const files: AddonFile[] = [];

    try {
        const dirInfo = await Deno.stat(ADDON_FILES_FOLDER_PATH);

        const readFilesDirectory = async (path: string) => {
            for await (const entry of Deno.readDir(path)) {
                if (entry.isDirectory) {
                    await readFilesDirectory(`${path}/${entry.name}`);
                }
                if (entry.isFile) {
                    const fileInConfig = config.Files?.find(file => file.FileName === entry.name);
                    if (fileInConfig) {
                        LOGGER.Info(`Founded file: ${entry.name}`, `Loading with type: ${fileInConfig.Type}`);
                    } else {
                        LOGGER.Info(`Founded file: ${entry.name}`, `Loading with default type: ${(entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output'}`);
                    }
                    const dependencyType = (fileInConfig) ? fileInConfig.Type : (entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output';
                    files.push({
                        filename: entry.name,
                        fileType: (dependencyType === 'copy-to-output') ? getMIMEFileType(entry.name) : undefined,
                        path: `${path}/${entry.name}`,
                        dependencyType: dependencyType
                    })
                }
            }
        }

        if (dirInfo.isDirectory) {
            LOGGER.Searching('Searching for files');
            await readFilesDirectory(ADDON_FILES_FOLDER_PATH);
            return files;
        }
    } catch (e) {
        return files;
    }

    return files;
}
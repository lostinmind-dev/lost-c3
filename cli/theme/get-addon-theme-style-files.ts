import { LOGGER } from '../misc.ts';
import { THEME_ADDON_STYLES_FOLDER_PATH } from "../paths.ts";

export interface AddonThemeStyleFile {
    filename: string;
    path: string;
}

export async function getAddonThemeStyleFiles() {
    LOGGER.Searching('Searching for files');
    
    const styleFiles: AddonThemeStyleFile[] = [];

    const readFilesDirectory = async (path: string) => {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await readFilesDirectory(`${path}/${entry.name}`);
            }
            if (entry.isFile && entry.name.endsWith('.css')) {
                LOGGER.Info(`Founded style file: ${entry.name}`);
                styleFiles.push({
                    filename: entry.name,
                    path: `${path}/${entry.name}`
                })
            }
        }
    }
    
    await readFilesDirectory(THEME_ADDON_STYLES_FOLDER_PATH);

    return styleFiles;
}
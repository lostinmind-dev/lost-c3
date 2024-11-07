import { LOGGER } from '../misc.ts';
import { EFFECT_ADDON_FILES_FOLDER_PATH } from "../paths.ts";

export interface AddonEffectFile {
    filename: string;
    path: string;
}

export async function getAddonEffectFiles() {
    LOGGER.Searching('Searching for files');
    
    const effectFiles: AddonEffectFile[] = [];

    const readFilesDirectory = async (path: string) => {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await readFilesDirectory(`${path}/${entry.name}`);
            }
            if (entry.isFile && (entry.name.endsWith('.fx') || entry.name.endsWith('.wgsl'))) {
                LOGGER.Info(`Founded effect file: ${entry.name}`);
                effectFiles.push({
                    filename: entry.name,
                    path: `${path}/${entry.name}`
                })
            }
        }
    }
    
    await readFilesDirectory(EFFECT_ADDON_FILES_FOLDER_PATH);

    return effectFiles;
}
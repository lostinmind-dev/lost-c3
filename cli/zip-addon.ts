import type { LostConfig } from "../lib/common.ts";
import { walk, zip } from "./cli-deps.ts";
import { ADDONS_COLLECTION_PATH, BUILD_PATH } from "./paths.ts";

export async function zipAddon(config: LostConfig<'plugin' | 'behavior'>) {
    const files: {
        name: string;
        data: Uint8Array;
    }[] = [];

    // Add top files
    for await (const entry of walk(BUILD_PATH)) {
        const {isFile, path} = entry;
        if (isFile) {
            const data = await Deno.readFile(path);
            const relativePath = entry.path.substring(BUILD_PATH.length + 1);
            
            files.push({name: relativePath, data});
        }
    }

    //console.log(files);
    const buffer = await zip.create(files);
    const addonFile = `${config.AddonId}_${config.Version}.c3addon`;
    await Deno.writeFile(`${ADDONS_COLLECTION_PATH}/${addonFile}`, buffer);

    /**
     * Remove all files after build
     */
    await Deno.remove(BUILD_PATH, { recursive: true });
}
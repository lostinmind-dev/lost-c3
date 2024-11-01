import type { AddonType, LostConfig } from "../lib/common.ts";
import { walk, BlobWriter, ZipWriter, TextReader } from "./cli-deps.ts";
import { ADDONS_COLLECTION_PATH, BUILD_PATH } from "./paths.ts";

export async function zipAddon(config: LostConfig<AddonType>) {
    const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
    const addonFilePath = `${ADDONS_COLLECTION_PATH}/${config.AddonId}_${config.Version}`;

    for await (const entry of walk(BUILD_PATH)) {
        const {isFile, path} = entry;
        if (isFile) {
            const data = await Deno.readTextFile(path);
            const relativePath = path.substring(BUILD_PATH.length + 1).replace(/\\/g, "/");;
            // console.log(relativePath);
            zipWriter.add(relativePath, new TextReader(data))
        }
    }
    const blob = await zipWriter.close();

    // const url = URL.createObjectURL(blob);
    // console.log("Ссылка для скачивания архива:", url);

    await Deno.writeFile(`${addonFilePath}.zip`, new Uint8Array(await blob.arrayBuffer()))
    await Deno.rename(`${addonFilePath}.zip`, `${addonFilePath}.c3addon`);
}
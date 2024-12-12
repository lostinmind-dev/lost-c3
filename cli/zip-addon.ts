import { join, walk, BlobWriter, ZipWriter, TextReader } from "../deps.ts";
import type { AddonType, LostConfig } from "../lib/config.ts";
import { Paths } from "../shared/paths.ts";

export default async function zipAddon(config: LostConfig<AddonType>) {
    const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
    const addonFilePath = join(Paths.ProjectFolders.Builds, `${config.addonId}_${config.version}`)

    for await (const entry of walk(Paths.ProjectFolders.Build)) {
        const {isFile, path} = entry;
        if (isFile) {
            const data = await Deno.readTextFile(path);
            const relativePath = path.substring(Paths.ProjectFolders.Build.length + 1).replace(/\\/g, "/");;

            zipWriter.add(relativePath, new TextReader(data))
        }
    }
    const blob = await zipWriter.close();

    await Deno.writeFile(`${addonFilePath}.zip`, new Uint8Array(await blob.arrayBuffer()))
    await Deno.rename(`${addonFilePath}.zip`, `${addonFilePath}.c3addon`);
}
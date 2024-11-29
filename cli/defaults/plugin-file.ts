import { join } from "../../deps.ts";
import { Paths } from "../../shared/paths.ts";
import type { LostAddonData } from "../../shared/types.ts";

export default async function getDefaultAddonPluginFile(lostData: LostAddonData) {
    let fileContent = await Deno.readTextFile(join(Paths.Main, '.addon_base', 'plugin.js'))

    fileContent = `const _lostData = ${JSON.stringify(lostData, null, 4)};\n` + fileContent;

    return fileContent;
}
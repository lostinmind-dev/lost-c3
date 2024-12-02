import { Paths } from "../../shared/paths.ts";
import type { LostAddonPluginData } from "../../shared/types.ts";

export default async function file(lostData: LostAddonPluginData) {
    let fileContent = await Deno.readTextFile(Paths.LocalAddonBase['plugin'])

    fileContent = `const _lostData = ${JSON.stringify(lostData)};\n` + fileContent;

    return fileContent;
}
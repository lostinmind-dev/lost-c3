import { Paths } from "../../shared/paths.ts";
import type { LostAddonData } from "../../shared/types.ts";

export default async function getDefaultBehaviorFile(lostData: LostAddonData) {
    let fileContent = await Deno.readTextFile(Paths.LocalAddonBase['behavior'])

    fileContent = `const _lostData = ${JSON.stringify(lostData)};\n` + fileContent;

    return fileContent;
}
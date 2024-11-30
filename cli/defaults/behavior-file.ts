import { Paths } from "../../shared/paths.ts";
import type { LostAddonBehaviorData } from "../../shared/types.ts";

export default async function behaviorFile(lostData: LostAddonBehaviorData) {
    let fileContent = await Deno.readTextFile(Paths.LocalAddonBase['behavior'])

    fileContent = `const _lostData = ${JSON.stringify(lostData)};\n` + fileContent;

    return fileContent;
}
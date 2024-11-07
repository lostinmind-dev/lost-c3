import type { AddonEffectFile } from './get-addon-effect-files.ts';

import { BUILD_PATH } from "../paths.ts";

interface CreateAddonStructureOptions {
    EFFECT_FILES: AddonEffectFile[];
}

export async function createAddonEffectStructure({EFFECT_FILES}: CreateAddonStructureOptions) {
    try {
        await Deno.remove(BUILD_PATH, { recursive: true });
    } catch (e) {
        //return;
    }
    await Deno.mkdir(BUILD_PATH);
    await Deno.mkdir(`${BUILD_PATH}/lang`);

    if (EFFECT_FILES.length > 0) {
        EFFECT_FILES.forEach(effectFile => {
            Deno.copyFile(effectFile.path, `${BUILD_PATH}/${effectFile.filename}`);
        })
    }

}
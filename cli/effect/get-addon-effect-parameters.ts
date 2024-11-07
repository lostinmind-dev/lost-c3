import { getModule } from "../misc.ts";
import type { EffectParameter } from "../../lib/params.ts";
import { EFFECT_PARAMETERS_FILE_PATH } from "../paths.ts";

interface EffectParametersModule {
    default: EffectParameter<any>[];
}

export async function getAddonThemeEffectParameters() {
    const module = await getModule<EffectParametersModule>(EFFECT_PARAMETERS_FILE_PATH);
    return module.default;
};
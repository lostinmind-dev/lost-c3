import type { LanguageJSON } from "../../lib/json.ts";
import type { LostConfig } from "../../lib/common.ts";
import type { EffectParameter } from '../../lib/params.ts';
import type { EffectParameterOptions } from '../../lib/params/EffectParameters.ts';

import { BUILD_PATH } from "../paths.ts";

interface CreateLanguageJSONOptions {
    CONFIG: LostConfig<'effect'>;
    PARAMETERS: EffectParameter<EffectParameterOptions>[];
}

export async function createAddonEffectLanguageJSON({CONFIG, PARAMETERS}: CreateLanguageJSONOptions) {
    const LanguageJSON = {
        "languageTag": "en-US",
        "fileDescription": `Strings for ${CONFIG.AddonName} addon.`,
        "text": {
            "effects": {
                [CONFIG.AddonId.toLowerCase()]: {
                    "name": CONFIG.AddonName,
                    "description": CONFIG.AddonDescription,
                    "parameters": {}
                }
            }
        }
    } as LanguageJSON.Effect;

    const DeepJSON = LanguageJSON['text']['effects'][CONFIG.AddonId.toLowerCase()];

    PARAMETERS.forEach(parameter => {
        const {Id, Name, Description} = parameter.Options;
        DeepJSON['parameters'][Id] = {
            "name": Name,
            "desc": Description || ''
        }
    })

    await Deno.writeTextFile(`${BUILD_PATH}/lang/en-US.json`, JSON.stringify(LanguageJSON, null, 4));
}
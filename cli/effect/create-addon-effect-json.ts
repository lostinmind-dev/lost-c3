import type { EffectParameter } from "../../lib/params.ts";
import type { AddonEffectFile } from './get-addon-effect-files.ts';
import type { LostConfig } from "../../lib/common.ts";
import type { AddonJSON } from "../../lib/json.ts";
import type { EffectParameterOptions } from '../../lib/params/EffectParameters.ts';

import { BUILD_PATH } from "../paths.ts";

interface CreateAddonJSONOptions {
    CONFIG: LostConfig<'effect'>;
    EFFECT_FILES: AddonEffectFile[];
    PARAMETERS: EffectParameter<EffectParameterOptions>[];
}

export async function createAddonEffectJSON({CONFIG, EFFECT_FILES, PARAMETERS}: CreateAddonJSONOptions) {
    const AddonJSON: AddonJSON.Effect = {
        "is-deprecated": CONFIG.Deprecated || false,
        "is-c3-addon": true,
        "type": CONFIG.Type,
        "name": CONFIG.AddonName,
        "id": CONFIG.AddonId,
        "version": CONFIG.Version,
        "author": CONFIG.Author,
        "website": CONFIG.WebsiteURL,
        "documentation": CONFIG.DocsURL,
        "description": CONFIG.AddonDescription,
        "file-list": [
            "lang/en-US.json",
            "addon.json",
        ],
        "category": CONFIG.Category,
        "supported-renderers": CONFIG.SupportedRenderers,
        "uses-depth": CONFIG.UsesDepth,
        "cross-sampling": CONFIG.CrossSampling,
        "preserves-opaqueness": CONFIG.PreservesOpaqueness,
        "animated": CONFIG.Animated,
        "must-predraw": CONFIG.MustPredraw || false,
        "supports-3d-direct-rendering": CONFIG.Supports3DDirectRendering || false,
        "extend-box": {
            "horizontal": CONFIG.ExtendBox[0],
            "vertical": CONFIG.ExtendBox[1],
        },
        "blends-background": CONFIG.BlendsBackground,
        "parameters": []
    };

    PARAMETERS.forEach(parameter => {
        const {Id, Type, InitialValue, Uniform} = parameter.Options;
        AddonJSON['parameters'].push({
            "id": Id,
            "type": Type,
            "initial-value": InitialValue,
            "uniform": Uniform
        })
    })

    EFFECT_FILES.forEach(effectFile => {
        AddonJSON['file-list'].push(`${effectFile.filename}`);
    });

    await Deno.writeTextFile(`${BUILD_PATH}/addon.json`, JSON.stringify(AddonJSON, null, 4));
}
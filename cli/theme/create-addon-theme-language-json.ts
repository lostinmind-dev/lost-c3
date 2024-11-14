import type { LanguageJSON } from "../../lib/json.ts";
import type { LostConfig } from "../../lib/common.ts";

import { BUILD_PATH } from "../paths.ts";

interface CreateLanguageJSONOptions {
    CONFIG: LostConfig<'theme'>;
}

export async function createAddonThemeLanguageJSON({CONFIG}: CreateLanguageJSONOptions) {
    const LanguageJSON = {
        "languageTag": "en-US",
        "fileDescription": `Strings for ${CONFIG.AddonName} addon.`,
        "text": {
            "themes": {
                [CONFIG.AddonId.toLowerCase()]: {
                    "name": CONFIG.AddonName,
                    "description": CONFIG.AddonDescription,
                    "help-url": CONFIG.DocsURL,
                }
            }
        }
    } as LanguageJSON.Theme;

    await Deno.writeTextFile(`${BUILD_PATH}/lang/en-US.json`, JSON.stringify(LanguageJSON, null, 4));
}
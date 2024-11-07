import type { AddonThemeStyleFile } from './get-addon-theme-style-files.ts';
import type { AddonIcon } from "../get-addon-icon.ts";
import type { LostConfig } from "../../lib/common.ts";
import type { AddonJSON } from "../../lib/json.ts";

import { BUILD_PATH } from "../paths.ts";

interface CreateAddonJSONOptions {
    CONFIG: LostConfig<'theme'>;
    STYLE_FILES: AddonThemeStyleFile[];
    ICON: AddonIcon;
}

export async function createAddonThemeJSON({CONFIG, STYLE_FILES, ICON}: CreateAddonJSONOptions) {
    const AddonJSON: AddonJSON.Theme = {
        "is-c3-addon": true,
        "type": CONFIG.Type,
        "name": CONFIG.AddonName,
        "id": CONFIG.AddonId,
        "version": CONFIG.Version,
        "author": CONFIG.Author,
        "website": CONFIG.WebsiteURL,
        "documentation": CONFIG.DocsURL,
        "description": CONFIG.AddonDescription,
        "stylesheets": [],
        "file-list": [
            "lang/en-US.json",
            "addon.json",
            `${ICON.filename}`
        ]
    };

    STYLE_FILES.forEach(styleFile => {
        AddonJSON['stylesheets'].push(`${styleFile.filename}`);
        AddonJSON['file-list'].push(`${styleFile.filename}`);
    });

    await Deno.writeTextFile(`${BUILD_PATH}/addon.json`, JSON.stringify(AddonJSON, null, 4));
}
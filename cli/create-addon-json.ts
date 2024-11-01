import type { AddonIcon } from "./get-addon-icon.ts";
import type { LostConfig } from "../lib/common.ts";
import type { AddonScript } from "./get-addon-scripts.ts";
import type { AddonFile } from "./get-addon-files.ts";
import type { AddonJSON } from "../lib/json.ts";
import type { AddonModule } from './get-addon-modules.ts';

import { BUILD_PATH } from "./paths.ts";

interface CreateAddonJSONOptions {
    CONFIG: LostConfig<'plugin' | 'behavior'>;
    ICON: AddonIcon;
    SCRIPTS: AddonScript[];
    FILES: AddonFile[];
    MODULES: AddonModule[];
}

export async function createAddonJSON(options: CreateAddonJSONOptions) {
    const { CONFIG, ICON, SCRIPTS, FILES, MODULES } = options;
    const AddonJSON: AddonJSON = {
        "supports-worker-mode": (CONFIG.SupportsWorkerMode) ? CONFIG.SupportsWorkerMode : undefined,
        "min-construct-version": (CONFIG.MinConstructVersion) ? CONFIG.MinConstructVersion : undefined,
        "is-c3-addon": true,
        "sdk-version": 2,
        "type": CONFIG.Type,
        "name": CONFIG.AddonName,
        "id": CONFIG.AddonId,
        "version": CONFIG.Version,
        "author": CONFIG.Author,
        "website": CONFIG.WebsiteURL,
        "documentation": CONFIG.DocsURL,
        "description": CONFIG.AddonDescription,
        "editor-scripts": [
            `${(CONFIG.Type === 'plugin') ? 'plugin.js' : 'behavior.js'}`,
            "type.js",
            "instance.js"
        ],
        "file-list": [
            `${(CONFIG.Type === 'plugin') ? 'c3runtime/plugin.js' : 'c3runtime/behavior.js'}`,
            "c3runtime/type.js",
            "c3runtime/instance.js",
            "c3runtime/conditions.js",
            "c3runtime/actions.js",
            "c3runtime/expressions.js",
            "c3runtime/main.js",
            "lang/en-US.json",
            "aces.json",
            "addon.json",
            `${(CONFIG.Type === 'plugin') ? 'plugin.js' : 'behavior.js'}`,
            "instance.js",
            "type.js",
            `${ICON.filename}`
        ]
    };

    SCRIPTS.forEach(script => AddonJSON['file-list'].push(`scripts/${script.filename}`));
    FILES.forEach(file => AddonJSON['file-list'].push(`files/${file.filename}`));
    MODULES.forEach(module => AddonJSON['file-list'].push(`modules/${module.filename}`));

    await Deno.writeTextFile(`${BUILD_PATH}/addon.json`, JSON.stringify(AddonJSON, null, 4));
}
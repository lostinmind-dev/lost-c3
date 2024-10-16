import type { AddonIcon, DefaultIcon } from "./get-addon-icon.ts";
import type { LostConfig } from "../lib/common.ts";
import type { AddonScript } from "./get-addon-scripts.ts";
import type { AddonFile } from "./get-addon-files.ts";
import { AddonJSON } from "../lib/json.ts";
import { BUILD_PATH } from "./paths.ts";


export async function createAddonJSON(
    config: LostConfig<'plugin' | 'behavior'>,
    icon: AddonIcon | DefaultIcon,
    scripts: AddonScript[],
    files: AddonFile[]
) {
    const AddonJSON: AddonJSON = {
        "supports-worker-mode": (config.SupportsWorkerMode) ? config.SupportsWorkerMode : undefined,
        "min-construct-version": (config.MinConstructVersion) ? config.MinConstructVersion : undefined,
        "is-c3-addon": true,
        "sdk-version": 2,
        "type": config.Type,
        "name": config.AddonName,
        "id": config.AddonId,
        "version": config.Version,
        "author": config.Author,
        "website": config.WebsiteURL,
        "documentation": config.DocsURL,
        "description": config.AddonDescription,
        "editor-scripts": [
            `${(config.Type === 'plugin') ? 'plugin.js' : 'behavior.js'}`,
            "type.js",
            "instance.js"
        ],
        "file-list": [
            `${(config.Type === 'plugin') ? 'c3runtime/plugin.js' : 'c3runtime/behavior.js'}`,
            "c3runtime/type.js",
            "c3runtime/instance.js",
            "c3runtime/conditions.js",
            "c3runtime/actions.js",
            "c3runtime/expressions.js",
            "lang/en-US.json",
            "aces.json",
            "addon.json",
            `${(config.Type === 'plugin') ? 'plugin.js' : 'behavior.js'}`,
            "instance.js",
            "type.js",
            `${icon.filename}`
        ]
    };

    scripts.forEach(script => AddonJSON['file-list'].push(`scripts/${script.filename}`));
    files.forEach(file => AddonJSON['file-list'].push(`files/${file.filename}`));

    await Deno.writeTextFile(`${BUILD_PATH}/addon.json`, JSON.stringify(AddonJSON, null, 4));
}
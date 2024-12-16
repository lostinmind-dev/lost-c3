import type { AddonJSON } from "../../shared/types/json/addon.ts";
import { AddonFileManager } from "./addon-file-manager.ts";
import { LostAddonProject } from "../lost.ts";

export abstract class AddonMetadataManager {

    static async create(): Promise<AddonJSON> {
        const config = LostAddonProject.addon._config;
        const addon: AddonJSON = {
            "supports-worker-mode": (config.supportWorkerMode) ? config.supportWorkerMode : true,
            "min-construct-version": (config.minConstructVersion) ? config.minConstructVersion : undefined,
            "is-c3-addon": true,
            "sdk-version": 2,
            "type": config.type,
            "name": config.addonName,
            "id": config.addonId,
            "version": config.version,
            "author": config.author,
            "website": config.websiteUrl,
            "documentation": config.docsUrl,
            "description": config.addonDescription,
            "editor-scripts": [
                "type.js",
                "instance.js"
            ],
            "file-list": await AddonFileManager.getFilesList()
        }

        switch (config.type) {
            case "plugin":
                addon['editor-scripts'].push('plugin.js');
                break;
            case "behavior":
                addon['editor-scripts'].push('behavior.js');
                break;
        }

        return addon
    }
}
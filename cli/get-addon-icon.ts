import type { IconType } from "../lib/common.ts";
import { LOGGER, WarningMessage } from "./misc.ts";
import { ADDON_ICON_FOLDER_PATH } from "./paths.ts";

export interface AddonIcon {
    filename: string;
    path: string;
    type: IconType;
}

export async function getAddonIcon(): Promise<AddonIcon> {
    LOGGER.Searching('Looking for addon icon in png/svg format')
    for await (const entry of Deno.readDir(ADDON_ICON_FOLDER_PATH)) {
        if (entry.isFile) {
            const isPng = entry.name.endsWith('.png');
            const isSvg = entry.name.endsWith('.svg');
            if (isPng || isSvg) {
                return {
                    filename: entry.name,
                    path: `${ADDON_ICON_FOLDER_PATH}/${entry.name}`,
                    type: (isPng) ? 'image/png' : 'image/svg+xml'  
                } as AddonIcon;
            }
        }
    }

    LOGGER.Error('build', WarningMessage.ICON_NOT_DETECTED_OR_WRONG_FORMAT);
    Deno.exit();
}
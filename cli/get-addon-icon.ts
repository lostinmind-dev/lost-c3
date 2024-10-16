import type { IconType } from "../lib/common.ts";
import { LOGGER, WarningMessage } from "./misc.ts";
import { ADDON_ICON_FOLDER_PATH, DEFAULT_ICON_PATH } from "./paths.ts";

export interface AddonIcon {
    filename: string;
    path: string;
    type: IconType;
}

export interface DefaultIcon {
    filename: 'ico.svg',
    path: string;
    type: IconType
}

export async function getAddonIcon(): Promise<AddonIcon | DefaultIcon> {

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

    LOGGER.Warning(WarningMessage.ICON_NOT_DETECTED_OR_WRONG_FORMAT);
    return {
        filename: 'ico.svg',
        path: DEFAULT_ICON_PATH,
        type: 'image/svg+xml'
    } as DefaultIcon;
}
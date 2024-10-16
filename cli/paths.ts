import type { AddonType } from "../lib/common.ts";
import { path } from "./cli-deps.ts";
import { __dirname } from "./get-library-directory.ts";
/**
 * Change in release to false
 */

export const BUILD_PATH = `${Deno.cwd()}/Builds/Source`;

export const ADDONS_COLLECTION_PATH = `${Deno.cwd()}/Builds`;

export const CONFIG_FILE_PATH = `file://${Deno.cwd()}/lost.config.ts`;

export const PLUGIN_PROPERTIES_FILE_PATH = `file://${Deno.cwd()}/Addon/PluginProperties.ts`;

export const ADDON_SCRIPTS_FOLDER_PATH = `${Deno.cwd()}/Addon/Scripts`;

export const ADDON_FILES_FOLDER_PATH = `${Deno.cwd()}/Addon/Files`;

export const ADDON_CATEGORIES_FOLDER_PATH = `${Deno.cwd()}/Addon/Categories`;

export const ADDON_ICON_FOLDER_PATH = `${Deno.cwd()}/Addon`;

export const DEFAULT_ICON_PATH = path.join(__dirname, 'plugin_base', 'ico.svg');

export function getBaseAddonFilePath(addonType: AddonType, paths: string[]) {
    return path.join(__dirname, `${addonType}_base`, 'dist', ...paths);
}
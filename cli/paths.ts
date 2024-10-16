import { path } from "./cli-deps.ts";
import { getLibraryDirectory } from "./misc.ts";

/**
 * Change in release to false
 */
export const __dirname = getLibraryDirectory(true);

export const BUILD_PATH = `${Deno.cwd()}/Builds/Source`;

export const ADDONS_COLLECTION_PATH = `${Deno.cwd()}/Builds`;

export const CONFIG_FILE_PATH = `file://${Deno.cwd()}/lost.config.ts`;

export const PLUGIN_PROPERTIES_FILE_PATH = `file://${Deno.cwd()}/Addon/PluginProperties.ts`;

export const ADDON_SCRIPTS_FOLDER_PATH = `${Deno.cwd()}/Addon/Scripts`;

export const ADDON_FILES_FOLDER_PATH = `${Deno.cwd()}/Addon/Files`;

export const ADDON_CATEGORIES_FOLDER_PATH = `${Deno.cwd()}/Addon/Categories`;

export const ADDON_ICON_FOLDER_PATH = `${Deno.cwd()}/Addon`;

export const DEFAULT_ICON_PATH = path.resolve(`${__dirname}/plugin_base/ico.svg`);
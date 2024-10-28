import { Colors } from "../deps.ts";
import { LOGGER } from "./misc.ts";
import { getConfig } from "./get-config.ts";
import { getPluginProperties } from "./get-plugin-properties.ts";
import { getAddonScripts } from "./get-addon-scripts.ts";
import { getAddonFiles } from "./get-addon-files.ts";
import { getCategories } from "./get-categories.ts";
import { createAddonStructure } from "./create-addon-structure.ts";
import { getAddonIcon } from "./get-addon-icon.ts";
import { createAddonJSON } from "./create-addon-json.ts";
import { createAcesJSON } from "./create-aces-json.ts";
import { createLanguageJSON } from "./create-language-json.ts";
import { zipAddon } from "./zip-addon.ts";
import { serveAddon } from "./serve-addon.ts";

interface BuildOptions {
    serve: boolean;
    localBase: boolean;
}

export async function buildAddon(options: BuildOptions) {
    const startTime = performance.now();
    const { serve } = options;

    LOGGER.Clear();
    LOGGER.Process('Fetching addon files');

    const CONFIG = await getConfig();
    LOGGER.LogBetweenLines('📛', Colors.bold(Colors.yellow('Id:')), Colors.bold(CONFIG.AddonId), '👽', Colors.bold(Colors.green('Name:')), Colors.bold(CONFIG.AddonName));
    const PLUGIN_PROPERTIES = await getPluginProperties();
    LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)))
    const SCRIPTS = await getAddonScripts(CONFIG);
    const FILES = await getAddonFiles(CONFIG);
    const ICON = await getAddonIcon();
    const CATEGORIES = await getCategories();
    LOGGER.Line();
    LOGGER.Process('Building addon');

    await createAddonStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, CATEGORIES, ICON}, false);

    await createAddonJSON({CONFIG, ICON, SCRIPTS, FILES});

    await createAcesJSON({CATEGORIES});

    await createLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
    
    LOGGER.Success(Colors.bold(`Addon [${Colors.yellow(CONFIG.AddonId)}] has been ${Colors.green('successfully')} built`));
    if (serve) {
        await serveAddon(65432);
    } else {
        await zipAddon(CONFIG);
    }

    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    LOGGER.LogBetweenLines('⏱️', ` Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`);
}
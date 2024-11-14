import type { LostConfig } from '../lib/config/Config.ts';

/**
 * Common Addon Functions
 */
import { Colors } from "../deps.ts";
import { LOGGER } from "./misc.ts";
import { getConfig } from "./get-config.ts";
import { getAddonScripts } from "./get-addon-scripts.ts";
import { getAddonFiles } from "./get-addon-files.ts";
import { getAddonModules } from './get-addon-modules.ts';
import { getCategories } from "./get-categories.ts";
import { getPluginProperties } from "./get-plugin-properties.ts";
import { getAddonIcon } from "./get-addon-icon.ts";
import { createAcesJSON } from "./create-aces-json.ts";
import { zipAddon } from "./zip-addon.ts";

/**
 * Plugin Addon Functions
 */
import { createAddonPluginStructure } from "./plugin/create-addon-plugin-structure.ts";
import { createAddonPluginJSON } from "./plugin/create-addon-plugin-json.ts";
import { createAddonPluginLanguageJSON } from "./plugin/create-addon-plugin-language-json.ts";

/**
 * Behavior Addon Functions
 */
import { createAddonBehaviorStructure } from './behavior/create-addon-behavior-structure.ts';
import { createAddonBehaviorLanguageJSON } from "./behavior/create-addon-behavior-language-json.ts";

/**
 * Theme Addon Functions
 */
import { getAddonThemeStyleFiles } from './theme/get-addon-theme-style-files.ts';
import { createAddonThemeStructure } from './theme/create-addon-theme-structure.ts';
import { createAddonThemeLanguageJSON } from './theme/create-addon-theme-language-json.ts';
import { createAddonThemeJSON } from './theme/create-addon-theme-json.ts';

/**
 * Effect Addon Functions
 */
import { getAddonEffectFiles } from './effect/get-addon-effect-files.ts';
import { getAddonThemeEffectParameters } from './effect/get-addon-effect-parameters.ts';
import { createAddonEffectStructure } from './effect/create-addon-effect-structure.ts';
import { createAddonEffectJSON } from './effect/create-addon-effect-json.ts';
import { createAddonEffectLanguageJSON } from './effect/create-addon-effect-language-json.ts';

/**
 * Drawing Plugin Addon Functions
 */
import { createAddonDrawingPluginStructure } from './drawing-plugin/create-addon-drawing-plugin-structure.ts';

export async function build() {
    const startTime = performance.now();

    LOGGER.Clear();
    LOGGER.Process('Fetching addon files');

    const CONFIG = await getConfig();
    LOGGER.LogBetweenLines('📛', Colors.bold(Colors.yellow('Id:')), Colors.bold(CONFIG.AddonId), '👽', Colors.bold(Colors.green('Name:')), Colors.bold(CONFIG.AddonName));

    switch (CONFIG.Type) {
        case 'plugin':
            await buildPlugin(CONFIG);
            break;
        case 'drawing-plugin':
            await buildDrawingPlugin(CONFIG);
            break;
        case 'theme':
            await buildTheme(CONFIG);
            break;
        case 'effect':
            await buildEffect(CONFIG);
            break;
        case 'behavior':
            await buildBehavior(CONFIG);
            break;
    }

    LOGGER.Process('Creating .c3addon file');
    await zipAddon(CONFIG);
    LOGGER.Success(Colors.bold(`Addon [${Colors.yellow(CONFIG.AddonId)}] has been ${Colors.green('successfully')} built`));

    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    LOGGER.LogBetweenLines('⏱️', ` Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`);
}

async function buildPlugin(CONFIG: LostConfig<'plugin'>) {
    const PLUGIN_PROPERTIES = await getPluginProperties();
    LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)));
    const SCRIPTS = await getAddonScripts(CONFIG);
    const FILES = await getAddonFiles(CONFIG);
    const MODULES = await getAddonModules();
    const ICON = await getAddonIcon();
    const CATEGORIES = await getCategories();
    LOGGER.Line();
    LOGGER.Process('Building addon');

    await createAddonPluginStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, CATEGORIES, ICON});

    await createAddonPluginJSON({CONFIG, ICON, SCRIPTS, FILES, MODULES});

    await createAcesJSON({CATEGORIES});

    await createAddonPluginLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
}

async function buildDrawingPlugin(CONFIG: LostConfig<'drawing-plugin'>) {
    const PLUGIN_PROPERTIES = await getPluginProperties();
    LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)));
    const SCRIPTS = await getAddonScripts(CONFIG);
    const FILES = await getAddonFiles(CONFIG);
    const MODULES = await getAddonModules();
    const ICON = await getAddonIcon();
    const CATEGORIES = await getCategories();
    LOGGER.Line();
    LOGGER.Process('Building addon');

    await createAddonDrawingPluginStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, CATEGORIES, ICON});

    await createAddonPluginJSON({CONFIG, ICON, SCRIPTS, FILES, MODULES});

    await createAcesJSON({CATEGORIES});

    await createAddonPluginLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
}

async function buildBehavior(CONFIG: LostConfig<'behavior'>) {
    const PLUGIN_PROPERTIES = await getPluginProperties();
    LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)));
    const SCRIPTS = await getAddonScripts(CONFIG);
    const FILES = await getAddonFiles(CONFIG);
    const MODULES = await getAddonModules();
    const ICON = await getAddonIcon();
    const CATEGORIES = await getCategories();
    LOGGER.Line();
    LOGGER.Process('Building addon');

    await createAddonBehaviorStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, CATEGORIES, ICON});

    await createAddonPluginJSON({CONFIG, ICON, SCRIPTS, FILES, MODULES});

    await createAcesJSON({CATEGORIES});

    await createAddonBehaviorLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
}

async function buildTheme(CONFIG: LostConfig<'theme'>) {
    const STYLE_FILES = await getAddonThemeStyleFiles();
    const ICON = await getAddonIcon();

    await createAddonThemeStructure({STYLE_FILES, ICON});

    await createAddonThemeJSON({CONFIG, STYLE_FILES, ICON});

    await createAddonThemeLanguageJSON({CONFIG});
}

async function buildEffect(CONFIG: LostConfig<'effect'>) {
    const EFFECT_FILES = await getAddonEffectFiles();
    const PARAMETERS = await getAddonThemeEffectParameters();
    LOGGER.LogBetweenLines('📃', Colors.bold('Effect parameters count:'), Colors.bold(Colors.yellow(`${PARAMETERS.length}`)));

    await createAddonEffectStructure({EFFECT_FILES});

    await createAddonEffectJSON({CONFIG, EFFECT_FILES, PARAMETERS});

    await createAddonEffectLanguageJSON({CONFIG, PARAMETERS});
}
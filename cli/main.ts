import { Colors, join, Logger } from "../deps.ts";
import Zip from "./zip-addon.ts";


import { Paths } from "../shared/paths.ts";
import type { Addon } from "../lib/addon.ts";
import type { Plugin } from "../lib/plugin.ts";
import createAddonStructure from "./create-addon.structure.ts";
import createC3RuntimeFiles from "./create-c3runtime-files.ts";
import createAddonJsonFiles from "./create-addon-json-files.ts";

const addonModulePath = `file://${join(Paths.Main, 'addon.ts')}`;

let isBuilding = false;

export default async function build(watch?: true) {
    if (!isBuilding) {
        isBuilding = true;
        const startTime = performance.now();

        Logger.Clear();
        Logger.Line();
        Logger.Log('🚀 Starting build process...');
        Logger.Line();

        const addon = (await import(`${addonModulePath}`)).default as Addon;

        switch (addon._type) {
            case 'plugin':
                const plugin = addon as Plugin;

                await createAddonStructure(plugin as Plugin);

                await createC3RuntimeFiles(plugin);

                //

                await createAddonJsonFiles(plugin);

                break;
            default:
                break;
        }

        if (!watch) {
            Logger.Process('Creating .c3addon file');
            await Zip(addon._config);
        }

        const elapsedTime = (performance.now()) - startTime;
        Logger.LogBetweenLines(
            '✅', `Addon [${Colors.yellow(addon._config.addonId)}] has been ${Colors.green('successfully')} built`,
            '\n⏱️ ', `Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`
        );

        if (watch) {
            Logger.Log(
                '\n👀', Colors.blue('Watching for file changes...\n')
            );
        } else {
            Deno.exit(1);
        }
        isBuilding = false;

    }
    // const startTime = performance.now();

    // LOGGER.Clear();
    // LOGGER.Process('Fetching addon files');

    // const CONFIG = await getConfig();
    // LOGGER.LogBetweenLines('📛', Colors.bold(Colors.yellow('Id:')), Colors.bold(CONFIG.AddonId), '👽', Colors.bold(Colors.green('Name:')), Colors.bold(CONFIG.AddonName));

    // switch (CONFIG.Type) {
    //     case 'plugin':
    //         await buildPlugin(CONFIG);
    //         break;
    //     case 'drawing-plugin':
    //         await buildDrawingPlugin(CONFIG);
    //         break;
    //     case 'theme':
    //         await buildTheme(CONFIG);
    //         break;
    //     case 'effect':
    //         await buildEffect(CONFIG);
    //         break;
    //     case 'behavior':
    //         await buildBehavior(CONFIG);
    //         break;
    // }

    // LOGGER.Process('Creating .c3addon file');
    // await zipAddon(CONFIG);
    // LOGGER.Success(Colors.bold(`Addon [${Colors.yellow(CONFIG.AddonId)}] has been ${Colors.green('successfully')} built`));

    // const endTime = performance.now();
    // const elapsedTime = endTime - startTime;
    // LOGGER.LogBetweenLines('⏱️', ` Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`);
}

// async function buildPlugin(CONFIG: LostConfig<'plugin'>) {
//     const PLUGIN_PROPERTIES = await getPluginProperties();
//     LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)));
//     const SCRIPTS = await getAddonScripts(CONFIG);
//     const FILES = await getAddonFiles(CONFIG);
//     const MODULES = await getAddonModules();
//     const ICON = await getAddonIcon();
//     const CATEGORIES = await getCategories();
//     LOGGER.Line();
//     LOGGER.Process('Building addon');

//     await createAddonPluginStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, CATEGORIES, ICON});

//     await createAddonPluginJSON({CONFIG, ICON, SCRIPTS, FILES, MODULES});

//     await createAcesJSON({CATEGORIES});

//     await createAddonPluginLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
// }

// async function buildDrawingPlugin(CONFIG: LostConfig<'drawing-plugin'>) {
//     const PLUGIN_PROPERTIES = await getPluginProperties();
//     LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)));
//     const SCRIPTS = await getAddonScripts(CONFIG);
//     const FILES = await getAddonFiles(CONFIG);
//     const MODULES = await getAddonModules();
//     const ICON = await getAddonIcon();
//     const CATEGORIES = await getCategories();
//     LOGGER.Line();
//     LOGGER.Process('Building addon');

//     await createAddonDrawingPluginStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, CATEGORIES, ICON});

//     await createAddonPluginJSON({CONFIG, ICON, SCRIPTS, FILES, MODULES});

//     await createAcesJSON({CATEGORIES});

//     await createAddonPluginLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
// }

// async function buildBehavior(CONFIG: LostConfig<'behavior'>) {
//     const PLUGIN_PROPERTIES = await getPluginProperties();
//     LOGGER.LogBetweenLines('📃', Colors.bold('Plugin properties count:'), Colors.bold(Colors.yellow(`${PLUGIN_PROPERTIES.length}`)));
//     const SCRIPTS = await getAddonScripts(CONFIG);
//     const FILES = await getAddonFiles(CONFIG);
//     const MODULES = await getAddonModules();
//     const ICON = await getAddonIcon();
//     const CATEGORIES = await getCategories();
//     LOGGER.Line();
//     LOGGER.Process('Building addon');

//     await createAddonBehaviorStructure({CONFIG, PLUGIN_PROPERTIES, SCRIPTS, FILES, MODULES, CATEGORIES, ICON});

//     await createAddonPluginJSON({CONFIG, ICON, SCRIPTS, FILES, MODULES});

//     await createAcesJSON({CATEGORIES});

//     await createAddonBehaviorLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES});
// }

// async function buildTheme(CONFIG: LostConfig<'theme'>) {
//     const STYLE_FILES = await getAddonThemeStyleFiles();
//     const ICON = await getAddonIcon();

//     await createAddonThemeStructure({STYLE_FILES, ICON});

//     await createAddonThemeJSON({CONFIG, STYLE_FILES, ICON});

//     await createAddonThemeLanguageJSON({CONFIG});
// }

// async function buildEffect(CONFIG: LostConfig<'effect'>) {
//     const EFFECT_FILES = await getAddonEffectFiles();
//     const PARAMETERS = await getAddonThemeEffectParameters();
//     LOGGER.LogBetweenLines('📃', Colors.bold('Effect parameters count:'), Colors.bold(Colors.yellow(`${PARAMETERS.length}`)));

//     await createAddonEffectStructure({EFFECT_FILES});

//     await createAddonEffectJSON({CONFIG, EFFECT_FILES, PARAMETERS});

//     await createAddonEffectLanguageJSON({CONFIG, PARAMETERS});
// }
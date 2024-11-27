import './global.ts';
import { Colors, join, Logger } from "../deps.ts";
import Zip from "./zip-addon.ts";


import { Paths } from "../shared/paths.ts";
import type { Addon } from "../lib/addon.ts";
import type { Plugin } from "../lib/plugin.ts";
import createAddonStructure from "./create-addon-structure.ts";
import createC3RuntimeFiles from "./create-c3runtime-files.ts";
import createAddonJsonFiles from "./create-addon-json-files.ts";
import createMainAddonFiles from "./create-main-addon-files.ts";

const addonModulePath = import.meta.resolve(`file://${join(Paths.Main, 'addon.ts')}`);

export default async function build(watch?: true) {

    if (!isBuilding) {
        isBuildError = false;
        isBuilding = true;
        const startTime = performance.now();
        Logger.Clear();
        Logger.LogBetweenLines('🚀 Starting build process...');
        const addon = (await import(`${addonModulePath}?t=${Date.now()}`)).default as Addon;
        switch (addon._type) {
            // deno-lint-ignore no-case-declarations
            case 'plugin':
                const plugin = addon as Plugin;

                if (!isBuildError) await createAddonStructure(plugin);

                if (!isBuildError) await createC3RuntimeFiles(plugin, watch);

                if (!isBuildError) await createMainAddonFiles(plugin);

                if (!isBuildError) await createAddonJsonFiles(plugin);

                break;
            default:
                break;
        }

        if (!isBuildError) {
            if (!watch) {
                Logger.Process('Creating .c3addon file');
                await Zip(addon._config);
            }
    
            const elapsedTime = (performance.now()) - startTime;
            Logger.LogBetweenLines(
                '✅', `Addon [${Colors.yellow(addon._config.addonId)}] has been ${Colors.green('successfully')} built`,
                '\n⏱️ ', `Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`
            );
        }

        if (watch) {
            Logger.Log(
                '\n👀', Colors.blue('Watching for file changes...\n')
            );
        } else {
            Deno.exit(1);
        }
        
        isBuilding = false;
    }
}
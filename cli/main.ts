import './global.ts';
import type { Addon } from "../lib/addon.ts";

import { Colors, join, Logger } from "../deps.ts";

import { Paths } from "../shared/paths.ts";
import checkAddonBaseExists from "./check-addon-base-exists.ts";
import Zip from "./zip-addon.ts";

const addonModulePath = import.meta.resolve(`file://${join(Paths.Main, 'addon.ts')}`);

export default async function build(watch?: true) {

    if (!isBuilding) {
        isBuildError = false;
        isBuilding = true;
        const startTime = performance.now();

        Logger.Clear();
        Logger.LogBetweenLines('🚀 Starting build process...');

        const addon = (await import(`${addonModulePath}?t=${Date.now()}`)).default as Addon;

        await checkAddonBaseExists(addon._getConfig().type);
        await addon._build(watch || false);

        if (!isBuildError) {
            if (!watch) {
                Logger.Process('Creating .c3addon file');
                await Zip(addon._getConfig());
            }

            const elapsedTime = (performance.now()) - startTime;
            Logger.LogBetweenLines(
                '✅', `Addon [${Colors.yellow(addon._getConfig().addonId)}] has been ${Colors.green('successfully')} built`,
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
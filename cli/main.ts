// deno-lint-ignore-file no-case-declarations
import './global.ts';
import type { Addon } from "../lib/addon.ts";

import { Colors, Logger } from "../deps.ts";

import { Paths } from "../shared/paths.ts";
import checkAddonBaseExists from "./check-addon-base-exists.ts";
import Zip from "./zip-addon.ts";
import { Parameter } from "../lib/entities/parameter.ts";

export default async function build(watch?: true) {

    if (!isBuilding) {
        isBuildError = false;
        isBuilding = true;
        const startTime = performance.now();

        Logger.Clear();
        Logger.LogBetweenLines('🚀 Starting build process...');

        const addon = (await import(`${Paths.AddonModulePath}?t=${Date.now()}`)).default as Addon<any, any, any>;

        Parameter.addonId = addon._getConfig().addonId;
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
// deno-lint-ignore-file no-case-declarations
import './global.ts';
import { Colors, Logger } from "../deps.ts";
import { LostAddonProject } from "../lib/lost.ts";
import { zipAddon } from "./zip-addon.ts";

export default async function build(opts: { watch?: true }) {

    if (!isBuilding) {
        isBuildError = false;
        isBuilding = true;
        const startTime = performance.now();

        Logger.Clear();
        Logger.LogBetweenLines('🚀 Starting build process...');

        await LostAddonProject.build({
            watch: opts.watch || false,
            minify: false
        });

        if (!opts.watch) {
            Logger.LogBetweenLines(Colors.bgMagenta('Bundling addon...'));
            await zipAddon();
        }

        const elapsedTime = (performance.now()) - startTime;
        Logger.LogBetweenLines(
            '✅', `Addon [${Colors.yellow(LostAddonProject.addon._config.addonId)}] has been ${Colors.green('successfully')} built`,
            '\n⏱️ ', `Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`
        );

        if (opts.watch) {
            Logger.Log(
                '\n👀', Colors.blue('Watching for file changes...\n')
            );
        } else {
            Deno.exit(1);
        }

        isBuilding = false;
    }
}
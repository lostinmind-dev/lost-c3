// deno-lint-ignore-file no-case-declarations
import type { AddonBareBonesType } from "./lib/types/index.ts";
import { Colors, DenoJSON, parseArgs } from "./deps.ts";
import { LostBundler } from "./lib/lost-package-manager.ts";
import { LostProject } from "./lib/lost-project.ts";
import { Links } from "./shared/links.ts";
import { Logger } from "./shared/logger.ts";
import { dedent } from "./shared/misc.ts";

abstract class LostHelper {

    static printHelp() {
        Logger.Info(Colors.bold('Usage: lost <command> [options]'));

        Logger.Log('✅', Colors.bold("Valid commands:"));
        Logger.Log(`  ${Colors.yellow('version')}`);

        Logger.Log(`  ${Colors.yellow('create')}`);
        this.printCreate();

        Logger.Log(`  ${Colors.yellow('bundle')}`, Colors.italic('   Runs creating bundle for NPM package.'));
        this.printBundle();

        Logger.Log(`  ${Colors.yellow('build')}`);
        this.printBuild();
        Logger.Log(`  ${Colors.yellow('serve')}`);
        this.printServe();

        Logger.Log(`  ${Colors.yellow('update')}`, Colors.italic('   Updates Lost files.'));
        this.printUpdate();
    }

    static printVersion() {
        Logger.LogBetweenLines(dedent`
        👾 ${Colors.bold(`Lost ➜  ${Colors.yellow(DenoJSON.version)} by ${Colors.italic(Colors.magenta('lostinmind.'))}`)}
        ${Logger.GetLineString()}
        🌐 ${Colors.bold(`[GitHub] ${Links.GitHub}`)}
        🌐 ${Colors.bold(`[JSR] ${Links.JSR}`)}
        💵 ${Colors.bold(`[Support project] ${Links.PayPal}`)}
    `)
    }

    static printBundle() {
        Logger.Log('   ⚙️', Colors.gray('  --package "{package_name}"'));
        Logger.Log('   ⚙️', Colors.gray('  --format "{esm | cjs | iife}"'));
        Logger.Log('   ⚙️', Colors.gray('  --minify, -m'), Colors.italic('  ESBuild minification.'));
    }

    static printServe() {
        Logger.Log('   ⚙️', Colors.gray('  --port "{port}"'));
    }

    static printBuild() {
        Logger.Log('   ⚙️', Colors.gray('  --watch, -w'), Colors.italic('   Runs build command with auto-reload.'));
        Logger.Log('   ⚙️', Colors.gray('  --minify, -m'), Colors.italic('  Runs build command with script minification.'));
    }

    static printUpdate() {
        Logger.Log('   ⚙️', Colors.gray('  --construct-types'), Colors.italic('   Updates "construct.d.ts" declaration file.'));
        Logger.Log('   ⚙️', Colors.gray('  --addon-base'), Colors.italic('   Updates addon base.'));
    }

    static printCreate() {
        Logger.Log('   ⚙️', Colors.gray('  --type "plugin"'), Colors.italic('   Creates a bare-bones for "Plugin" addon type.'));
        Logger.Log('   ⚙️', Colors.gray('  --type "drawing-plugin"'), Colors.italic('   Creates a bare-bones for "Drawing Plugin" addon type.'));
        Logger.Log('   ⚙️', Colors.gray('  --type "behavior"'), Colors.italic('   Creates a bare-bones for "Behavior" addon type.'));
    }

}

async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        string: [
            /** Create flags */
            'type', 'path',
            /** Serve flags */
            'port',
            /** Bundle flags */
            'package', 'format'
        ],
        boolean: [
            /** Build flags */
            'watch', 'minify',
            /** Update flags */
            'construct-types', 'addon-base'
        ],
        alias: { w: 'watch', m: 'minify' },
        "--": true,
    });

    const command = String(_[0]) as LostCLICommand;

    switch (command) {
        case "version":
            LostHelper.printVersion();
            break;
        case "create":
            if (
                flags['type'] &&
                flags['type'] === 'plugin' ||
                flags['type'] === 'drawing-plugin' ||
                flags['type'] === 'behavior'
            ) {
                await LostProject.create({
                    bareBonesType: flags['type'] as AddonBareBonesType,
                    path: flags['path'] || './'
                })
            } else {
                Logger.Log(
                    '🎓', Colors.blue(Colors.italic('Specify one of the available types of addon:'))
                );
                LostHelper.printCreate();
            }
            break;
        case "build":
            await LostProject.init({
                watch: flags['watch'],
                minify: flags['minify']
            });
            await LostProject.build();
            break;
        case "serve":
            LostProject.serve({
                port: (flags['port']) ? Number(flags['port']) : 65432
            })
            break;
        case "update":
            if (
                flags['construct-types'] ||
                flags['addon-base']
            ) {
                await LostProject.update({
                    constructTypes: flags['construct-types'],
                    addonBase: flags['addon-base']
                })
            } else {
                await LostProject.update({
                    constructTypes: true,
                    addonBase: true
                })
            }
            break;
        case "bundle":
            if (flags['package']) {
                if (
                    flags['format'] &&
                    flags['format'] === 'esm' ||
                    flags['format'] === 'iife' ||
                    flags['format'] === 'cjs'
                ) {
                    LostBundler.bundle({
                        name: flags['package'],
                        minify: flags['minify'],
                        format: flags['format']
                    })
                } else {
                    LostBundler.bundle({
                        name: flags['package'],
                        minify: flags['minify']
                    })    
                }
            } else {
                Logger.Log(
                    '🎓', Colors.blue(Colors.italic('Specify package name:'))
                );
                LostHelper.printBundle();
            }
            break;
        default:
            LostHelper.printHelp();
            break;
    }
}

if (import.meta.main) {
    await main();
}
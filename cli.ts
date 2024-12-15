import DenoJson from './deno.json' with { type: "json" };
import { Colors, join, Logger, parseArgs } from './deps.ts';
import { Paths } from './shared/paths.ts';
import { dedent } from "./shared/misc.ts";
import { downloadAddonBase } from "./cli/check-addon-base-exists.ts";
import { AddonFileManager } from "./lib/managers/addon-file-manager.ts";

import Build from './cli/main.ts';
import Serve from './cli/serve-addon.ts';
import { PackageBundler } from "./bundler/package-manager.ts";


let rebuildTimeout: number | undefined;

async function BuildAndWatch() {
    const watcher = Deno.watchFs([
        Paths.ProjectFolders.Addon,
        Paths.ProjectFolders.Editor,
        'addon.ts',
        'lost.config.ts'
    ]);
    Logger.Clear();
    Logger.Log(
        '\n👀', Colors.blue('Watching for file changes...\n')
    );

    await Build({ watch: true });

    for await (const event of watcher) {
        if (event.kind === 'modify') {
            for (const path of event.paths) {
                if (
                    path.endsWith('.ts') ||
                    path.endsWith('.js') ||
                    path.endsWith('.css')
                ) {

                    if (!rebuildTimeout) {
                        clearTimeout(rebuildTimeout);
                    }

                    rebuildTimeout = setTimeout(async () => {
                        await Build({ watch: true });
                    }, 500);
                }
            }
        }
    }
}

async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        string: [
            'type', 'port',
            'package', 'format'
        ],
        boolean: ['watch', 'minify'],
        alias: { w: 'watch', m: 'minify' },
        "--": true,
    });

    const command = _[0];

    switch (command) {
        case 'bundle':
            if (flags.package) {
                if (
                    flags['format'] &&
                    (flags['format'] === 'esm' || flags['format'] === 'cjs' || flags['format'] === 'iife')
                ) {
                        await PackageBundler.bundle(
                            flags.package,
                            flags['minify'] || false,
                            flags['format'] || 'esm'
                        );
                } else {
                    await PackageBundler.bundle(
                        flags.package,
                        flags['minify'] || false,
                        'esm'
                    );
                }
            } else {
                Logger.Log('🎓', Colors.blue(Colors.italic('Enter package name ')))
            }
            break;
        case 'version':
            Logger.LogBetweenLines(dedent`
                👾 ${Colors.bold(`Lost ➜  ${Colors.yellow(DenoJson.version)} by ${Colors.italic(Colors.magenta('lostinmind.'))}`)}
                🌐 ${Colors.bold(`[GitHub] ${Paths.Links.GitHub}`)}
                🌐 ${Colors.bold(`[JSR] ${Paths.Links.JSR}`)}
            `)
            break;
        case 'create':
            if (flags.type) {
                const type = flags.type as AddonBareBonesType;

                if (
                    type === 'plugin' ||
                    type === 'drawing-plugin' ||
                    type === 'behavior'
                ) {
                    await createBareBones(type);
                } else {
                    Logger.Log('🎓', Colors.blue(Colors.italic('Specify one of the available types of addon:')))
                    printCreate();
                }
            } else {
                Logger.Log('🎓', Colors.blue(Colors.italic('Specify one of the available types of addon:')))
                printCreate();
            }
            break;
        case 'build':
            if (flags.watch) {
                await BuildAndWatch();
            } else {
                if (flags.minify) {
                    AddonFileManager.minify = true;
                } else {
                    AddonFileManager.minify = false;
                }
                await Build({});
            }
            break;
        case 'serve':
            if (flags.port) {
                const port = Number(flags['port']);
                Serve(port);
            } else {
                Serve(65432);
            }
            break;
        case 'types':
            await installTypes();
            break;
        default:
            printHelp();
            break;
    }

}

if (import.meta.main) {
    await main();
}

async function installTypes() {
    try {
        const response = await fetch(Paths.Links.ConstructTypes)

        if (!response.ok) {
            Logger.Error('cli', 'Error while installing "construct.d.ts" file', `Status: ${response.statusText}`);
            Deno.exit(1);
        }

        const fileContent = await response.text();
        await Deno.writeTextFile(join(Paths.ProjectFolders.Types, 'construct.d.ts'), fileContent);
        Logger.Success(Colors.bold(`${Colors.green('Successfully')} installed construct types!`));
    } catch (e) {
        Logger.Error('cli', 'Error while installing construct types file', `Error: ${e}`);
        Deno.exit(1);
    }
}

async function createBareBones(type: AddonBareBonesType) {
    Logger.Process(`Creating bare-bones for ${Colors.magenta(`"${type}"`)} addon type`);
    await cloneRepo(Paths.Links.BareBones[type]);

    if (
        type === 'plugin' ||
        type === 'drawing-plugin'
    ) {
        await downloadAddonBase('plugin');
    }

    if (type === 'behavior') {
        await downloadAddonBase('behavior');
    }
}

async function cloneRepo(url: string) {
    const command = new Deno.Command('git', {
        args: ['clone', url, './'],
        stdout: "piped",
        stderr: "piped"
    })

    const { code } = await command.output();

    if (code === 0) {
        Logger.Success(Colors.bold(`${Colors.green('Successfully')} created bare-bones!`));
        await installTypes();
    } else {
        Logger.Error('cli', 'Error occured while creating bare-bones.', `Error code: ${code}`);
        Deno.exit(1);
    }
}

function printHelp() {
    Logger.Info(Colors.bold('Usage: lost <command> [options]'));

    Logger.Log('✅', Colors.bold("Valid commands:"));
    Logger.Log(`  ${Colors.yellow('version')}`);

    Logger.Log(`  ${Colors.yellow('create')}`);
    printCreate();

    Logger.Log(`  ${Colors.yellow('bundle')}`, Colors.italic('   Runs creating bundle for NPM package.'));
    Logger.Log('   ⚙️', Colors.gray('  --package "{package_name}"'));
    Logger.Log('   ⚙️', Colors.gray('  --format "{esm | cjs | iife}"'));
    Logger.Log('   ⚙️', Colors.gray('  --minify, -m'), Colors.italic('   ESBuild minification.'));

    Logger.Log(`  ${Colors.yellow('build')}`);
    Logger.Log('   ⚙️', Colors.gray('  --watch, -w'), Colors.italic('   Runs build command with auto-reload.'));
    Logger.Log('   ⚙️', Colors.gray('  --minify, -m'), Colors.italic('   Runs build command with script minification.'));
    Logger.Log(`  ${Colors.yellow('serve')}`);
    Logger.Log('   ⚙️', Colors.gray('  --port "{port}"'));
    Logger.Log(`  ${Colors.yellow('types')}`, Colors.italic('   Creates "construct.d.ts" for all Construct 3 declarations.'));
}

function printCreate() {
    Logger.Log('   ⚙️', Colors.gray('  --type "plugin"'), Colors.italic('   Creates a bare-bones for "Plugin" addon type.'));
    Logger.Log('   ⚙️', Colors.gray('  --type "drawing-plugin"'), Colors.italic('   Creates a bare-bones for "Drawing Plugin" addon type.'));
    Logger.Log('   ⚙️', Colors.gray('  --type "behavior"'), Colors.italic('   Creates a bare-bones for "Behavior" addon type.'));
}
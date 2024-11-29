import DenoJson from './deno.json' with { type: "json" };
import { parseArgs } from "jsr:@std/cli@1.0.6";
import { Colors, join, Logger } from './deps.ts';
import Build from './cli/main.ts';
import Serve from './cli/serve-addon.ts';
import { Paths } from './shared/paths.ts';
import type { AddonType } from "./lib/config.ts";

let rebuildTimeout: number | undefined;

async function BuildAndWatch() {
    const watcher = Deno.watchFs([
        join(Paths.Main, 'Addon'),
        join(Paths.Main, 'addon.ts'),
        join(Paths.Main, 'lost.config.ts')
    ]);
    Logger.Clear();
    Logger.Log(
        '\n👀', Colors.blue('Watching for file changes...\n')
    );

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
                        await Build(true);
                    }, 500);
                }
            }
        }
    }
}

async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        boolean: ['plugin', 'watch'],
        alias: { p: 'plugin', w: 'watch' },
        "--": true,
    });

    const command = _[0]

    switch (command) {
        case 'help':
            printHelp();
            break;
        case 'version':
            Logger.LogBetweenLines(Colors.bold(`Lost ➜  ${Colors.yellow(DenoJson.version)} by ${Colors.italic(Colors.magenta('lostinmind.'))}`))
            break;
        case 'create':
            if (!flags.plugin) {
                Logger.Log('🎓', Colors.blue(Colors.italic('Specify one of the available types of addon:')))
                printCreate();
                break;
            } else {
                await createBareBones('plugin');
            }
            break;
        case 'build':
            if (flags.watch) {
                await BuildAndWatch();
            } else {
                await Build();
            }
            break;
        case 'serve':
            await Serve(65432);
            break;
        case 'types':
            await installTypes();
            break;
        default:
            Logger.Log(`❌ ${Colors.red(Colors.bold(`Unknown command:`)), Colors.italic(String(command))}`);
            Logger.Log(Colors.blue(Colors.italic('Enter')), Colors.italic(Colors.bold(`${Colors.yellow('lost')} help`)), Colors.italic(Colors.blue('to get of available commands.')))
            Deno.exit(1);
    }

}

if (import.meta.main) {
    await main();
}

async function installTypes() {
    try {
        const response = await fetch(Paths.ConstructTypes)

        if (!response.ok) {
            Logger.Error('cli', 'Error while installing "construct.d.ts" file', `Status: ${response.statusText}`);
            Deno.exit(1);
        }

        const fileContent = await response.text();
        await Deno.writeTextFile(join(Paths.Main, 'Addon', 'Types', 'construct.d.ts'), fileContent);
    } catch (e) {
        Logger.Error('cli', 'Error while installing construct types file', `Error: ${e}`);
        Deno.exit(1);
    }
}

async function createBareBones(addonType: AddonType) {
    Logger.Process(`Creating bare-bones for ${Colors.magenta(`"${addonType}"`)} addon type`);
    await cloneRepo(Paths.BareBones[addonType]);
}

async function cloneRepo(url: string) {
    const command = new Deno.Command('git', {
        args: ['clone', url, './'],
        stdout: "piped",
        stderr: "piped"
    })

    const { code, stdout, stderr } = await command.output();

    if (code === 0) {
        Logger.Success(Colors.bold(`${Colors.green('Successfully')} created bare-bones for ${Colors.magenta(`"${''}"`)} addon type!`));
    } else {
        Logger.Error('cli', 'Error occured while creating bare-bones.', `Error code: ${code}`);
    }
}

function printHelp() {
    Logger.Info(Colors.bold('Usage: lost <command> [options]'));

    Logger.Log('✅', Colors.bold("Valid commands:"));
    Logger.Log(`  ${Colors.yellow('help')}`);
    Logger.Log(`  ${Colors.yellow('version')}`);

    Logger.Log(`  ${Colors.yellow('create')}`);
    printCreate();

    Logger.Log(`  ${Colors.yellow('build')}`);
    Logger.Log('   ⚙️', Colors.gray('  --watch, -w'), Colors.italic('   Runs build command with auto-reload.'));
    Logger.Log(`  ${Colors.yellow('serve')}`);
    Logger.Log(`  ${Colors.yellow('types')}`);
}

function printCreate() {
    Logger.Log('   ⚙️', Colors.gray('  --plugin, -p'), Colors.italic('   Creates a bare-bones for "plugin" addon type.'));
    // Logger.Log('   ⚙️', Colors.gray('  --behavior, -b'), Colors.italic('   Creates a bare-bones for "behavior" addon type.'));
    // Logger.Log('   ⚙️', Colors.gray('  --theme, -t'), Colors.italic('   Creates a bare-bones for "theme" addon type.'));
    // Logger.Log('   ⚙️', Colors.gray('  --effect, -e'), Colors.italic('   Creates a bare-bones for "effect" addon type.'));
}
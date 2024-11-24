import DenoJson from './deno.json' with { type: "json" };
import { parseArgs } from "jsr:@std/cli@1.0.6";
import { Colors, Logger } from './deps.ts';
import Build from './cli/main.ts';
import Serve from './cli/serve-addon.ts';


async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        boolean: ["plugin", "behavior", "theme", "effect"],
        alias: {p: "plugin", b: "behavior", t: "theme", e: "effect"},
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
            }
            if (flags.plugin) {
                // await createBareBones('plugin');
                break;
            }
            if (flags.behavior) {
                // await createBareBones('behavior');
                break;
            }
            if (flags.effect) {
                // await createBareBones('effect');
                break;
            }
            if (flags.theme) {
                // await createBareBones('theme');
                break;
            }
            break;
        case 'build':
            await Build();
            break;
        case 'serve':
            await Serve(65432);
            break;
        case 'none':
            Logger.Log(`❌ ${Colors.red(Colors.bold(`Unknown command:`)), Colors.italic(command)}`);
            Logger.Log(Colors.blue(Colors.italic('Enter')), Colors.italic(Colors.bold(`${Colors.yellow('lost')} help`)), Colors.italic(Colors.blue('to get of available commands.')))
            Deno.exit(1);
    }

}

if (import.meta.main) {
    await main();
}

// async function createBareBones(addonType: AddonType) {
//     console.log('⏳', Colors.bold(Colors.yellow((Colors.italic(`Creating bare-bones for ${Colors.magenta(`"${addonType}"`)} addon type`)))), '...');
//     await cloneRepo(`https://github.com/lostinmind-dev/lostc3-${addonType}-bare-bones.git`, addonType);
// }

async function cloneRepo(url: string) {
    const command = new Deno.Command('git', {
        args: ['clone', url, './'],
        stdout: "piped",
        stderr: "piped"
    })

    const { code, stdout, stderr } = await command.output();

    if (code === 0) {
        console.log('✅', Colors.bold(`${Colors.green('Successfully')} created bare-bones for ${Colors.magenta(`"${addonType}"`)} addon type!`));
    } else {
        console.error('❌', Colors.red(Colors.bold(`Error occured while creating bare-bones.`)), `Error code: ${code}`);
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
    Logger.Log(`  ${Colors.yellow('serve')}`);
}

function printCreate() {
    Logger.Log('   ⚙️', Colors.gray('  --plugin, -p'), Colors.italic('   Creates a bare-bones for "plugin" addon type.'));
    Logger.Log('   ⚙️', Colors.gray('  --behavior, -b'), Colors.italic('   Creates a bare-bones for "behavior" addon type.'));
    Logger.Log('   ⚙️', Colors.gray('  --theme, -t'), Colors.italic('   Creates a bare-bones for "theme" addon type.'));
    Logger.Log('   ⚙️', Colors.gray('  --effect, -e'), Colors.italic('   Creates a bare-bones for "effect" addon type.'));
}
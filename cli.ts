#!/usr/bin/env deno run --allow-read --allow-write --unstable
import { parseArgs } from "jsr:@std/cli@1.0.6";
import { Colors } from "./deps.ts";
import { buildAddon } from "./cli/main.ts";

const LOST_VERSION = '1.0.3';

type LostCommand = 'none' | 'help' | 'version' | 'build' | 'create' | 'serve';

async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        boolean: ["plugin"],
        alias: {p: "plugin"},
        "--": true,
      });

    const command = (_[0]) ? String(_[0]) as LostCommand : 'none';

    switch (command) {
        case 'help':
            printHelp();
            break;
        case 'version':
            console.log('✅', Colors.bold(`Lost ➜  ${Colors.yellow(LOST_VERSION)} by ${Colors.italic(Colors.magenta('lostinmind.'))}`))
            break;
        case 'create':
            if (!flags.plugin) {
                console.log('🎓', Colors.blue(Colors.italic('Specify one of the available types of addon:')))
                console.log(Colors.gray('  --plugin, -p'), '   Creates a bare-bones for "plugin" addon type.');
                break;
            }
            if (flags.plugin) {
                // await createBareBones('plugin');
                break;
            }
            break;
        case 'build':
            await buildAddon({ serve: false });
            break;
        case 'serve':
            await buildAddon({ serve: true });
            break;
        case 'none':
            console.error('❌', Colors.red(Colors.bold(`Unknown command:`)), Colors.italic(command));
            console.log(Colors.blue(Colors.italic('Enter')), Colors.italic(Colors.bold(`${Colors.yellow('lost')} help`)), Colors.italic(Colors.blue('to get of available commands.')))
            Deno.exit(1);
    }

}

if (import.meta.main) {
    await main();
}

function printHelp() {
    console.log('📃', Colors.bold("Usage: lost <command> [options]"));

    console.log('✅', Colors.bold("Valid commands:"));
    console.log(`  ${Colors.yellow('help')}`);
    console.log(`  ${Colors.yellow('version')}`);
    
    console.log(`  ${Colors.yellow('create')}`);
    console.log('   ⚙️', Colors.gray('  --plugin, -p'), '   Creates a bare-bones for "plugin" addon type.');

    console.log(`  ${Colors.yellow('build')}`);
    console.log(`  ${Colors.yellow('serve')}`);
}
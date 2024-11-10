#!/usr/bin/env deno run --allow-read --allow-write --unstable
import type { AddonType } from "./lib/common.ts";

import { parseArgs } from "jsr:@std/cli@1.0.6";
import { Colors } from "./deps.ts";
import { build } from "./cli/main.ts";
import { serveAddon } from './cli/serve-addon.ts';

const VERSION = '2.0.2'

type LostCommand = 'none' | 'help' | 'version' | 'build' | 'create' | 'serve';

async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        boolean: ["plugin", "behavior", "theme", "effect"],
        alias: {p: "plugin", b: "behavior", t: "theme", e: "effect"},
        "--": true,
      });

    const command = (_[0]) ? String(_[0]) as LostCommand : 'none';

    switch (command) {
        case 'help':
            printHelp();
            break;
        case 'version':
            console.log('✅', Colors.bold(`Lost ➜  ${Colors.yellow(VERSION)} by ${Colors.italic(Colors.magenta('lostinmind.'))}`))
            break;
        case 'create':
            if (!flags.plugin) {
                console.log('🎓', Colors.blue(Colors.italic('Specify one of the available types of addon:')))
                console.log('   ⚙️', Colors.gray('  --plugin, -p'), '   Creates a bare-bones for "plugin" addon type.');
                console.log('   ⚙️', Colors.gray('  --behavior, -b'), '   Creates a bare-bones for "behavior" addon type.');
                console.log('   ⚙️', Colors.gray('  --theme, -t'), '   Creates a bare-bones for "theme" addon type.');
                console.log('   ⚙️', Colors.gray('  --effect, -e'), '   Creates a bare-bones for "effect" addon type.');
                break;
            }
            if (flags.plugin) {
                await createBareBones('plugin');
                break;
            }
            if (flags.behavior) {
                await createBareBones('behavior');
                break;
            }
            if (flags.effect) {
                await createBareBones('effect');
                break;
            }
            if (flags.theme) {
                await createBareBones('theme');
                break;
            }
            break;
        case 'build':
            await build();
            break;
        case 'serve':
            await serveAddon(65432);
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

async function createBareBones(addonType: AddonType) {
    console.log('⏳', Colors.bold(Colors.yellow((Colors.italic(`Creating bare-bones for ${Colors.magenta(`"${addonType}"`)} addon type`)))), '...');
    await cloneRepo(`https://github.com/lostinmind-dev/lostc3-${addonType}-bare-bones.git`, addonType);
}

async function cloneRepo(url: string, addonType: AddonType) {
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
    console.log('📃', Colors.bold("Usage: lost <command> [options]"));

    console.log('✅', Colors.bold("Valid commands:"));
    console.log(`  ${Colors.yellow('help')}`);
    console.log(`  ${Colors.yellow('version')}`);
    
    console.log(`  ${Colors.yellow('create')}`);
    console.log('   ⚙️', Colors.gray('  --plugin, -p'), '   Creates a bare-bones for "plugin" addon type.');
    console.log('   ⚙️', Colors.gray('  --behavior, -b'), '   Creates a bare-bones for "behavior" addon type.');
    console.log('   ⚙️', Colors.gray('  --theme, -t'), '   Creates a bare-bones for "theme" addon type.');
    console.log('   ⚙️', Colors.gray('  --effect, -e'), '   Creates a bare-bones for "effect" addon type.');

    console.log(`  ${Colors.yellow('build')}`);
    console.log(`  ${Colors.yellow('serve')}`);
}
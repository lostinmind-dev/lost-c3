#!/usr/bin/env deno run --allow-read --allow-write --unstable
import { Lost } from "./deps.ts";
import { parseArgs } from "jsr:@std/cli@1.0.6";
// import { debounce } from "jsr:@std/async";
import { build } from "./build.ts";
import { red, bold, italic, yellow, blue, gray, magenta } from "./deps.ts";
import { green } from "./deps.ts";

type LostCommand = 'none' | 'help' | 'version' | 'build' | 'create' | 'serve' | 'docs';

const COMMANDS: LostCommand[] = ["help", "version", "build", "serve", 'create'];

function printUsage() {
    console.log('📃', bold("Usage: lost <command> [options]"));
    console.log('✅', bold("Valid commands:"));
    COMMANDS.forEach(cmd => console.log(`  ${yellow(cmd)}`));
    console.log('\n⚙️', bold(" Options:"));
    //console.log(gray('  --watch, -w'), '   Watch mode');
    console.log(gray('  --plugin, -p'), '   Creates a bare-bones for "plugin" addon type.');
  }

// async function watchMode(serve: boolean) {
//     const watcher = Deno.watchFs(["./Addon", "./lost.config.ts"]);
//     const debouncedBuild = debounce(build, 100);
  
//     console.log(bold(blue("Watch mode started. Waiting for changes...")));
  
//     for await (const event of watcher) {
//         if (event.kind === "modify" ) { // || event.kind === "create"
//             await debouncedBuild({ serve });
//         }
//     }
// }

async function cloneRepo(url: string, addonType: Lost.AddonType) {
    const command = new Deno.Command('git', {
        args: ['clone', url, './'],
        stdout: "piped",
        stderr: "piped"
    })

    const { code, stdout, stderr } = await command.output();

    if (code === 0) {
        console.log('✅', bold(`${green('Successfully')} created bare-bones for ${magenta(`"${addonType}"`)} addon type!`));
    } else {
        console.error('❌', red(bold(`Error occured while creating bare-bones.`)));
    }
}

async function createBareBones(addonType: Lost.AddonType) {
    console.log('⏳', bold(yellow((italic(`Creating bare-bones for ${magenta(`"${addonType}"`)} addon type`)))), '...');
    await cloneRepo(`https://github.com/lostinmind-dev/lostc3-${addonType}-bare-bones.git`, addonType);
}


async function main() {
    const { _, ...flags } = parseArgs(Deno.args, {
        boolean: ["watch", "plugin"],
        alias: { w: "watch", p: "plugin"},
        "--": true,
      });

    const command: LostCommand = (_[0]) ? String(_[0]) as LostCommand : 'none';

    if (!COMMANDS.includes(command)) {
        console.error('❌', red(bold(`Unknown command:`)), italic(command));
        console.log(blue(italic('Enter')), italic(bold(`${yellow('lost')} help`)), italic(blue('to get of available commands.')))
        Deno.exit(1);
    }

    switch (command) {
        case 'help':
            printUsage();
            break;
        case 'version':
            console.log('✅', bold(`Lost ➜  ${yellow('2.0.0')} by ${italic(magenta('lostinmind.'))}`))
            break;
        case 'create':
            if (!flags.plugin) {
                console.log('🎓', blue(italic('Specify one of the available types of addon:')))
                console.log(gray('  --plugin, -p'), '   Creates a bare-bones for "plugin" addon type.');
                break;
                //printUsage();
            }
            if (flags.plugin) {
                await createBareBones('plugin');
                break;
            }
            break;
        case 'build':
            await build({ serve: false });
            break;
        case 'serve':
            // if (flags.watch) {
            //     // await watchMode(true);
            //     break;
            // } else {
            //     await build({ serve: true });
            // }
            await build({ serve: true });
            break;
        case 'docs':
            console.log('🔃', 'In development', '🔃')
            // build({ serve: false }).then((data) => {
            //     console.log(data);
            // })
            // generateAddonDocs();
            break;  
    }

}

if (import.meta.main) {
    main();
}

/**
 * 
 * Exports
 * 
 */
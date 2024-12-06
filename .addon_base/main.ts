import { transpileTs } from '../shared/transpile-ts.ts';
import { Logger, join } from "../deps.ts";

const folderPath = join(Deno.cwd(), '.addon_base');

async function main() {
    Logger.Process('Building');

    await buildPluginBase();
    await buildBehaviorBase();

    Logger.Success('Build finished');
}


async function buildPluginBase() {
    let fileContent = await transpileTs(join(folderPath, 'plugin', 'plugin.ts')) || '';

    fileContent = fileContent.replace('const _lostData = {};', '');

    await Deno.writeTextFile(join(folderPath, 'plugin', 'plugin.js'), fileContent)
}

async function buildBehaviorBase() {
    let fileContent = await transpileTs(join(folderPath, 'behavior', 'behavior.ts')) || '';

    fileContent = fileContent.replace('const _lostData = {};', '');

    await Deno.writeTextFile(join(folderPath, 'behavior', 'behavior.js'), fileContent)
}

await main()
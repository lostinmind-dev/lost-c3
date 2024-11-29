import { transpileTs } from '../shared/transpile-ts.ts';
import { Logger, join } from "../deps.ts";

const folderPath = join(Deno.cwd(), '.addon_base');

async function main() {
    Logger.Process('Building');

    let fileContent = await transpileTs(join(folderPath, 'plugin', 'plugin.ts')) || '';

    fileContent = fileContent.replace('const _lostData = {};', '');

    await Deno.writeTextFile(join(folderPath, 'plugin', 'plugin.js'), fileContent)
}

await main()
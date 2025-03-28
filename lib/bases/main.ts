import { compiler } from "../addon/builder.ts";
import { join } from "../deps.ts";

const path = ['lib', 'bases'];

async function main() {
    compiler.init();

    const content = compiler.compileTs(join(Deno.cwd(), ...path, './plugin.ts'));
    await Deno.writeTextFile(join(Deno.cwd(), ...path, './plugin.js'), content);
}

await main();
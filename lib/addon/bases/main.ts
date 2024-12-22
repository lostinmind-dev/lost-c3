import { LostCompiler } from "../../lost-compiler.ts";
import { Logger } from "../../../shared/logger.ts";
import { join } from "../../../deps.ts";

const AddonBasesPath = join(Deno.cwd(), 'lib/addon/bases');
const PluginBaseFilePath = join(Deno.cwd(), 'lib/addon/plugin/base.ts');
const BehaviorBaseFilePath = join(Deno.cwd(), 'lib/addon/behavior/base.ts');

async function main() {
    Logger.Process('Building');

    await buildPluginBase();
    await buildBehaviorBase();

    Logger.Success('Build finished');
}


async function buildPluginBase() {
    const content = LostCompiler.compile(PluginBaseFilePath) || '';

    await Deno.writeTextFile(join(AddonBasesPath, 'plugin.js'), content)
}

async function buildBehaviorBase() {
    const content = LostCompiler.compile(BehaviorBaseFilePath) || '';

    await Deno.writeTextFile(join(AddonBasesPath, 'behavior.js'), content)
}

await main()
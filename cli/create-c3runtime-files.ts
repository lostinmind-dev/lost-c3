import { join } from '../deps.ts';
import type { Plugin } from "../lib/plugin.ts";

import Lost from './defaults/lost.ts';
import ModuleFile from './defaults/module-file.ts';
import EntityFile from './defaults/entity-file.ts';

import { EntityType } from "../lib/entities/entity.ts";
import { addCategories } from "./add-categories.ts";
import { Paths } from "../shared/paths.ts";
import { transpileTs } from "../shared/transpile-ts.ts";

type EntityCollection = {
    [key: string]: Function;
}

export default async function createC3RuntimeFiles(plugin: Plugin) {

    await addCategories(plugin);

    await createModuleFile();
    await createInstanceFile();
    await createPluginFile();
    await createTypeFile();
    await createActionsFile();
    await createConditionsFile();
    await createExpressionsFile();

    async function createModuleFile() {
        if (plugin._userModules.length > 0) {
            await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'main.js'), ModuleFile());
        }
    }

    async function createInstanceFile() {
        const path = join(Paths.Main, 'Addon', 'Instance.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(plugin._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'instance.js'), fileContent);
    }

    async function createPluginFile() {
        const path = join(Paths.Main, 'Addon', 'Plugin.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(plugin._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'plugin.js'), fileContent);
    }

    async function createTypeFile() {
        const path = join(Paths.Main, 'Addon', 'Type.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(plugin._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'type.js'), fileContent);
    }

    async function createActionsFile() {
        const entities: EntityCollection = {};
        plugin._categories.forEach(c => c._actions.forEach(enitity => {

            entities[enitity._func.name] = enitity._func;
        }))

        const fileContent = `${EntityFile(plugin._config.addonId, EntityType.Action)} ${serializeObjectWithFunctions(entities)}`;
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'actions.js'), fileContent);
    }

    async function createConditionsFile() {
        const entities: EntityCollection = {};
        plugin._categories.forEach(c => c._conditions.forEach(entity => {

            entities[entity._func.name] = entity._func;
        }))

        const fileContent = `${EntityFile(plugin._config.addonId, EntityType.Condition)} ${serializeObjectWithFunctions(entities)}`;
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'conditions.js'), fileContent);
    }

    async function createExpressionsFile() {
        const entities: EntityCollection = {};
        plugin._categories.forEach(c => c._expressions.forEach(entity => {

            entities[entity._func.name] = entity._func;
        }))

        const fileContent = `${EntityFile(plugin._config.addonId, EntityType.Expression)} ${serializeObjectWithFunctions(entities)}`;
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'expressions.js'), fileContent);
    }

}

const serializeObjectWithFunctions = (obj: any): string => {
    let str = '{\n';
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'function') {
                // Преобразование функции в строку
                str += `  ${key}: function ${value.toString().replace(/^function\s*\w*\s*/, '')},\n`;
            } else {
                str += `  ${key}: ${JSON.stringify(value, null, 2)},\n`;
            }
        }
    }
    str = str.replace(/,\n$/, '\n'); // Удаляем последнюю запятую
    str += '}';
    return str;
}


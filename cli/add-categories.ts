import { Colors, Logger } from "../deps.ts";
import { Paths } from "../shared/paths.ts";

import type { CategoryClassType } from "../lib/entities/category.ts";
import type { Plugin } from "../lib/plugin.ts";

interface CategoryModule {
    default: new () => CategoryClassType;
}

async function getModule<T>(path: string) {
    const module = await import(path);
    return module as T;   
}

async function getCategory(path: string) {
    const module = await getModule<CategoryModule>(path);
    const _class = new module.default();
    const _prototype = _class.constructor.prototype as CategoryClassType;
    return (_prototype) ? _prototype : null;
}

export async function addCategories(plugin: Plugin) {
    async function readDir(path: string) {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await readDir(`${path}/${entry.name}`);
            }
            if (
                entry.isFile &&
                entry.name.endsWith('.ts')
            ) {
                try {
                    const category = await getCategory(`file://${path}/${entry.name}?t=${Date.now()}`);

                    if (
                        category !== null &&
                        !category._inDevelopment
                    ) {
                        plugin._categories.push(category);
                    }

                } catch (error) {
                    Logger.Error('build', `Error importing category: ${Colors.bold(Colors.magenta(entry.name))}`, error);
                    Deno.exit();
                }
            }
        }
    }

    await readDir(Paths.Categories);

    return plugin._categories.length;
}
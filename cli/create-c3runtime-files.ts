import { join, Logger } from '../deps.ts';
import type { Plugin } from "../lib/plugin.ts";
import type { Behavior } from "../lib/behavior.ts";

import Lost from './defaults/lost.ts';
import ModuleFile from './defaults/module-file.ts';
import EntityFile from './defaults/entity-file.ts';

import { EntityType } from "../lib/entities/entity.ts";
import { addCategories } from "./add-categories.ts";
import { Paths } from "../shared/paths.ts";
import { transpileTs } from "../shared/transpile-ts.ts";

type EntityCollection = {
    // deno-lint-ignore ban-types
    [key: string]: Function;
}

export default async function createC3RuntimeFiles(addon: Plugin | Behavior, watch?: true) {

    await addCategories(addon);
    checkCategories();

    await createModuleFile();
    await createInstanceFile();

    switch (addon._type) {
        case "plugin":
            await createPluginFile();
            break;
        case "behavior":
            await createBehaviorFile();
            break;
    }

    await createTypeFile();
    await createActionsFile();
    await createConditionsFile();
    await createExpressionsFile();

    function checkCategories() {
        const isCategoryAlreadyExists = (id: string) => {
            const categories = addon._categories.filter(c => c._id === id);
            if (categories.length > 1) {
                return true;
            } else {
                return false;
            }
        }

        addon._categories.forEach(category => {
            if (category._id.length > 0) {
                if (!isCategoryAlreadyExists(category._id)) {

                    category._actions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = addon._categories.map(c => c._actions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = addon._categories.map(c => c._actions).flat().filter(e => e._func.name === funcName);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        if (e._id.length > 0) {
                            if (
                                !isIdAlreadyExists(e._id) &&
                                !isFunctionNameAlreadyExists(e._func.name)
                            ) {

                                const isParameterIdAlreadyExists = (id: string) => {
                                    const parameters = e._params.map(e => e._id).filter(e => e === id);

                                    if (parameters.length > 1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }

                                if (e._params.length > 0) {
                                    e._params.forEach(p => {
                                        if (p._id.length > 0) {
                                            if (isParameterIdAlreadyExists(p._id)) {
                                                Logger.Error('build', `Action with id: "${e._id}" has duplicated parameters id's (${p._id})!`, 'Please change your parameter id.');
                                                if (!watch) Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Action with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            if (!watch) Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Action with id: "${e._id}" is already exists in plugin!`, 'Please change your action id.');
                                if (!watch) Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Action with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your action method name.');
                                if (!watch) Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Action id cannot be empty!`, 'Please specify your action id.', `Category id: ${category._id}`);
                            if (!watch) Deno.exit(1);
                        }
                    })

                    category._conditions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = addon._categories.map(c => c._conditions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = addon._categories.map(c => c._conditions).flat().filter(e => e._func.name === funcName);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        if (e._id.length > 0) {
                            if (
                                !isIdAlreadyExists(e._id) &&
                                !isFunctionNameAlreadyExists(e._func.name)
                            ) {

                                const isParameterIdAlreadyExists = (id: string) => {
                                    const parameters = e._params.map(e => e._id).filter(e => e === id);

                                    if (parameters.length > 1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }

                                if (e._params.length > 0) {
                                    e._params.forEach(p => {
                                        if (p._id.length > 0) {
                                            if (isParameterIdAlreadyExists(p._id)) {
                                                Logger.Error('build', `Condition with id: "${e._id}" has duplicated parameters id's (${p._id})!`, 'Please change your parameter id.');
                                                if (!watch) Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Condition with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            if (!watch) Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Condition with id: "${e._id}" is already exists in plugin!`, 'Please change your condition id.');
                                if (!watch) Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Condition with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your condition method name.');
                                if (!watch) Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Condition id cannot be empty!`, 'Please specify your condition id.', `Category id: ${category._id}`);
                            if (!watch) Deno.exit(1);
                        }
                    })

                    category._expressions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = addon._categories.map(c => c._expressions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = addon._categories.map(c => c._expressions).flat().filter(e => e._func.name === funcName);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        if (e._id.length > 0) {
                            if (
                                !isIdAlreadyExists(e._id) &&
                                !isFunctionNameAlreadyExists(e._func.name)
                            ) {

                                const isParameterIdAlreadyExists = (id: string) => {
                                    const parameters = e._params.map(e => e._id).filter(e => e === id);

                                    if (parameters.length > 1) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }

                                if (e._params.length > 0) {
                                    e._params.forEach(p => {
                                        if (p._id.length > 0) {
                                            if (isParameterIdAlreadyExists(p._id)) {
                                                Logger.Error('build', `Expression with id: "${e._id}" has duplicated parameters id's (${p._id})!`, 'Please change your parameter id.');
                                                if (!watch) Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Expression with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            if (!watch) Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Expression with id: "${e._id}" is already exists in plugin!`, 'Please change your expression id.');
                                if (!watch) Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Expression with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your expression method name.');
                                if (!watch) Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Expression id cannot be empty!`, 'Please specify your expression id.', `Category id: ${category._id}`);
                            if (!watch) Deno.exit(1);
                        }
                    })

                } else {
                    Logger.Error('build', `Category with id: "${category._id}" is already exists in plugin!`, 'Please change your category id.');
                    if (!watch) Deno.exit(1);
                }
            } else {
                Logger.Error('build', `Category id cannot be empty!`, 'Please specify your category id.');
                if (!watch) Deno.exit(1);
            }
        })
    }

    async function createModuleFile() {
        if (addon._userModules.length > 0) {
            await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'main.js'), ModuleFile('plugin'));
        }
    }

    async function createInstanceFile() {
        const path = join(Paths.Main, 'Addon', 'Instance.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(addon._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'instance.js'), fileContent);
    }

    async function createPluginFile() {
        const path = join(Paths.Main, 'Addon', 'Plugin.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(addon._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'plugin.js'), fileContent);
    }

    async function createBehaviorFile() {
        const path = join(Paths.Main, 'Addon', 'Behavior.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(addon._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'behavior.js'), fileContent);
    }

    async function createTypeFile() {
        const path = join(Paths.Main, 'Addon', 'Type.ts');
        let fileContent = await transpileTs(path) as string;
        fileContent = `${Lost(addon._config.addonId)}\n` + fileContent
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'type.js'), fileContent);
    }

    async function createActionsFile() {
        const entities: EntityCollection = {};
        addon._categories.forEach(c => c._actions.forEach(enitity => {

            entities[enitity._func.name] = enitity._func;
        }))

        const fileContent = `${EntityFile(addon._config, EntityType.Action)} ${serializeObjectWithFunctions(entities)}`;
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'actions.js'), fileContent);
    }

    async function createConditionsFile() {
        const entities: EntityCollection = {};
        addon._categories.forEach(c => c._conditions.forEach(entity => {

            entities[entity._func.name] = entity._func;
        }))

        const fileContent = `${EntityFile(addon._config, EntityType.Condition)} ${serializeObjectWithFunctions(entities)}`;
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'conditions.js'), fileContent);
    }

    async function createExpressionsFile() {
        const entities: EntityCollection = {};
        addon._categories.forEach(c => c._expressions.forEach(entity => {

            entities[entity._func.name] = entity._func;
        }))

        const fileContent = `${EntityFile(addon._config, EntityType.Expression)} ${serializeObjectWithFunctions(entities)}`;
        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'expressions.js'), fileContent);
    }

}

// deno-lint-ignore no-explicit-any
const serializeObjectWithFunctions = (obj: any): string => {
    let str = '{\n';
    for (const key in obj) {
        // deno-lint-ignore no-prototype-builtins
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


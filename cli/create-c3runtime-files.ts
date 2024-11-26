import { join, Logger } from '../deps.ts';
import type { Plugin } from "../lib/plugin.ts";

import Lost from './defaults/lost.ts';
import ModuleFile from './defaults/module-file.ts';
import EntityFile from './defaults/entity-file.ts';

import { EntityType } from "../lib/entities/entity.ts";
import { addCategories } from "./add-categories.ts";
import { Paths } from "../shared/paths.ts";
import { transpileTs } from "../shared/transpile-ts.ts";
import { Action, ActionEntity } from "../lib/entities/action.ts";
import { Parameter } from "../lib/entities/parameter.ts";

type EntityCollection = {
    [key: string]: Function;
}

export default async function createC3RuntimeFiles(plugin: Plugin) {

    await addCategories(plugin);
    checkCategories();

    await createModuleFile();
    await createInstanceFile();
    await createPluginFile();
    await createTypeFile();
    await createActionsFile();
    await createConditionsFile();
    await createExpressionsFile();

    function checkCategories() {
        const isCategoryAlreadyExists = (id: string) => {
            const categories = plugin._categories.filter(c => c._id === id);
            if (categories.length > 1) {
                return true;
            } else {
                return false;
            }
        }

        plugin._categories.forEach(category => {
            if (category._id.length > 0) {
                if (!isCategoryAlreadyExists(category._id)) {

                    category._actions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = plugin._categories.map(c => c._actions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = plugin._categories.map(c => c._actions).flat().filter(e => e._func.name === funcName);

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
                                                Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Action with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Action with id: "${e._id}" is already exists in plugin!`, 'Please change your action id.');
                                Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Action with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your action method name.');
                                Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Action id cannot be empty!`, 'Please specify your action id.', `Category id: ${category._id}`);
                            Deno.exit(1);
                        }
                    })

                    category._conditions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = plugin._categories.map(c => c._conditions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = plugin._categories.map(c => c._conditions).flat().filter(e => e._func.name === funcName);

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
                                                Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Condition with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Condition with id: "${e._id}" is already exists in plugin!`, 'Please change your condition id.');
                                Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Condition with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your condition method name.');
                                Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Condition id cannot be empty!`, 'Please specify your condition id.', `Category id: ${category._id}`);
                            Deno.exit(1);
                        }
                    })

                    category._expressions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = plugin._categories.map(c => c._expressions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = plugin._categories.map(c => c._expressions).flat().filter(e => e._func.name === funcName);

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
                                                Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Expression with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Expression with id: "${e._id}" is already exists in plugin!`, 'Please change your expression id.');
                                Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Expression with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your expression method name.');
                                Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Expression id cannot be empty!`, 'Please specify your expression id.', `Category id: ${category._id}`);
                            Deno.exit(1);
                        }
                    })

                } else {
                    Logger.Error('build', `Category with id: "${category._id}" is already exists in plugin!`, 'Please change your category id.');
                    Deno.exit(1);
                }
            } else {
                Logger.Error('build', `Category id cannot be empty!`, 'Please specify your category id.');
                Deno.exit(1);
            }
        })
    }

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


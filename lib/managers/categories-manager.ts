import { Colors, join, Logger } from "../../deps.ts";
import { isDirectoryExists } from "../../shared/misc.ts";
import { Paths } from "../../shared/paths.ts";
import type { ICategory } from "../entities/category.ts";
import { LostAddonProject } from "../lost.ts";

export abstract class AddonCategoriesManager {

    static async getCategories(): Promise<ICategory[]> {
        const categories: ICategory[] = [];

        if (await isDirectoryExists(Paths.ProjectFolders.Categories)) {

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
                    ) {
                        try {
                            const categoryPath = import.meta.resolve(`file://${join(path, entry.name)}`);
                            const categoryModule = (await import(`${categoryPath}?t=${Date.now()}`)).default;
                            const category = (new categoryModule()).constructor.prototype as ICategory;

                            if (
                                category &&
                                !category._inDevelopment
                            ) {
                                categories.push(category);
                            }
                        } catch (e) {
                            Logger.Error(
                                'build',
                                `Error importing category: ${Colors.bold(Colors.magenta(entry.name))}`, e
                            );
                            Deno.exit();
                        }
                    }
                }
            }

            await readDir(Paths.ProjectFolders.Categories);
        }

        this.#checkCategories(categories);

        return categories;
    }

    static #checkCategories(categories: ICategory[]) {
        const isCategoryAlreadyExists = (id: string) => {
            const collection = categories.filter(c => c._id === id);
            if (collection.length > 1) {
                return true;
            } else {
                return false;
            }
        }

        categories.forEach(category => {
            if (category._id.length > 0) {
                if (!isCategoryAlreadyExists(category._id)) {

                    category._actions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = categories.map(c => c._actions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = categories.map(c => c._actions).flat().filter(e => e._func.name === funcName);

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
                                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Action with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Action with id: "${e._id}" is already exists in plugin!`, 'Please change your action id.');
                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Action with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your action method name.');
                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Action id cannot be empty!`, 'Please specify your action id.', `Category id: ${category._id}`);
                            if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                        }
                    })

                    category._conditions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = categories.map(c => c._conditions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = categories.map(c => c._conditions).flat().filter(e => e._func.name === funcName);

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
                                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Condition with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Condition with id: "${e._id}" is already exists in plugin!`, 'Please change your condition id.');
                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Condition with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your condition method name.');
                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Condition id cannot be empty!`, 'Please specify your condition id.', `Category id: ${category._id}`);
                            if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                        }
                    })

                    category._expressions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = categories.map(c => c._expressions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = categories.map(c => c._expressions).flat().filter(e => e._func.name === funcName);

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
                                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                                            }
                                        } else {
                                            Logger.Error('build', `Expression with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                            if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                                        }
                                    })
                                }
                            } else if (isIdAlreadyExists(e._id)) {
                                Logger.Error('build', `Expression with id: "${e._id}" is already exists in plugin!`, 'Please change your expression id.');
                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                            } else if (isFunctionNameAlreadyExists(e._func.name)) {
                                Logger.Error('build', `Expression with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your expression method name.');
                                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                            }
                        } else {
                            Logger.Error('build', `Expression id cannot be empty!`, 'Please specify your expression id.', `Category id: ${category._id}`);
                            if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                        }
                    })

                } else {
                    Logger.Error('build', `Category with id: "${category._id}" is already exists in plugin!`, 'Please change your category id.');
                    if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
                }
            } else {
                Logger.Error('build', `Category id cannot be empty!`, 'Please specify your category id.');
                if (!LostAddonProject.isBuildAndWatch) Deno.exit(1);
            }
        })
    }

}
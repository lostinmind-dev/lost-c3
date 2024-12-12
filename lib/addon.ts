// deno-lint-ignore-file no-case-declarations
import type { AddonType, LostConfig } from "./config.ts";
import type { CategoryClassType } from "./entities/category.ts";
import type { PluginProperty } from "./entities/plugin-property.ts";
import { Colors, join, Logger } from "../deps.ts";
import { MIME } from "../shared/mime.ts";
import { dedent, isDirectoryExists, isFileExists } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";
import { transpileTs } from "../shared/transpile-ts.ts";
import { Property } from './entities/plugin-property.ts';

import Icon from "./defaults/addon-icon.ts";
import { AddonFileManager } from "./managers/addon-file-manager.ts";
import { LostAddonData } from "./lost-addon-data.ts";
import { ProjectFolders } from "../shared/paths/project-folders.ts";
import { EditorScript, JsonFile, RuntimeScript } from "../shared/paths/addon-files.ts";
import { AddonFolders } from "../shared/paths/addon-folders.ts";

export abstract class Addon<A extends AddonType, I, T extends SDK.ITypeBase> {
    protected readonly type: AddonType;
    protected readonly config: LostConfig<A>;

    protected readonly userFiles: AddonUserFile[] = [];
    protected readonly userScripts: AddonUserScriptFile[] = [];
    protected readonly userModules: AddonUserModuleFile[] = [];
    protected readonly userDomSideScripts: AddonUserDomSideScriptFile[] = [];
    protected readonly pluginProperties: PluginProperty<A, I, T>[] = [];
    protected readonly categories: CategoryClassType[] = [];
    protected readonly remoteScripts: string[] = [];
    protected readonly runtimeScripts: string[] = [];

    protected hasDefaultImage: boolean = false;

    protected icon: AddonIconFile = {
        type: 'icon',
        isDefault: true,
        iconType: 'image/svg+xml',
        originalName: 'icon.svg',
        originalPath: '',
        localName: 'icon.svg',
        localPath: '',
        finalPath: 'icon.svg'
    };

    constructor(type: A, config: LostConfig<A>) {
        this.type = type;
        this.config = config;
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            this.#load();
        }
    }

    async #load() {
        await this.#loadAddonIcon(Paths.Root);
        await this.#loadUserFiles(Paths.ProjectFolders.Files);
        await this.#loadUserScripts(Paths.ProjectFolders.Scripts);
        await this.#loadUserModules(Paths.ProjectFolders.Modules);
        await this.#loadUserDomSideScripts(Paths.ProjectFolders.DomSide);
        await this.#createTypes(Paths.ProjectFolders.Types);
        await this.#loadCategories(Paths.ProjectFolders.Categories);
    }

    /** Creates **properties.d.ts** declaration file for plugin properties types */
    async #createTypes(folderPath: string) {
        if (this.pluginProperties.length > 0) {
            let fileContent = `declare type PluginProperties = [`;

            this.pluginProperties.forEach((property, i) => {
                switch (property._opts.type) {
                    case Property.Integer:
                        fileContent = fileContent + `number`
                        break;
                    case Property.Float:
                        fileContent = fileContent + `number`
                        break;
                    case Property.Percent:
                        fileContent = fileContent + `number`
                        break;
                    case Property.Text:
                        fileContent = fileContent + `string`
                        break;
                    case Property.LongText:
                        fileContent = fileContent + `string`
                        break;
                    case Property.Checkbox:
                        fileContent = fileContent + `boolean`
                        break;
                    case Property.Font:
                        fileContent = fileContent + `string`
                        break;
                    case Property.Combo:
                        fileContent = fileContent + `number`
                        break;
                    case Property.Color:
                        fileContent = fileContent + `[number, number, number]`
                        break;
                    case Property.Object:
                        fileContent = fileContent + `number`
                        break;
                    case Property.Group:
                        fileContent = fileContent + `unknown`
                        break;
                    case Property.Info:
                        fileContent = fileContent + `unknown`
                        break;
                    case Property.Link:
                        fileContent = fileContent + `unknown`
                        break;
                }

                if (i < this.pluginProperties.length - 1) {
                    fileContent = fileContent + `, `
                }
            })

            fileContent = fileContent + `]`

            await Deno.mkdir(folderPath, { recursive: true });

            await Deno.writeTextFile(join(folderPath, 'properties.d.ts'), fileContent);
            Logger.Success(`Created 'properties.d.ts' file.`);
        }
    }

    async #loadAddonIcon(folderPath: string) {
        Logger.LogBetweenLines(Colors.bgRed('Loading icon...'));
        let iconFound = false;
        for await (const entry of Deno.readDir(folderPath)) {
            if (
                entry.isFile &&
                (entry.name !== 'default.png') &&
                (entry.name.endsWith('.png') || entry.name.endsWith('.svg'))
            ) {
                const iconType: AddonIconMimeType = (entry.name.endsWith('.png')) ? 'image/png' : 'image/svg+xml';

                this.icon = {
                    isDefault: false,
                    type: 'icon',
                    originalName: entry.name,
                    originalPath: folderPath,
                    localName: entry.name,
                    localPath: Paths.ProjectFolders.Build,
                    iconType,
                    finalPath: entry.name
                }

                iconFound = true;
            }
        }

        if (!iconFound) {
            Logger.Warning(
                `Addon icon was not detected, will be used default [SVG] icon`
            );
        } else {
            Logger.Info(`Loaded [${this.icon.iconType}] addon icon`, `Filename: ${this.icon.originalName}`);
        }
    }

    async #loadUserFiles(folderPath: string) {
        if (await isDirectoryExists(folderPath)) {
            Logger.LogBetweenLines(Colors.bgGreen('Loading files...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {

                        const dependencyType = (entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output';

                        switch (dependencyType) {
                            case 'copy-to-output':
                                const mimeType = MIME.getFileType(entry.name);

                                if (mimeType) {
                                    this.#addUserFile({
                                        type: 'file',
                                        originalName: entry.name,
                                        originalPath: path,
                                        localName: entry.name,
                                        localPath: join(Paths.AddonFolders.Files, ...Paths.getFoldersAfterFolder(path, ProjectFolders.Files)),
                                        dependencyType,
                                        mimeType,
                                        finalPath: `${AddonFolders.Files}`
                                    })
                                } else {
                                    Logger.Warning(
                                        dedent`
                                            Found 'copy-to-output' file (${entry.name}) with unknown MIME type.
                                            File will not be included in final addon build'
                                            ${'https://www.construct.net/en/make-games/manuals/construct-3/tips-and-guides/mime-types'}`
                                    );
                                }
                                break;
                            case 'external-css':
                                this.#addUserFile({
                                    type: 'file',
                                    originalName: entry.name,
                                    originalPath: path,
                                    localName: entry.name,
                                    localPath: join(Paths.AddonFolders.Files, ...Paths.getFoldersAfterFolder(path, ProjectFolders.Files)),
                                    dependencyType: 'external-css',
                                    finalPath: `${AddonFolders.Files}`
                                })
                                break;
                        }
                    }
                }
            }

            await readDir(folderPath);
        }
    }

    async #loadUserScripts(folderPath: string) {
        if (await isDirectoryExists(folderPath)) {
            Logger.LogBetweenLines(Colors.bgYellow('Loading scripts...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        ((entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) || entry.name.endsWith('.js'))
                    ) {
                        if (this.#isFilePathInRuntimeScriptsArray('')) {
                            this.#addUserScript({
                                type: 'script',
                                originalName: entry.name,
                                originalPath: path,
                                localName: entry.name,
                                localPath: join(Paths.AddonFolders.Scripts, ...Paths.getFoldersAfterFolder(path, ProjectFolders.Scripts)),
                                dependencyType: 'external-runtime-script',
                                isTypescript: (entry.name.endsWith('.ts')) ? true : false,
                                finalPath: `${AddonFolders.Scripts}`
                            })
                        } else {
                            this.#addUserScript({
                                type: 'script',
                                originalName: entry.name,
                                originalPath: path,
                                localName: entry.name,
                                localPath: join(Paths.AddonFolders.Scripts, ...Paths.getFoldersAfterFolder(path, ProjectFolders.Scripts)),
                                dependencyType: 'external-dom-script',
                                isTypescript: (entry.name.endsWith('.ts')) ? true : false,
                                finalPath: `${AddonFolders.Scripts}`
                            })
                        }
                    }
                }
            }

            await readDir(folderPath);
        }
    }

    async #loadUserModules(folderPath: string) {
        if (await isDirectoryExists(folderPath)) {
            Logger.LogBetweenLines(Colors.bgBlue('Loading modules...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        ((entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) || entry.name.endsWith('.js'))
                    ) {
                        this.#addUserModule({
                            type: 'module',
                            originalName: entry.name,
                            originalPath: path,
                            localName: entry.name.replace('.ts', '.js'),
                            localPath: join(Paths.AddonFolders.Modules, ...Paths.getFoldersAfterFolder(path, ProjectFolders.Modules)),
                            isTypescript: (entry.name.endsWith('.ts')) ? true : false,
                            finalPath: `${AddonFolders.Runtime}/${AddonFolders.Modules}`
                        })
                    }
                }
            }

            await readDir(folderPath);
        }
    }

    async #loadUserDomSideScripts(folderPath: string) {
        if (await isDirectoryExists(folderPath)) {

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        entry.name.endsWith('.ts')
                    ) {
                        this.#addUserDomSideScript({
                            type: 'dom-side-script',
                            originalName: entry.name,
                            originalPath: path,
                            localName: entry.name.replace('.ts', '.js'),
                            localPath: join(Paths.AddonFolders.DomSide, ...Paths.getFoldersAfterFolder(path, ProjectFolders.DomSide)),
                            finalPath: `${AddonFolders.Runtime}/${AddonFolders.DomSide}`
                        })
                    }
                }
            }

            await readDir(folderPath);
        }
    }

    async #loadCategories(folderPath: string) {
        if (await isDirectoryExists(folderPath)) {

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        entry.name.endsWith('.ts')
                    ) {
                        try {
                            const categoryPath = import.meta.resolve(`file://${join(path, entry.name)}`);
                            const categoryModule = (await import(`${categoryPath}?t=${Date.now()}`)).default;
                            const category = (new categoryModule()).constructor.prototype as CategoryClassType;
                            
                            if (category) {
                                this.#addCategory(category);
                            }
                        } catch (e) {
                            Logger.Error('build', `Error importing category: ${Colors.bold(Colors.magenta(entry.name))}`, e);
                            Deno.exit();
                        }
                    }
                }
            }

            await readDir(folderPath);

        } else {
            Logger.Warning(
                `Addon categories folder was not detected at path: ${Colors.bold(join('Addon', 'Categories'))}!`,
                `Your addon is building without any ACEs`
            );
        }
    }

    #addUserFile(file: AddonUserFile) {
        this.userFiles.push(file);

        switch (file.dependencyType) {
            case "copy-to-output":
                Logger.Loading(
                    `Found [${Colors.dim(Colors.bold(file.mimeType))}] file ${Colors.bold(Colors.green(Colors.bold((file.originalName))))}, will be included in project build`
                );
                break;
            case "external-css":
                Logger.Loading(
                    `Found [${Colors.dim(Colors.bold('CSS'))}] file ${Colors.bold(Colors.dim(Colors.bold((file.originalName))))}`
                );
                break;
        }
    }

    #addUserScript(file: AddonUserScriptFile) {
        this.userScripts.push(file);

        if (file.isTypescript) {
            if (file.dependencyType === 'external-runtime-script')
                Logger.Loading(
                    `Found script ${Colors.blue(Colors.bold((file.originalName)))} (${file.dependencyType})`
                );
        } else {
            Logger.Loading(
                `Found script ${Colors.yellow(Colors.bold((file.originalName)))} (${file.dependencyType})`
            );
        }
    }

    #addUserModule(file: AddonUserModuleFile) {
        this.userModules.push(file);

        if (file.isTypescript) {
            Logger.Loading(
                `Found [${Colors.dim(Colors.bold('TS'))}] module ${Colors.blue(Colors.bold((file.originalName)))}`
            );
        } else {
            Logger.Loading(
                `Found [${Colors.dim(Colors.bold('JS'))}] module ${Colors.yellow(Colors.bold((file.originalName)))}`
            );
        }
    }

    #addUserDomSideScript(file: AddonUserDomSideScriptFile) {
        this.userDomSideScripts.push(file);

        Logger.Loading(
            `Found [${Colors.dim(Colors.bold('TS'))}] DOM side script ${Colors.dim(Colors.bold((file.originalName)))}`
        );
    }

    #addCategory(category: CategoryClassType) {
        if (!category._inDevelopment) {
            this.categories.push(category);
        }
    }

    #isFilePathInRuntimeScriptsArray(path: string) {
        if (this.runtimeScripts.includes(path)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Builder
     */

    public async _build(watch: boolean) {

        this.#checkCategories(watch);

        if (!isBuildError) await this.#createAddonStructure();

        if (!isBuildError) await this.#createC3RuntimeFiles();

        if (!isBuildError) await this.#createC3EditorFiles();

        if (!isBuildError) await this.#createC3JsonFiles();

        return;
    }

    async #createIcon() {
        if (this.icon.isDefault) {
            await Deno.writeTextFile(join(this.icon.localPath, this.icon.localName), Icon())
        } else {
            await Deno.copyFile(join(this.icon.originalPath, this.icon.originalName), join(this.icon.localPath, this.icon.localName));
        }
    }

    async #copyUserFiles() {
        if (this.userFiles.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.Files);

            this.userFiles.forEach(async file => {
                await Deno.mkdir(file.localPath, { recursive: true });

                await Deno.copyFile(join(file.originalPath, file.originalName), join(file.localPath, file.localName));
            })
        }
    }

    async #copyUserScripts() {
        if (this.userScripts.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.Scripts);

            this.userScripts.forEach(async file => {
                if (file.isTypescript) {
                    const fileContent = await transpileTs(join(file.originalPath, file.originalName)) || '';

                    await Deno.mkdir(file.localPath, { recursive: true });

                    await Deno.writeTextFile(join(file.localPath, file.localName), fileContent);
                } else {
                    await Deno.mkdir(file.localPath, { recursive: true });

                    await Deno.copyFile(join(file.originalPath, file.originalName), join(file.localPath, file.localName));
                }
            })
        }
    }

    async #copyUserModules() {
        if (this.userModules.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.Modules);

            this.userModules.forEach(async file => {
                if (file.isTypescript) {
                    const fileContent = await transpileTs(join(file.originalPath, file.originalName)) || '';

                    await Deno.mkdir(file.localPath, { recursive: true });
                    
                    await Deno.writeTextFile(join(file.localPath, file.localName), fileContent);
                } else {
                    await Deno.mkdir(file.localPath, { recursive: true });

                    await Deno.copyFile(join(file.originalPath, file.originalName), join(file.localPath, file.localName));
                }
            })
        }
    }

    async #copyUserDomSideScripts() {
        if (this.userDomSideScripts.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.DomSide, { recursive: true });

            this.userDomSideScripts.forEach(async file => {
                const fileContent = await transpileTs(join(file.originalPath, file.originalName)) || '';

                await Deno.mkdir(file.localPath, { recursive: true });

                await Deno.writeTextFile(join(file.localPath, file.localName), fileContent);
            })
        }
    }

    async #copyDefaultImageFile() {
        const fileName = 'default.png';
        const filePath = Paths.Root;

        if (await isFileExists(join(filePath, fileName))) {
            this.hasDefaultImage = true;
            Logger.Loading(
                `Found default image for drawing plugin`
            );
            await Deno.copyFile(join(filePath, fileName), join(Paths.ProjectFolders.Build, fileName));
        }
    }

    async #createAddonStructure() {
        if (await isDirectoryExists(Paths.ProjectFolders.Build)) {
            await Deno.remove(Paths.ProjectFolders.Build, { recursive: true });
        }

        await Deno.mkdir(Paths.ProjectFolders.Build);
        await Deno.mkdir(Paths.AddonFolders.Runtime);
        await Deno.mkdir(Paths.AddonFolders.Lang)

        await this.#createIcon();
        if (
            this.config.type === 'plugin' &&
            this.config.pluginType === 'world'
        ) {
            await this.#copyDefaultImageFile();
        }
        await this.#copyUserFiles();
        await this.#copyUserScripts();
        await this.#copyUserModules();
        await this.#copyUserDomSideScripts();
    }

    #checkCategories(watch: boolean) {
        const isCategoryAlreadyExists = (id: string) => {
            const categories = this.categories.filter(c => c._id === id);
            if (categories.length > 1) {
                return true;
            } else {
                return false;
            }
        }

        this.categories.forEach(category => {
            if (category._id.length > 0) {
                if (!isCategoryAlreadyExists(category._id)) {

                    category._actions.forEach(e => {
                        const isIdAlreadyExists = (id: string) => {
                            const allEntities = this.categories.map(c => c._actions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = this.categories.map(c => c._actions).flat().filter(e => e._func.name === funcName);

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
                            const allEntities = this.categories.map(c => c._conditions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = this.categories.map(c => c._conditions).flat().filter(e => e._func.name === funcName);

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
                            const allEntities = this.categories.map(c => c._expressions).flat().filter(e => e._id === id);

                            if (allEntities.length > 1) {
                                return true;
                            } else {
                                return false;
                            }
                        }

                        const isFunctionNameAlreadyExists = (funcName: string) => {
                            const allEntities = this.categories.map(c => c._expressions).flat().filter(e => e._func.name === funcName);

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

    async #createC3RuntimeFiles() {
        switch (this.type) {
            case 'plugin':
                await AddonFileManager.createRuntimeScript(RuntimeScript.Plugin, this.config);
                break;
            case 'behavior':
                await AddonFileManager.createRuntimeScript(RuntimeScript.Behavior, this.config);
                break;
        }

        await AddonFileManager.createRuntimeScript(RuntimeScript.Instance, this.config);
        await AddonFileManager.createRuntimeScript(RuntimeScript.Type, this.config);

        await AddonFileManager.createRuntimeScript(RuntimeScript.Actions, this.config, this.categories);
        await AddonFileManager.createRuntimeScript(RuntimeScript.Conditions, this.config, this.categories);
        await AddonFileManager.createRuntimeScript(RuntimeScript.Expressions, this.config, this.categories);

        if (this.userModules.length > 0) {
            await AddonFileManager.createRuntimeScript(RuntimeScript.Module, this.config);
        }
    }

    async #createC3EditorFiles() {
        await AddonFileManager.createEditorScript(EditorScript.Type, this.config);
        await AddonFileManager.createEditorScript(EditorScript.Instance, this.config);

        const lostAddonData = new LostAddonData(
            this.hasDefaultImage,
            { path: this.icon.finalPath, iconType: this.icon.iconType },
            this.config, this.pluginProperties, this.remoteScripts,
            this.userFiles, this.userScripts, this.userModules, this.userDomSideScripts
        )
        switch (this.type) {
            case "plugin":
                await AddonFileManager.createEditorScript(EditorScript.Plugin, this.config, lostAddonData);
                break;
            case "behavior":
                await AddonFileManager.createEditorScript(EditorScript.Behavior, this.config, lostAddonData);
                break;
        }
    }

    async #createC3JsonFiles() {
        await AddonFileManager.createJson(JsonFile.Language, this.config, this.categories, this.pluginProperties);
        await AddonFileManager.createJson(JsonFile.Aces, this.config, this.categories);
        await AddonFileManager.createJson(JsonFile.AddonMetadata, this.config);
    }

    /**
     * Accessors
     */

    public _getConfig() {
        return this.config;
    }
}
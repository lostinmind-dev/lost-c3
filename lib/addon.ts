// deno-lint-ignore-file no-case-declarations
import type { AddonType, LostConfig } from "./config.ts";
import type { CategoryClassType } from "./entities/category.ts";
import type { PluginProperty } from "./entities/plugin-property.ts";
import { Colors, join, Logger } from "../deps.ts";
import { MIME } from "../shared/mime.ts";
import { dedent, getCategory, getRelativePath, isDirectoryExists, isFileExists } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";
import { transpileTs } from "../shared/transpile-ts.ts";
import { Property } from './entities/plugin-property.ts';

import Icon from "./defaults/addon-icon.ts";
import { AddonFileManager, EditorScript, JsonFile, RuntimeScript } from "./addon-file-manager.ts";
import { LostAddonData } from "./lost-addon-data.ts";

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
    protected readonly filesToOutput: string[] = [];
    protected readonly runtimeScripts: string[] = [];

    protected hasDefaultImage: boolean = false;

    protected icon: AddonIconFile = {
        type: 'icon',
        isDefault: true,
        iconType: 'image/svg+xml',
        fileName: 'icon.svg',
        path: '',
        relativePath: 'icon.svg'
    };

    constructor(type: A, config: LostConfig<A>) {
        this.type = type;
        this.config = config;
        this.#load();
    }

    async #load() {
        await this.#loadAddonIcon();
        await this.#loadUserFiles();
        await this.#loadUserScripts();
        await this.#loadUserModules();
        await this.#loadUserDomSideScripts();
        await this.#createTypes();
        await this.#loadCategories();
    }

    /** Creates **properties.d.ts** declaration file for plugin properties types */
    async #createTypes() {
        if (
            (this.type === 'plugin' || this.type === 'behavior') &&
            this.pluginProperties.length > 0
        ) {
            let fileContent = `declare type PluginProperties = [`
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

            await Deno.mkdir(join(Paths.Main, 'Addon', 'Types'), { recursive: true });

            await Deno.writeTextFile(join(Paths.Main, 'Addon', 'Types', 'properties.d.ts'), fileContent);
            Logger.Success(`Created plugin properties types at path: ${join('Addon', 'Types', 'properties.d.ts')}`)
        }
    }

    async #loadAddonIcon() {
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            let iconFound = false;
            for await (const entry of Deno.readDir(Paths.Main)) {
                if (
                    entry.isFile &&
                    (entry.name !== 'default.png') &&
                    (entry.name.endsWith('.png') || entry.name.endsWith('.svg'))
                ) {
                    const iconType: AddonIconMimeType = (entry.name.endsWith('.png')) ? 'image/png' : 'image/svg+xml';

                    this.icon = {
                        isDefault: false,
                        type: 'icon',
                        fileName: entry.name,
                        path: join(Paths.Main, entry.name),
                        relativePath: getRelativePath(Paths.Main, Paths.Main, entry.name, true),
                        iconType
                    }

                    iconFound = true;
                }
            }

            if (!iconFound) {
                Logger.Warning(
                    `Addon icon was not detected, will be used default [SVG] icon`
                );
            } else {
                Logger.Info(`Loaded [${this.icon.iconType}] addon icon`, `Filename: ${this.icon.fileName}`);
            }
        } else {
            return;
            //Logger.Warning("Can't load addon icon. Addon type must be 'plugin' OR 'behavior'");
        }
    }

    async #loadUserFiles() {
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            if (await isDirectoryExists(Paths.UserFiles)) {

                const readDir = async (path: string) => {
                    for await (const entry of Deno.readDir(path)) {
                        if (entry.isDirectory) {
                            await readDir(join(path, entry.name));
                        } else if (entry.isFile) {

                            const dependencyType = (entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output';
                            const relativePath = getRelativePath(path, Paths.UserFiles, entry.name);

                            switch (dependencyType) {
                                case 'copy-to-output':
                                    const mimeType = MIME.getFileType(entry.name);

                                    if (mimeType) {
                                        this.#addUserFile({
                                            type: 'file',
                                            fileName: entry.name,
                                            path: join(path, entry.name),
                                            relativePath,
                                            dependencyType,
                                            mimeType
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
                                    if (this.#isFilePathInOutputFilesArray(relativePath)) {
                                        this.#addUserFile({
                                            type: 'file',
                                            fileName: entry.name,
                                            path: join(path, entry.name),
                                            relativePath,
                                            dependencyType: 'copy-to-output',
                                            mimeType: 'text/css'
                                        })
                                    } else {
                                        this.#addUserFile({
                                            type: 'file',
                                            fileName: entry.name,
                                            path: join(path, entry.name),
                                            relativePath,
                                            dependencyType: 'external-css'
                                        })
                                    }
                                    break;
                            }
                        }
                    }
                }

                await readDir(Paths.UserFiles);
            }
        } else {
            return;
            //Logger.Warning("Can't load addon user files. Addon type must be 'plugin' OR 'behavior'");
        }
    }

    async #loadUserScripts() {
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            if (await isDirectoryExists(Paths.UserScripts)) {
                
                const readDir = async (path: string) => {
                    for await (const entry of Deno.readDir(path)) {
                        if (entry.isDirectory) {
                            await readDir(join(path, entry.name));
                        } else if (
                            entry.isFile &&
                            (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))
                        ) {
                            const isTypescript = (entry.name.endsWith('.ts')) ? true : false;
                            const relativePath = getRelativePath(path, Paths.UserScripts, entry.name);

                            if (this.#isFilePathInRuntimeScriptsArray(relativePath)) {
                                this.#addUserScript({
                                    type: 'script',
                                    fileName: entry.name,
                                    path: join(path, entry.name),
                                    relativePath: relativePath.replace('.ts', '.js'),
                                    dependencyType: 'external-runtime-script',
                                    isTypescript
                                })
                            } else {
                                this.#addUserScript({
                                    type: 'script',
                                    fileName: entry.name,
                                    path: join(path, entry.name),
                                    relativePath: relativePath.replace('.ts', '.js'),
                                    dependencyType: 'external-dom-script',
                                    isTypescript
                                })
                            }
                        }
                    }
                }

                await readDir(Paths.UserScripts);
            }
        } else {
            return;
            //Logger.Warning("Can't load addon user files. Addon type must be 'plugin' OR 'behavior'");
        }
    }

    async #loadUserModules() {
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            if (await isDirectoryExists(Paths.UserModules)) {

                const readDir = async (path: string) => {
                    for await (const entry of Deno.readDir(path)) {
                        if (entry.isDirectory) {
                            await readDir(join(path, entry.name));
                        } else if (
                            entry.isFile &&
                            (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))
                        ) {
                            const isTypescript = (entry.name.endsWith('.ts')) ? true : false;
                            const relativePath = getRelativePath(path, Paths.UserScripts, entry.name);

                            this.#addUserModule({
                                type: 'module',
                                fileName: entry.name,
                                path: join(path, entry.name),
                                relativePath: relativePath.replace('.ts', '.js'),
                                isTypescript
                            })
                        }
                    }
                }

                await readDir(Paths.UserModules);
            }
        } else {
            return;
            //Logger.Warning("Can't load addon user modules. Addon type must be 'plugin' OR 'behavior'");
        }
    }

    async #loadUserDomSideScripts() {
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            if (await isDirectoryExists(Paths.UserDomSideScripts)) {

                const readDir = async (path: string) => {
                    for await (const entry of Deno.readDir(path)) {
                        if (entry.isDirectory) {
                            await readDir(join(path, entry.name));
                        } else if (
                            entry.isFile &&
                            entry.name.endsWith('.ts')
                        ) {
                            const relativePath = getRelativePath(path, Paths.UserScripts, entry.name);

                            this.#addUserDomSideScript({
                                type: 'dom-side-script',
                                fileName: entry.name,
                                path: join(path, entry.name),
                                relativePath: relativePath.replace('.ts', '.js')
                            })
                        }
                    }
                }

                await readDir(Paths.UserDomSideScripts);
            }
        } else {
            return;
            //Logger.Warning("Can't load addon user dom side scripts. Addon type must be 'plugin' OR 'behavior'");
        }
    }

    async #loadCategories() {
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {

            if (await isDirectoryExists(Paths.UserCategories)) {

                const readDir = async (path: string) => {
                    for await (const entry of Deno.readDir(path)) {
                        if (entry.isDirectory) {
                            await readDir(join(path, entry.name));
                        } else if (
                            entry.isFile &&
                            entry.name.endsWith('.ts')
                        ) {
                            try {
                                const category = await getCategory(`file://${join(path, entry.name)}`);

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

                await readDir(Paths.UserCategories);

            } else {
                Logger.Warning(
                    `Addon categories folder was not detected at path: ${Colors.bold(join('Addon', 'Categories'))}!`,
                    `Your addon is building without any ACEs`
                );
            }

        } else {
            return;
        }
    }

    #addUserFile(file: AddonUserFile) {
        this.userFiles.push(file);

        switch (file.dependencyType) {
            case "copy-to-output":
                Logger.Loading(
                    `Found file at path: ${Colors.bold(Colors.green(`${join('Addon', 'Files', file.relativePath)}`))}, will be included in project build`
                );
                break;
            case "external-css":
                Logger.Loading(
                    `Found CSS file at path: ${Colors.bold(Colors.dim(`${join('Addon', 'Files', file.relativePath)}`))}`
                );
                break;
        }
    }

    #addUserScript(file: AddonUserScriptFile) {
        this.userScripts.push(file);

        if (file.isTypescript) {
            if (file.dependencyType === 'external-runtime-script')
            Logger.Loading(
                `Found script at path: ${Colors.blue(`${Colors.bold(join('Addon', 'Scripts', file.relativePath))}`)} (${file.dependencyType})`
            );
        } else {
            Logger.Loading(
                `Found script at path: ${Colors.yellow(`${Colors.bold(join('Addon', 'Scripts', file.relativePath))}`)} (${file.dependencyType})`
            );
        }
    }

    #addUserModule(file: AddonUserModuleFile) {
        this.userModules.push(file);

        if (file.isTypescript) {
            Logger.Loading(
                `Found module at path: ${Colors.blue(`${Colors.bold(join('Addon', 'Modules', file.relativePath))}`)}`
            );
        } else {
            Logger.Loading(
                `Found module at path: ${Colors.yellow(`${Colors.bold(join('Addon', 'Modules', file.relativePath))}`)}`
            );
        }
    }

    #addUserDomSideScript(file: AddonUserDomSideScriptFile) {
        this.userDomSideScripts.push(file);

        Logger.Loading(
            `Found DOM side script at path: ${Colors.dim(`${Colors.bold(join('Addon', 'DomSide', file.relativePath))}`)}`
        );
    }

    #addCategory(category: CategoryClassType) {
        if (!category._inDevelopment) {
            this.categories.push(category);
        }
    }

    #isFilePathInOutputFilesArray(path: string) {
        if (this.filesToOutput.includes(path)) {
            return true;
        } else {
            return false;
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
        if (
            this.type === 'plugin' ||
            this.type === 'behavior'
        ) {
            if (this.icon.isDefault) {
                await Deno.writeTextFile(join(Paths.Build, this.icon.relativePath), Icon())
            } else {
                await Deno.copyFile(this.icon.path, join(Paths.Build, this.icon.fileName));
            }
        } else {
            return;
        }
    }

    async #copyUserFilesTo(folderName: string) {
        if (this.userFiles.length > 0) {
            await Deno.mkdir(join(Paths.Build, folderName));

            this.userFiles.forEach(async file => {
                const destinationPath = join(Paths.Build, folderName, file.relativePath);
                const normalizedPath = destinationPath.replace(/\\/g, '/');
                const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                await Deno.mkdir(destinationDir, { recursive: true });

                await Deno.copyFile(file.path, join(Paths.Build, folderName, file.relativePath));
            })
        }
    }

    async #copyUserScriptsTo(folderName: string) {
        if (this.userScripts.length > 0) {
            await Deno.mkdir(join(Paths.Build, folderName));

            this.userScripts.forEach(async file => {
                if (file.isTypescript) {
                    const newFilePath = file.relativePath.replace('.ts', '.js');

                    const destinationPath = join(Paths.Build, folderName, newFilePath);
                    const normalizedPath = destinationPath.replace(/\\/g, '/');
                    const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                    await Deno.mkdir(destinationDir, { recursive: true });

                    const fileContent = await transpileTs(file.path) as string || '';
                    await Deno.writeTextFile(join(Paths.Build, folderName, newFilePath), fileContent);
                } else {
                    const destinationPath = join(Paths.Build, folderName, file.relativePath);
                    const normalizedPath = destinationPath.replace(/\\/g, '/');
                    const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                    await Deno.mkdir(destinationDir, { recursive: true });

                    await Deno.copyFile(file.path, join(Paths.Build, folderName, file.relativePath));
                }
            })
        }
    }

    async #copyUserModulesTo(folderName: string) {
        if (this.userModules.length > 0) {
            await Deno.mkdir(join(Paths.Build, 'c3runtime', folderName));

            this.userModules.forEach(async file => {
                if (file.isTypescript) {
                    const destinationPath = join(Paths.Build, 'c3runtime', folderName, file.relativePath);
                    const normalizedPath = destinationPath.replace(/\\/g, '/');
                    const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                    await Deno.mkdir(destinationDir, { recursive: true });

                    await Deno.copyFile(file.path, join(Paths.Build, 'c3runtime', folderName, file.relativePath));
                } else {
                    const newFilePath = file.relativePath.replace('.ts', '.js');

                    const destinationPath = join(Paths.Build, 'c3runtime', folderName, newFilePath);
                    const normalizedPath = destinationPath.replace(/\\/g, '/');
                    const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                    await Deno.mkdir(destinationDir, { recursive: true });

                    const fileContent = await transpileTs(file.path) as string || '';

                    await Deno.writeTextFile(join(Paths.Build, 'c3runtime', folderName, newFilePath), fileContent);
                }
            })
        }
    }

    async #copyUserDomSideScriptsTo(folderName: string) {
        if (this.userDomSideScripts.length > 0) {
            await Deno.mkdir(join(Paths.Build, 'c3runtime', folderName));

            this.userDomSideScripts.forEach(async file => {
                const newFilePath = file.relativePath.replace('.ts', '.js');

                const destinationPath = join(Paths.Build, 'c3runtime', folderName, newFilePath);
                const normalizedPath = destinationPath.replace(/\\/g, '/');
                const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                await Deno.mkdir(destinationDir, { recursive: true });

                const fileContent = await transpileTs(file.path) as string || '';
                await Deno.writeTextFile(join(Paths.Build, 'c3runtime', folderName, newFilePath), fileContent);
            })
        }
    }

    async #copyDefaultImageFile() {
        const fileName = 'default.png';
        const filePath = join(Paths.Main, fileName);

        if (await isFileExists(filePath)) {
            this.hasDefaultImage = true;
            Logger.Loading(
                `Found default image for drawing plugin`
            );
            await Deno.copyFile(
                filePath, join(Paths.Build, fileName)
            );
        }
    }

    async #createAddonStructure() {
        if (await isDirectoryExists(Paths.Build)) {
            await Deno.remove(Paths.Build, { recursive: true });
        }

        await Deno.mkdir(Paths.Build);
        await Deno.mkdir(join(Paths.Build, 'c3runtime'));
        await Deno.mkdir(join(Paths.Build, 'lang'));

        await this.#createIcon();
        if (
            this.config.type === 'plugin' &&
            this.config.pluginType === 'world'
        ) {
            await this.#copyDefaultImageFile();
        }
        await this.#copyUserFilesTo('files');
        await this.#copyUserScriptsTo('scripts');
        await this.#copyUserModulesTo('modules');
        await this.#copyUserDomSideScriptsTo('domSide');
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

        // await AddonFileManager.createRuntimeScript(RuntimeScript.Module, this.config);
    }

    async #createC3EditorFiles() {
        await AddonFileManager.createEditorScript(EditorScript.Type, this.config);
        await AddonFileManager.createEditorScript(EditorScript.Instance, this.config);

        const lostAddonData = new LostAddonData(
            this.hasDefaultImage,
            { path: this.icon.relativePath, iconType: this.icon.iconType },
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
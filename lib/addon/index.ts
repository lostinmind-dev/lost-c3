// deno-lint-ignore-file no-case-declarations
import type { LostConfig } from "../lost-config.ts";
import type { AddonType, EditorScript, LostData, LostDataFile, RemoteScript, RuntimeScript } from "../types/index.ts";
import { type AddonPropertyOptions, PluginProperty, Property } from "../entities/plugin-property.ts";
import type { AddonFile } from "../types/addon-file.ts";
import { Logger } from "../../shared/logger.ts";
import { Colors, join } from "../../deps.ts";
import { isDirectoryExists, isFileExists } from "../../shared/misc.ts";
import { Paths, ProjectFolders } from "../../shared/paths.ts";
import type { ICategory } from "../entities/category.ts";
import { Mime, MimeType } from "../../shared/mime.ts";
import { AddonFileDependencyType } from "../types/addon-file.ts";
import { LostProject } from "../lost-project.ts";
import { AddonBuilder } from "./builder.ts";

type InstanceType<P> =
    P extends 'object' ? SDK.IInstanceBase :
    P extends 'world' ? SDK.IWorldInstanceBase : never
    ;

type AddonFilesCollection = {
    icon: AddonFile<'icon'>;
    defaultImage: AddonFile<'image'> | null;
    readonly scripts: AddonFile<'script'>[];
    readonly modules: AddonFile<'module-script'>[];
    readonly files: AddonFile<'file'>[];
}

type EditorScriptsTarget =
    | 'scripts'
    | 'modules'
    ;

type EditorScriptsType =
    | Set<EditorScript>
    | 'all'
    | null
    ;
export abstract class Addon<A extends AddonType = any, P = any> {

    static config: LostConfig = {} as LostConfig;
    static categories: ICategory[] = [];
    static properties: PluginProperty[] = [];
    static filesCollection: AddonFilesCollection = {
        icon: {} as AddonFile<'icon'>,
        defaultImage: null,
        scripts: [],
        modules: [],
        files: []
    };
    static remoteScripts: Set<RemoteScript> = new Set();
    static runtimeScripts: Set<RuntimeScript> = new Set();
    static editorScripts: {
        modules: EditorScriptsType,
        scripts: EditorScriptsType
    } = {
        modules: null,
        scripts: null
    };

    constructor(config: LostConfig) {
        Addon.#reset();
        Addon.config = config;
    }

    static #reset() {
        this.config = {} as LostConfig;
        
        this.categories = [];
        this.properties = [];
        this.filesCollection = {
            icon: {} as AddonFile<'icon'>,
            defaultImage: null,
            scripts: [],
            modules: [],
            files: []
        }
        this.remoteScripts = new Set();
        this.runtimeScripts = new Set();
        this.editorScripts = {
            modules: null,
            scripts: null
        }
    }

    /**
     * Adds editor scripts to *addon.json* file
     * @param target Folder where the script is
     * @param scripts 
     * @returns 
     */
    setEditorScripts(target: EditorScriptsTarget, scripts?: EditorScript[]): this {
        switch (target) {
            case "scripts":
                if (!scripts || scripts.length === 0) {
                    Addon.editorScripts.scripts = 'all';
                } else {
                    Addon.editorScripts.scripts = new Set(scripts);
                }
                break;
            case "modules":
                if (!scripts || scripts.length === 0) {
                    Addon.editorScripts.modules = 'all';
                } else {
                    Addon.editorScripts.modules = new Set(scripts);
                }
                break;
        }
        return this;
    }

    /**
     * Adds a remote URL to load a script from.
     * - - -
     * @param urls The script URL (or URL's), must not use http: in its URL.
     * @description On the modern web this will often be blocked from secure sites as mixed content.
     * ***You must either use secure HTTPS, or a same-protocol URL.***
     */
    setRemoteScripts(...scripts: RemoteScript[]): this {
        /**
         * Check to https link
         */
        for (const script of scripts) {
            if (script.url.includes('https')) {
                if (script.url.endsWith('.js')) {
                    // Logger.Log(`🌐 Added remoted script with url: ${Colors.dim(script.url)}`)
                    Addon.remoteScripts.add(script);
                } else {
                    Logger.Error('build', `Failed to add remote script with url: (${script.url})`, 'Your url must ends with ".js" script extension.')
                    Deno.exit(1);
                }
            } else {
                Logger.Error('build', `Failed to add remote script with url: (${script.url})`, 'You must either use secure HTTPS, or a same-protocol URL.')
                Deno.exit(1);
            }
        }

        return this;
    }

    /**
     * Changes script dependencyType to: 'external-runtime-script'
     * - - -
     * @description This means the script is always directly available to runtime code. However the dependency must be designed to work in a Web Worker, e.g. not assuming the DOM is present. 
     * The script is not minified on export.
     * @param scripts Runtime script file info.
     */
    setRuntimeScripts(...scripts: RuntimeScript[]): this {
        /**
         * Search file by entered path
         */
        for (const script of scripts) {
            Addon.runtimeScripts.add(script);
        }

        return this;
    }

    /**
     * Creates a new group in the Properties Bar.
     * @description That method using *addProperty* with **Property**.**Group** type in opts object.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the group.
     */
    createGroup<C extends string[]>(id: C[number], name: string): this {
        if (!Addon.#isPropertyExists(id)) {
            if (
                id.length > 0 &&
                name.length > 0
            ) {
                //@ts-ignore
                this.addProperty(id, name, { type: Property.Group });
            } else if (id.length === 0) {
                Logger.Error('build', `Group id can't be empty.`, 'Please specify your group Id.')
                Deno.exit(1);
            } else if (name.length === 0) {
                Logger.Error('build', `Group name can't be empty.`, 'Please specify your group name.')
                Deno.exit(1);
            }
            return this;
        } else {
            Logger.Error('build', `Plugin property with Id: (${id}) already exist in addon.`, 'Please change your property Id.')
            Deno.exit(1);
        }

    }

    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param opts 
     */
    addProperty<I extends InstanceType<P> = any, T extends SDK.ITypeBase = any>(
        id: string,
        name: string,
        opts: AddonPropertyOptions<A, P, I, T>
    ): this
    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param description *Optional*. The property description.
     * @param opts Plugin property options.
     */
    addProperty<I extends InstanceType<P> = any, T extends SDK.ITypeBase = any>(
        id: string,
        name: string,
        description: string,
        opts: AddonPropertyOptions<A, P, I, T>
    ): this
    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param descriptionOrOpts The property description **OR** Plugin property options.
     * @param opts Plugin property options.
     */
    addProperty<I extends InstanceType<P> = any, T extends SDK.ITypeBase = any>(
        id: string,
        name: string,
        descriptionOrOpts: string | AddonPropertyOptions<A, P, I, T>,
        opts?: AddonPropertyOptions<A, P, I, T>
    ) {
        if (!Addon.#isPropertyExists(id)) {
            let description: string = 'There is no any description yet...';
            let options: AddonPropertyOptions<A, P, I, T>;
            if (typeof descriptionOrOpts === 'string' && opts) {
                description = descriptionOrOpts;
                options = opts;
            } else if (typeof descriptionOrOpts === 'object') {
                options = descriptionOrOpts;
            } else {
                Logger.Error('build', `Incorrect plugin property options`, 'Please specify options object.', `Plugin property Id: ${id}`)
                Deno.exit(1);
            }

            if (
                id.length > 0 &&
                name.length > 0
            ) {
                Addon.properties.push(
                    new PluginProperty(id, name, description, options)
                );
            } else if (id.length === 0) {
                Logger.Error('build', `Plugin property id can't be empty.`, 'Please specify your property Id.')
                Deno.exit(1);
            } else if (name.length === 0) {
                Logger.Error('build', `Plugin property name can't be empty.`, 'Please specify your property name.')
                Deno.exit(1);
            }
            return this;
        } else {
            Logger.Error('build', `Plugin property with Id: (${id}) already exist in addon.`, 'Please change your property Id.')
            Deno.exit(1);
        }
    }

    static #isPropertyExists(id: string): boolean {
        const isExists = this.properties.find(p => p.id === id);
        return (isExists) ? true : false;
    }

    /** Loads addon */
    static async load(): Promise<typeof Addon> {
        await this.#loadIcon();
        if (this.#isWorldPluginType()) this.#loadDefaultImage();
        await this.#loadFiles();
        await this.#loadModules();
        await this.#loadScripts();
        await this.#loadCategories();

        return this;
    }

    /** Loads addon icon from **Root** folder */
    static async #loadIcon() {
        Logger.LogBetweenLines(Colors.bgRed('Loading icon...'));
        let iconFound = false;

        for await (const entry of Deno.readDir(Paths.Root)) {
            if (
                entry.isFile &&
                (entry.name !== 'default.png')
            ) {
                const mimeType = Mime.getFileType(entry.name);

                if (mimeType === MimeType.PNG || mimeType === MimeType.SVG) {
                    this.#setIcon({
                        isDefault: false,
                        type: 'icon',
                        name: entry.name,
                        path: Paths.Root,
                        iconType: Mime.getFileType(entry.name) as (MimeType.PNG | MimeType.SVG)
                    })
    
                    iconFound = true;
                }
            }
        }

        if (!iconFound) {
            this.#setIcon({
                isDefault: true,
                type: 'icon',
                name: 'icon.svg',
                path: '',
                iconType: MimeType.SVG
            });
        }
    }

    /**
     * Loads addon default image from **Root** folder
     * @description *Only for world addon plugin type.* 
     */
    static async #loadDefaultImage() {
        Logger.LogBetweenLines(Colors.bgRed('Loading default image...'));

        for await (const entry of Deno.readDir(Paths.Root)) {
            if (
                entry.isFile &&
                (entry.name === 'default.png')
            ) {
                this.#setDefaultImage({
                    type: 'image',
                    name: entry.name,
                    path: Paths.Root,
                })

            }
        }
    }

    /** Loads all user files from **Files** folder */
    static async #loadFiles() {
        if (await isDirectoryExists(Paths.AddonFiles)) {
            Logger.LogBetweenLines(Colors.bgGreen('Loading files...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {

                        const mimeType = Mime.getFileType(entry.name);
                        const dependencyType =
                            (mimeType === MimeType.CSS)
                                ? AddonFileDependencyType.ExternalCSS : AddonFileDependencyType.CopyToOutput
                            ;

                        if (mimeType) {
                            this.#addFile({
                                type: 'file',
                                name: entry.name,
                                path,
                                dependencyType,
                                mimeType
                            })
                        }
                    }
                }
            }

            await readDir(Paths.AddonFiles);
        }
    }

    /** Loads all user modules from **Modules** folder */
    static async #loadModules() {
        if (await isDirectoryExists(Paths.AddonModules)) {
            Logger.LogBetweenLines(Colors.bgBlue('Loading modules...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {
                        const mimeType = Mime.getFileType(entry.name);

                        if (
                            mimeType === MimeType.JS ||
                            mimeType === MimeType.TS
                        ) {
                            this.#addModule({
                                type: 'module-script',
                                name: entry.name,
                                path,
                                isTypescript: (mimeType === MimeType.TS) ? true : false,
                                isEditorScript: this.#isScriptUsedInEditor('module-script', path, entry.name)
                            })
                        }
                    }
                }
            }

            await readDir(Paths.AddonModules);
        }
    }

    /** Loads all user scripts from **Scripts** folder */
    static async #loadScripts() {
        if (await isDirectoryExists(Paths.AddonScripts)) {
            Logger.LogBetweenLines(Colors.bgYellow('Loading scripts...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {
                        const mimeType = Mime.getFileType(entry.name);

                        if (
                            mimeType === MimeType.JS ||
                            mimeType === MimeType.TS
                        ) {
                            this.#addScript({
                                type: 'script',
                                name: entry.name,
                                path,
                                dependencyType: await this.#getScriptDependencyType(path, entry.name),
                                isTypescript: (mimeType === MimeType.TS) ? true : false,
                                isEditorScript: this.#isScriptUsedInEditor('script', path, entry.name)
                            })
                        }
                    }
                }
            }

            await readDir(Paths.AddonScripts);
        }
    }

    static async #loadCategories() {
        if (await isDirectoryExists(Paths.AddonCategories)) {
            Logger.LogBetweenLines(Colors.bgCyan('Loading categories...'));
            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {
                        const mimeType = Mime.getFileType(entry.name);

                        if (mimeType === MimeType.TS) {
                            try {
                                const categoryPath = import.meta.resolve(`file://${join(path, entry.name)}`);
                                const categoryModule = (await import(`${categoryPath}?t=${Date.now()}`)).default;
                                const category = (new categoryModule()).constructor.prototype as ICategory;

                                if (
                                    category &&
                                    '_id' in category
                                ) {
                                    this.#addCategory(category);
                                }
                            } catch (e) {
                                Logger.Error('build', `Error importing category: ${Colors.bold(Colors.magenta(entry.name))}`, e);
                                Deno.exit();
                            }
                        }
                    }
                }
            }

            await readDir(Paths.AddonCategories);
        }
    }

    static #checkCategory(category: ICategory) {
        if (category._id.length > 0) {
            if (!this.#isCategoryExists(category._id)) {

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
                                            AddonBuilder.isBuildError = true;
                                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                                        }
                                    } else {
                                        Logger.Error('build', `Action with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                        AddonBuilder.isBuildError = true;
                                        if (!LostProject.buildOptions.watch) Deno.exit(1);
                                    }
                                })
                            }
                        } else if (isIdAlreadyExists(e._id)) {
                            Logger.Error('build', `Action with id: "${e._id}" is already exists in plugin!`, 'Please change your action id.');
                            AddonBuilder.isBuildError = true;
                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                        } else if (isFunctionNameAlreadyExists(e._func.name)) {
                            Logger.Error('build', `Action with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your action method name.');
                            AddonBuilder.isBuildError = true;
                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                        }
                    } else {
                        Logger.Error('build', `Action id cannot be empty!`, 'Please specify your action id.', `Category id: ${category._id}`);
                        AddonBuilder.isBuildError = true;
                        if (!LostProject.buildOptions.watch) Deno.exit(1);
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
                                            AddonBuilder.isBuildError = true;
                                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                                        }
                                    } else {
                                        Logger.Error('build', `Condition with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                        AddonBuilder.isBuildError = true;
                                        if (!LostProject.buildOptions.watch) Deno.exit(1);
                                    }
                                })
                            }
                        } else if (isIdAlreadyExists(e._id)) {
                            Logger.Error('build', `Condition with id: "${e._id}" is already exists in plugin!`, 'Please change your condition id.');
                            AddonBuilder.isBuildError = true;
                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                        } else if (isFunctionNameAlreadyExists(e._func.name)) {
                            Logger.Error('build', `Condition with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your condition method name.');
                            AddonBuilder.isBuildError = true;
                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                        }
                    } else {
                        Logger.Error('build', `Condition id cannot be empty!`, 'Please specify your condition id.', `Category id: ${category._id}`);
                        AddonBuilder.isBuildError = true;
                        if (!LostProject.buildOptions.watch) Deno.exit(1);
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
                                            AddonBuilder.isBuildError = true;
                                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                                        }
                                    } else {
                                        Logger.Error('build', `Expression with id: "${e._id}" has empty parameter id!`, 'Please specify your parameter id.');
                                        AddonBuilder.isBuildError = true;
                                        if (!LostProject.buildOptions.watch) Deno.exit(1);
                                    }
                                })
                            }
                        } else if (isIdAlreadyExists(e._id)) {
                            Logger.Error('build', `Expression with id: "${e._id}" is already exists in plugin!`, 'Please change your expression id.');
                            AddonBuilder.isBuildError = true;
                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                        } else if (isFunctionNameAlreadyExists(e._func.name)) {
                            Logger.Error('build', `Expression with id: "${e._id}" has method name that is already exists in plugin!`, 'Please change your expression method name.');
                            AddonBuilder.isBuildError = true;
                            if (!LostProject.buildOptions.watch) Deno.exit(1);
                        }
                    } else {
                        Logger.Error('build', `Expression id cannot be empty!`, 'Please specify your expression id.', `Category id: ${category._id}`);
                        AddonBuilder.isBuildError = true;
                        if (!LostProject.buildOptions.watch) Deno.exit(1);
                    }
                })

            } else {
                Logger.Error('build', `Category with id: "${category._id}" is already exists in plugin!`, 'Please change your category id.');
                AddonBuilder.isBuildError = true;
                if (!LostProject.buildOptions.watch) Deno.exit(1);
            }
        } else {
            Logger.Error('build', `Category id cannot be empty!`, 'Please specify your category id.');
            AddonBuilder.isBuildError = true;
            if (!LostProject.buildOptions.watch) Deno.exit(1);
        }
    }

    static #isCategoryExists(id: string): boolean {
        const categories = this.categories.filter(c => c._id === id);
        if (categories.length > 1) {
            return true;
        } else {
            return false;
        }
    }

    /** Sets addon icon */
    static #setIcon(icon: AddonFile<'icon'>) {
        this.filesCollection.icon = icon;

        if (!icon.isDefault) {
            Logger.Info(
                `Loaded addon icon [${Colors.bold(Colors.dim(icon.name))}]`
            );
        } else {
            Logger.Warning(
                `Addon icon was not detected, will be used default [${Colors.bold(Colors.dim('icon.svg'))}] icon`
            );
        }
    }

    /** Sets addon default image
     * @description *Only for world addon plugin type.* 
     */
    static #setDefaultImage(defaultImage: AddonFile<'image'>) {
        this.filesCollection.defaultImage = defaultImage;
    }

    /** Adds addon file */
    static #addFile(file: AddonFile<'file'>) {
        this.filesCollection.files.push(file);

        switch (file.dependencyType) {
            case AddonFileDependencyType.CopyToOutput:
                Logger.Loading(
                    `Found [${Colors.dim(Colors.bold(file.mimeType))}] file ${Colors.bold(Colors.green(Colors.bold((file.name))))} ${this.#getFileTags(file)}`
                );
                break;
            case AddonFileDependencyType.ExternalCSS:
                Logger.Loading(
                    `Found [${Colors.dim(Colors.bold('CSS'))}] file ${Colors.bold(Colors.dim(Colors.bold((file.name))))} ${this.#getFileTags(file)}`
                );
                break;
        }
    }

    /** Adds addon module file */
    static #addModule(module: AddonFile<'module-script'>) {
        this.filesCollection.modules.push(module);

        if (module.isTypescript) {
            Logger.Loading(
                `Found [${Colors.dim(Colors.bold('TS'))}] module ${Colors.blue(Colors.bold((module.name)))} ${this.#getFileTags(module)}`,
            );
        } else {
            Logger.Loading(
                `Found [${Colors.dim(Colors.bold('JS'))}] module ${Colors.yellow(Colors.bold((module.name)))} ${this.#getFileTags(module)}`
            );
        }
    }

    /** Adds addon script file */
    static #addScript(script: AddonFile<'script'>) {
        this.filesCollection.scripts.push(script);

        if (script.isTypescript) {
            Logger.Loading(
                `Found script ${Colors.blue(Colors.bold((script.name)))} ${this.#getFileTags(script)}`
            );
        } else {
            Logger.Loading(
                `Found script ${Colors.yellow(Colors.bold((script.name)))} ${this.#getFileTags(script)}`
            );
        }
    }

    /** @returns Comma seperated tags depends of file type */
    static #getFileTags(file: AddonFile): string {
        const tags: string[] = [];
        switch (file.type) {
            case "file":
                if (file.dependencyType === AddonFileDependencyType.CopyToOutput) {
                    tags.push('Copy To Output');
                }
                if (file.dependencyType === AddonFileDependencyType.ExternalCSS) {
                    tags.push('External CSS');
                }
                break;
            case "script":
                if (file.dependencyType === AddonFileDependencyType.ExternalDomScript) {
                    tags.push('DOM');
                }
                if (file.dependencyType === AddonFileDependencyType.ExternalRuntimeScript) {
                    tags.push('Runtime');
                }
                if (file.isEditorScript === true) {
                    tags.push('Editor');
                }
                break;
            case "module-script":
                if (file.isEditorScript === true) {
                    tags.push('Editor');
                }
                break;
        }

        if (tags.length > 0) {
            return Colors.dim(`[${tags.join(', ')}]`);
        } else {
            return '';
        }
    }

    /** Adds addon category */
    static #addCategory(category: ICategory) {
        if (!category._inDevelopment) {
            this.#checkCategory(category);

            Logger.Loading(
                `Found category [${Colors.cyan(Colors.bold((category._name)))}]`
            );

            this.categories.push(category);

        }
    }

    /** @returns *true* if addon type is *plugin* and *pluginType* is *world* */
    static #isWorldPluginType(): boolean {
        if (
            this.config &&
            this.config.type === 'plugin' &&
            this.config.pluginType === 'world'
        ) {
            return true;
        } else {
            return false;
        }
    }

    /** 
     * @returns
     * @type {AddonFileDependencyType.ExternalDomScript} OR @type {AddonFileDependencyType.ExternalDomScript}
     */
    static async #getScriptDependencyType(filePath: string, fileName: string) {
        let dependencyType = AddonFileDependencyType.ExternalDomScript;
        /** Check for script path in *runtimeScripts* */
        for (const script of this.runtimeScripts) {

            if (script.type === 'file') {
                if (await isFileExists(join(filePath, fileName))) {
                    let convertedPath: string = `${fileName}`;

                    const folders = Paths.getFoldersAfterFolder(filePath, Paths.AddonScripts);

                    if (folders.length > 0) {
                        convertedPath = `${folders.join('/')}/${fileName}`
                    }

                    if (script.path === convertedPath) {
                        dependencyType = AddonFileDependencyType.ExternalRuntimeScript;
                    }
                } else {
                    Logger.Error(
                        'build', `Failed to add runtime script with path: (${script.path})`, 'File not found'
                    );
                    Deno.exit(1);
                }  
            } else if (script.type === 'directory') {
                if (await isDirectoryExists(join(Paths.AddonScripts, script.path))) {
                    const readDir = async (path: string) => {
                        for await (const entry of Deno.readDir(path)) {
                            if (entry.isDirectory) {
                                await readDir(join(path, entry.name));
                            } else if (entry.isFile) {
                                const mimeType = Mime.getFileType(entry.name);

                                if (mimeType === MimeType.TS || mimeType === MimeType.JS) {
                                    dependencyType = AddonFileDependencyType.ExternalRuntimeScript;
                                }
                            }
                        }
                    }

                    await readDir(join(Paths.AddonScripts, script.path))
                } else {
                    Logger.Error(
                        'build', `Failed to add runtime scripts directory with path: (${script.path})`, 'Directory not found'
                    );
                    Deno.exit(1);
                }
            } else {
                return AddonFileDependencyType.ExternalDomScript;
            }
        }

        return dependencyType;
    }

    /** 
     * @returns *true* if the script was added to *runtimeScripts* collection
     * OR it was used in editor *Instance.ts* OR editor *Type.ts* files.
     * */
    static #isScriptUsedInEditor(type: 'script' | 'module-script', filePath: string, fileName: string): boolean {
        /** Check for script path in *editorScripts* */
        if (
            type === 'script' &&
            this.editorScripts.scripts
        ) {
            if (this.editorScripts.scripts === 'all') {
                return true;
            } else {
                for (const script of this.editorScripts.scripts) {
                    let convertedPath: string = `${fileName}`;

                    const folders = Paths.getFoldersAfterFolder(filePath, Paths.AddonScripts);

                    if (folders.length > 0) {
                        convertedPath = `${folders.join('/')}/${fileName}`
                    };
                    return (script.path === convertedPath);
                }
            }
        } else if (
            type === 'module-script' &&
            this.editorScripts.modules
        ) {
            if (this.editorScripts.modules === 'all') {
                return true;
            } else {
                for (const script of this.editorScripts.modules) {
                    let convertedPath: string = `${fileName}`;

                    const folders = Paths.getFoldersAfterFolder(filePath, Paths.AddonModules);

                    if (folders.length > 0) {
                        convertedPath = `${folders.join('/')}/${fileName}`
                    };
                    return (script.path === convertedPath);
                }
            }
        }

        /** Check for script using in editor *Instance.ts* OR editor *Type.ts* files */
        return false;
    }

    /** @returns Data for addon *plugin.js* OR *behavior.js* editor script file */
    static getData(): LostData {
        const addonFiles: LostDataFile[] = [];

        const files = this.filesCollection.files;
        const modules = this.filesCollection.modules;
        const scripts = this.filesCollection.scripts;

        files.forEach(file => {
            addonFiles.push({
                type: 'file',
                path: file.addonPath || '',
                dependencyType: file.dependencyType,
                mimeType: ('mimeType' in file) ? file.mimeType : undefined
            })
        })

        modules.forEach(module => {
            addonFiles.push({
                type: 'module-script',
                path: module.addonPath || ''
            })
        })

        scripts.forEach(script => {
            addonFiles.push({
                type: 'script',
                path: script.addonPath || '',
                dependencyType: script.dependencyType
            })
        })

        const data: LostData = {
            hasDefaultImage: (this.filesCollection.defaultImage) ? true : false,
            icon: {
                name: this.filesCollection.icon.name,
                iconType: this.filesCollection.icon.iconType
            },
            config: this.config,
            remoteScripts: [...this.remoteScripts],
            properties: this.properties,
            files: addonFiles
        }


        return data;
    }

}
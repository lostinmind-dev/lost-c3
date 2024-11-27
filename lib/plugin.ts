
import type { PluginConfig } from "./config.ts";
import { PluginProperty, Property, type PropertyOptions } from "./entities/plugin-property.ts";
import { Addon } from "./addon.ts";
import { Colors, join, Logger } from "../deps.ts";
import { Paths } from "../shared/paths.ts";
import { getRelativePath } from "../shared/misc.ts";
import { MIME } from "../shared/mime.ts";
import type { CategoryClassType } from "./entities/category.ts";

export class Plugin extends Addon {
    readonly _userFiles: AddonUserFile[] = [];
    readonly _filesToOutput: string[] = [];

    readonly _runtimeScripts: string[] = [];
    readonly _userScripts: AddonScriptFile[] = [];
    readonly _userModules: AddonModuleFile[] = [];

    readonly _remoteScripts: string[] = [];
    readonly _pluginProperties: PluginProperty[] = [];
    readonly _categories: CategoryClassType[] = [];

    constructor(config: PluginConfig) {
        super('plugin', config);
        this._load();
    }

    private async _load(): Promise<void> {
        await this.loadAddonIcon();
        await this.loadUserFiles();
        await this.loadUserScripts();
        await this.loadUserModules();
        await this.createTypes();
    }

    private async createTypes() {
        if (this._pluginProperties.length > 0) {
            let fileContent = `declare type PluginProperties = [`
            this._pluginProperties.forEach((property, i) => {
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

                if (i < this._pluginProperties.length - 1) {
                    fileContent = fileContent + `, `
                }
            })

            fileContent = fileContent + `]`

            await Deno.mkdir(join(Paths.Main, 'Addon', 'Types'), { recursive: true });

            await Deno.writeTextFile(join(Paths.Main, 'Addon', 'Types', 'properties.d.ts'), fileContent);
        }
    }

    private async loadAddonIcon() {
        for await (const entry of Deno.readDir(join(Paths.Main))) {
            if (
                entry.isFile &&
                (entry.name.endsWith('.png') || entry.name.endsWith('.svg'))
            ) {
                const isPng = entry.name.endsWith('.png');
                const isSvg = entry.name.endsWith('.svg');

                if (isPng) {
                    this._icon = {
                        type: 'icon',
                        fileName: entry.name,
                        path: join(Paths.Main, entry.name),
                        relativePath: getRelativePath(Paths.Main, Paths.Main, entry.name, true),
                        iconType: 'image/png'
                    }
                } else if (isSvg) {
                    this._icon = {
                        type: 'icon',
                        fileName: entry.name,
                        path: join(Paths.Main, entry.name),
                        relativePath: getRelativePath(Paths.Main, '', entry.name, true),
                        iconType: 'image/svg+xml'
                    }
                } else if (!isPng && !isSvg) {
                    this._icon = null;
                }
            }
        }

        if (!this._icon) {
            Logger.Warning(`Addon icon was not detected, will be used default [SVG] icon`);
        } else {
            Logger.Info(`Loaded [${this._icon.iconType}] addon icon`, `Filename: ${this._icon.fileName}`);
        }
        return this._icon;
    }

    private async loadUserFiles() {
        try {
            const dirStat = await Deno.stat(Paths.Files)

            if (dirStat) {

                const readDir = async (_path: string) => {
                    for await (const entry of Deno.readDir(_path)) {
                        if (entry.isDirectory) {
                            await readDir(join(_path, entry.name))
                        }
                        if (entry.isFile) {
                            const dependencyType = (entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output';
                            const relativePath = getRelativePath(_path, Paths.Files, entry.name);

                            switch (dependencyType) {
                                case 'copy-to-output':
                                    this._userFiles.push({
                                        type: 'file',
                                        fileName: entry.name,
                                        path: join(_path, entry.name),
                                        relativePath,
                                        dependencyType: 'copy-to-output',
                                        mimeType: MIME.getFileType(entry.name)
                                    })
                                    Logger.Loading(`Founded file at path: ${Colors.green(`${Colors.bold(join('Addon', 'Files', relativePath))}`)}, will be included in project build`);
                                    break;
                                // deno-lint-ignore no-case-declarations
                                case 'external-css':
                                    const isCopyToOutput = (this._filesToOutput.includes(entry.name)) ? true : false;

                                    if (isCopyToOutput) {
                                        this._userFiles.push({
                                            type: 'file',
                                            fileName: entry.name,
                                            path: join(_path, entry.name),
                                            relativePath,
                                            dependencyType: 'copy-to-output',
                                            mimeType: MIME.getFileType(entry.name)
                                        })
                                        Logger.Loading(`Founded file at path: ${Colors.bold(Colors.green(`${join('Addon', 'Files', relativePath)}`))}, will be included in project build`);
                                    } else {
                                        this._userFiles.push({
                                            type: 'file',
                                            fileName: entry.name,
                                            path: join(_path, entry.name),
                                            relativePath: getRelativePath(_path, Paths.Files, entry.name),
                                            dependencyType: 'external-css'
                                        })
                                        Logger.Loading(`Founded CSS file at path: ${Colors.bold(Colors.dim(`${join('Addon', 'Files', relativePath)}`))}`);
                                    }
                                    break;
                            }
                        }
                    }
                }

                if (dirStat.isDirectory) {
                    await readDir(Paths.Files);
                }
            }
        } catch (e) {
            // throw new Error('Files folder does not exist!')
        }

        return this._userFiles;
    }

    private async loadUserScripts() {
        try {
            const dirStat = await Deno.stat(Paths.Scripts)

            if (dirStat) {

                const readDir = async (_path: string) => {
                    for await (const entry of Deno.readDir(_path)) {
                        if (entry.isDirectory) {
                            await readDir(join(_path, entry.name))
                        }
                        if (
                            entry.isFile &&
                            (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))
                        ) {
                            const relativePath = getRelativePath(_path, Paths.Scripts, entry.name);
                            const isTypescript = (entry.name.endsWith('.ts')) ? true : false;
                            const path = join(_path, entry.name);

                            let isRuntimeScript: boolean = false;
                            this._runtimeScripts.forEach(scriptPath => {
                                if (path.includes(scriptPath)) {
                                    isRuntimeScript = true;
                                }
                            })

                            this._userScripts.push({
                                type: 'script',
                                fileName: entry.name,
                                path,
                                relativePath: relativePath.replace('.ts', '.js'),
                                dependencyType: (isRuntimeScript) ? 'external-runtime-script' : 'external-dom-script',
                                isTypescript
                                // scriptType: 'module'
                            })

                            if (isTypescript) {
                                Logger.Loading(
                                    `Founded script at path: ${Colors.blue(`${Colors.bold(join('Addon', 'Scripts', relativePath))}`)}`
                                );
                            } else {
                                Logger.Loading(
                                    `Founded script at path: ${Colors.yellow(`${Colors.bold(join('Addon', 'Scripts', relativePath))}`)}`
                                );
                            }

                            if (isRuntimeScript) {
                                Logger.Info('Used as runtime script')
                            }
                        }
                    }
                }

                if (dirStat.isDirectory) {
                    await readDir(Paths.Scripts);
                }
            }
        } catch (e) {
            // throw new Error('Files folder does not exist!')
        }

        return this._userScripts;
    }

    private async loadUserModules() {
        try {
            const dirStat = await Deno.stat(Paths.Modules)

            if (dirStat) {

                const readDir = async (_path: string) => {
                    for await (const entry of Deno.readDir(_path)) {
                        if (entry.isDirectory) {
                            await readDir(join(_path, entry.name))
                        }
                        if (
                            entry.isFile &&
                            (entry.name.endsWith('.ts') || entry.name.endsWith('.js'))
                        ) {
                            const relativePath = getRelativePath(_path, Paths.Modules, entry.name);
                            const isTypescript = (entry.name.endsWith('.ts')) ? true : false;

                            this._userModules.push({
                                type: 'module',
                                fileName: entry.name,
                                path: join(_path, entry.name),
                                relativePath: relativePath.replace('.ts', '.js'),
                                isTypescript
                            })

                            if (isTypescript) {
                                Logger.Loading(
                                    `Founded module at path: ${Colors.blue(`${Colors.bold(join('Addon', 'Modules', relativePath))}`)}`
                                );
                            } else {
                                Logger.Loading(
                                    `Founded module at path: ${Colors.yellow(`${Colors.bold(join('Addon', 'Modules', relativePath))}`)}`
                                );
                            }
                        }
                    }
                }

                if (dirStat.isDirectory) {
                    await readDir(Paths.Modules);
                }
            }
        } catch (e) {
            // throw new Error('Files folder does not exist!')
        }

        return this._userModules;
    }

    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param opts 
     */
    addPluginProperty(id: string, name: string, opts: PropertyOptions): this
    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param description *Optional*. The property description.
     * @param opts Plugin property options.
     */
    addPluginProperty(id: string, name: string, description: string, opts: PropertyOptions): this
    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param descriptionOrOpts The property description **OR** Plugin property options.
     * @param opts Plugin property options.
     */
    addPluginProperty(id: string, name: string, descriptionOrOpts: string | PropertyOptions, opts?: PropertyOptions) {
        if (!this.isPluginPropertyAlreadyExist(id)) {
            let description: string = 'There is no any description yet...';
            let options: PropertyOptions;
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
                this._pluginProperties.push(
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

    /**
     * Creates a new group in the Properties Bar.
     * @description That method using *addPluginProperty* with **Property**.**Group** type in opts object.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the group.
     */
    createGroup(id: string, name: string): this {
        if (!this.isPluginPropertyAlreadyExist(id)) {
            if (
                id.length > 0 &&
                name.length > 0
            ) {
                this.addPluginProperty(id, name, { type: Property.Group });
            }  else if (id.length === 0) {
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
     * Adds files to project bundle
     * @description This is useful for bundling additional resources, such as an image file that needs to be loaded at runtime, or a script that is dynamically loaded.
     * @param fileNames An array of file names *(Not a path to file)*.
     */
    addFilesToOutput(...fileName: string[]): this {
        this._filesToOutput.push(...fileName);
        return this;
    }

    /**
     * Change script dependencyType to: 'external-runtime-script'
     * @description This means the script is always directly available to runtime code. However the dependency must be designed to work in a Web Worker, e.g. not assuming the DOM is present. 
     * The script is not minified on export.
     * @param path Path to script file.
     */
    setRuntimeScripts(...path: string[]): this {
        path.forEach(p => {
            this._runtimeScripts.push(p);
        })
        return this;
    }

    /**
     * Adds a remote URL to load a script from.
     * @param url The script URL, must not use http: in its URL.
     * @description On the modern web this will often be blocked from secure sites as mixed content.
     * You must either use secure HTTPS, or a same-protocol URL.
     */
    addRemoteScripts(...url: string[]): this {
        /**
         * Check to https link
         */
        url.forEach(u => {
            if (u.includes('https')) {
                Logger.Log(`🌐 Added remoted script with url: ${Colors.dim(u)}`)
                this._remoteScripts.push(u);
            } else {
                Logger.Error('build', `Failed to add remote script with url: (${u})`, 'You must either use secure HTTPS, or a same-protocol URL.')
                Deno.exit(1);
            }
        })
        return this;
    }

    /**
     * Checks the plugin property array for existing property with the same Id field.
     * @param id Plugin property Id.
     */
    private isPluginPropertyAlreadyExist(id: string): boolean {
        const isExist = this._pluginProperties.find(p => p._id === id);
        return (isExist) ? true : false;
    }
}
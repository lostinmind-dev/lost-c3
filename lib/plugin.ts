
import type { LostConfig } from "./config.ts";
import type { RemoteScriptType, RuntimeScriptType } from "../shared/types.ts";

import { PluginProperty, Property, type AddonPropertyOptions } from "./entities/plugin-property.ts";
import { Addon } from "./addon.ts";
import { Colors, join, Logger } from "../deps.ts";
import { isDirectoryExists, isFileExists } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";


export class Plugin<
    I extends SDK.IInstanceBase | SDK.IWorldInstanceBase, /** Editor instance OR base instance */
    T extends SDK.ITypeBase
    > extends Addon<'plugin', I, T> {

    constructor(config: LostConfig<'plugin'>) {
        super('plugin', config);
    }

    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param opts 
     */
    addProperty(
        id: string,
        name: string,
        opts: AddonPropertyOptions<'plugin', I, T>
    ): this
    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param description *Optional*. The property description.
     * @param opts Plugin property options.
     */
    addProperty(
        id: string,
        name: string,
        description: string,
        opts: AddonPropertyOptions<'plugin', I, T>
    ): this
    /**
     * Creates plugin property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param descriptionOrOpts The property description **OR** Plugin property options.
     * @param opts Plugin property options.
     */
    addProperty(
        id: string,
        name: string,
        descriptionOrOpts: string | AddonPropertyOptions<'plugin', I, T>,
        opts?: AddonPropertyOptions<'plugin', I, T>
    ) {
        if (!this.#isPluginPropertyExists(id)) {
            let description: string = 'There is no any description yet...';
            let options: AddonPropertyOptions<'plugin', I, T>;
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
                this.pluginProperties.push(
                    new PluginProperty<'plugin', I, T>(id, name, description, options)
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
     * @description That method using *addProperty* with **Property**.**Group** type in opts object.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the group.
     */
    createGroup(id: string, name: string): this {
        if (!this.#isPluginPropertyExists(id)) {
            if (
                id.length > 0 &&
                name.length > 0
            ) {
                //@ts-ignore
                this.addProperty(id, name, { type: Property.Group });
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
     * Changes script dependencyType to: 'external-runtime-script'
     * - - -
     * @description This means the script is always directly available to runtime code. However the dependency must be designed to work in a Web Worker, e.g. not assuming the DOM is present. 
     * The script is not minified on export.
     * @param scripts Runtime script file info.
     */
    setRuntimeScripts(...scripts: RuntimeScriptType[]): this {
        scripts.forEach(async script => {
            switch (script.type) {
                case 'file':
                    if (
                        (!script.path.endsWith('.d.ts') && script.path.endsWith('.ts')) ||
                        script.path.endsWith('.js')
                    ) {
                        if (await isFileExists(join(Paths.ProjectFolders.Scripts, script.path))) {
                            Logger.Info(`Added runtime script file: "${Colors.dim(script.path)}"`)
                            this.runtimeScripts.push(script);
                        } else {
                            Logger.Error(
                                'build', `Failed to add runtime script with path: (${script.path})`, 'File not found'
                            );
                            Deno.exit(1);
                        }
                    } else {
                        Logger.Error(
                            'build', `Failed to add runtime script with path: (${script.path})`, 'You can only use ".js" OR ".ts" files'
                        );
                        Deno.exit(1);
                    }
                    break;
                case 'directory':
                    if (await isDirectoryExists(join(Paths.ProjectFolders.Scripts, script.path))) {
                        Logger.Info(`Added runtime scripts directory: "${Colors.dim(script.path)}"`)
                        this.runtimeScripts.push(script);
                    } else {
                        Logger.Error(
                            'build', `Failed to add runtime scripts directory with path: (${script.path})`, 'Directory not found'
                        );
                        Deno.exit(1);
                    }
                    break;
            }
        })
        return this;
    }

    /**
     * Adds a remote URL to load a script from.
     * - - -
     * @param urls The script URL (or URL's), must not use http: in its URL.
     * @description On the modern web this will often be blocked from secure sites as mixed content.
     * ***You must either use secure HTTPS, or a same-protocol URL.***
     */
    addRemoteScripts(...scripts: RemoteScriptType[]): this {
        /**
         * Check to https link
         */
        scripts.forEach(script => {
            if (script.url.includes('https')) {
                if (script.url.endsWith('.js')) {
                    Logger.Log(`🌐 Added remoted script with url: ${Colors.dim(script.url)}`)
                    this.remoteScripts.push(script);
                } else {
                    Logger.Error('build', `Failed to add remote script with url: (${script.url})`, 'Your url must ends with ".js" script extension.')
                    Deno.exit(1);
                }
            } else {
                Logger.Error('build', `Failed to add remote script with url: (${script.url})`, 'You must either use secure HTTPS, or a same-protocol URL.')
                Deno.exit(1);
            }
        })
        return this;
    }

    /**
     * Checks the plugin property array for existing property with the same Id field.
     * @param id Plugin property Id.
     */
    #isPluginPropertyExists(id: string): boolean {
        const isExist = this.pluginProperties.find(p => p._id === id);
        return (isExist) ? true : false;
    }
}
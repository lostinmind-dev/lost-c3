import type { LostConfig } from "./config.ts";

import { PluginProperty, Property, type AddonPropertyOptions } from "./entities/plugin-property.ts";
import { Addon } from "./addon.ts";
import { Colors, Logger } from "../deps.ts";

export class Behavior extends Addon<'behavior', any, any> {
    constructor(config: LostConfig<'behavior'>) {
        super('behavior', config);
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
        opts: AddonPropertyOptions<'behavior', any>
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
        opts: AddonPropertyOptions<'behavior', any>
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
        descriptionOrOpts: string | AddonPropertyOptions<'behavior', any>,
        opts?: AddonPropertyOptions<'behavior', any>
    ) {
        if (!this.#isPluginPropertyExists(id)) {
            let description: string = 'There is no any description yet...';
            let options: AddonPropertyOptions<'behavior', any>;
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
                    new PluginProperty<'behavior', any>(id, name, description, options)
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
        if (!this.#isPluginPropertyExists(id)) {
            if (
                id.length > 0 &&
                name.length > 0
            ) {
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
     * Change script dependencyType to: 'external-runtime-script'
     * @description This means the script is always directly available to runtime code. However the dependency must be designed to work in a Web Worker, e.g. not assuming the DOM is present. 
     * The script is not minified on export.
     * @param path Path to script file.
     */
    setRuntimeScripts(...paths: string[]): this {
        this.runtimeScripts.push(...paths);
        return this;
    }

    /**
     * Adds a remote URL to load a script from.
     * @param url The script URL, must not use http: in its URL.
     * @description On the modern web this will often be blocked from secure sites as mixed content.
     * You must either use secure HTTPS, or a same-protocol URL.
     */
    addRemoteScripts(...urls: string[]): this {
        /**
         * Check to https link
         */
        urls.forEach(url => {
            if (url.includes('https')) {
                Logger.Log(`🌐 Added remoted script with url: ${Colors.dim(url)}`)
                this.remoteScripts.push(url);
            } else {
                Logger.Error('build', `Failed to add remote script with url: (${url})`, 'You must either use secure HTTPS, or a same-protocol URL.')
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
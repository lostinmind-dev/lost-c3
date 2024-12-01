import type { EffectConfig } from "./config.ts";
import { EffectProperty, type EffectPropertyOptions } from "./entities/effect-property.ts";
import { Addon } from "./addon.ts";
import { Logger } from "../deps.ts";

export class Effect extends Addon<'effect'> {
    readonly _effectProperties: EffectProperty[] = [];

    constructor(config: EffectConfig) {
        super('effect', config);
        this._load();
    }

    private async _load() {

    }

    /**
     * Creates effect property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param opts 
     */
    addProperty(id: string, name: string, opts: EffectPropertyOptions): this
    /**
     * Creates effect property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param description *Optional*. The property description.
     * @param opts Effect property options.
     */
    addProperty(id: string, name: string, description: string, opts: EffectPropertyOptions): this
    /**
     * Creates effect property.
     * @param id A string with a unique identifier for this property.
     * @param name The name of the property.
     * @param descriptionOrOpts The property description **OR** Effect property options.
     * @param opts Effect property options.
     */
    addProperty(id: string, name: string, descriptionOrOpts: string | EffectPropertyOptions, opts?: EffectPropertyOptions) {
        if (!this.isEffectPropertyAlreadyExist(id)) {
            let description: string = 'There is no any description yet...';
            let options: EffectPropertyOptions;
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
                this._effectProperties.push(
                    new EffectProperty(id, name, description, options)
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
     * Checks the plugin property array for existing property with the same Id field.
     * @param id Plugin property Id.
     */
    private isEffectPropertyAlreadyExist(id: string): boolean {
        const isExist = this._effectProperties.find(p => p._id === id);
        return (isExist) ? true : false;
    }

}
import { Property } from "./index.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /**
     * *Optional*. An object picker property allowing the user to pick an object class. 
     * @description At runtime, this passes a SID (Serialization ID) for the chosen object class, or -1 if none was picked. 
     * Use the runtime method GetObjectClassBySID to look up the corresponding ObjectClass.
     * @param allowedPluginIds An array of plugin ID strings to filter the object picker by. This can also contain the special string "<world>" to allow any world-type plugin.
     */
    readonly allowedPluginIds: string[];
}

export var ObjectProperty = class extends Property<'object'> {
    readonly allowedPluginIds?: string[];

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'object',
            opts.id,
            opts.name,
            opts.desc
        );

        this.allowedPluginIds = opts.allowedPluginIds;
    }
}
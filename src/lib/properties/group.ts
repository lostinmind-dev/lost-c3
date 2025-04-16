import { Property } from "./index.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
}

export var GroupProperty = class extends Property<'group'> {
    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'group',
            opts.id,
            opts.name,
            opts.desc
        );
    }
}
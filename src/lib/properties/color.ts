import { Property } from "./index.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** RGBA in range 0-1 for each color*/
    readonly value: [red: number, green: number, blue: number, alpha?: number];
}

export var ColorProperty = class extends Property<'color'> {
    readonly value: [red: number, green: number, blue: number, alpha?: number];

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'color',
            opts.id,
            opts.name,
            opts.desc
        );

        this.value = opts.value || [0, 0, 0];
    }
}
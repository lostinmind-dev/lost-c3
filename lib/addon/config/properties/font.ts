import { Property } from "../property.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly fontName: string;
}

export class Font extends Property<'font'> {
    readonly fontName: string;

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'font',
            opts.id,
            opts.name,
            opts.desc
        );

        this.fontName = opts.fontName || 'Arial';
    }
}
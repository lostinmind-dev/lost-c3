import { Property } from "../property.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly checked: boolean;
}

export class Check extends Property<'check'> {
    readonly checked: boolean;

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'check',
            opts.id,
            opts.name,
            opts.desc
        );

        this.checked = opts.checked || false;
    }
}
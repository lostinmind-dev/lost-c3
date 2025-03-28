import { Property } from "../property.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** 
     * Percent value
     * @example 0.5 -> 50%
     */
    readonly value: number;
}

export class Percent extends Property<'percent'> {
    readonly value: number;

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'percent',
            opts.id,
            opts.name,
            opts.desc
        );

        this.value = opts.value || 0;
    }
}
import { 
    type NumericProperties, 
    Property
} from "../property.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;

    /** An integer OR float number property, always rounded to a whole number. */
    readonly value: number;
    /** *Optional*. Specify a minimum value for a numeric property. */
    readonly min: number;
    /** *Optional*. Specify a maximum value for a numeric property. */
    readonly max: number;
}

export class Numeric<
    Type extends keyof NumericProperties = keyof NumericProperties
> extends Property<Type> {
    readonly value: number;
    readonly min?: number;
    readonly max?: number;

    constructor(
        type: Type,
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            type,
            opts.id,
            opts.name,
            opts.desc
        );

        this.value = opts.value || 0;
        this.min = opts.min;
        this.max = opts.max;
    }
}
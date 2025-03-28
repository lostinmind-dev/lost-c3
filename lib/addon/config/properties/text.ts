import { 
    type TextProperties,
    Property
} from "../property.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly value: string;
}

export class Text<
    Type extends keyof TextProperties = keyof TextProperties
> extends Property<Type> {
    readonly value: string;

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

        this.value = opts.value || '';
    }
}
import { Property } from "../property.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** Creates a read-only string that cannot be edited. */
    callback<EditorInstance>(instance: EditorInstance): string;
}

export class Info extends Property<'info'> {
    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }

        super(
            'info',
            opts.id,
            opts.name,
            opts.desc
        );
    }
}
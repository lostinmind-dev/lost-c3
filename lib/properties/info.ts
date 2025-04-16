import { Property } from "./index.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** Creates a read-only string that cannot be edited. */
    callback<EditorInstance>(instance: EditorInstance): string;
}

export var InfoProperty = class extends Property<'info'> {
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
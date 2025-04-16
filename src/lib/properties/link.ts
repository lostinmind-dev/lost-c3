import { Property } from "./index.ts";

export type Options<T extends keyof CallbackTypes = keyof CallbackTypes> = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly linkText: string;
    readonly callbackType: T;
} & CallbackTypes[T];

type CallbackTypes = {
    /**
     * Specifies how the link callback function is used.
     * @example 'for-each-instance'
     * @description The callback is run once per selected instance in the Layout View.
     * The callback parameter is an instance of your addon (deriving from SDK.IWorldInstanceBase).
     * This is useful for per-instance modifications, such as a link to make all instances their original size. 
     */
    'for-each-instance': {
        callback<EditorInstance = any>(instance: EditorInstance): void;
    };
    /**
     * Specifies how the link callback function is used.
     * @description The callback is run once regardless of how many instances are selected in the Layout View.
     * The callback parameter is your addon's object type (deriving from SDK.ITypeBase).
     * This is useful for per-type modifications, such as a link to edit the object image.
     */
    'once-for-type': {
        callback<SDKType>(type: SDKType): void;
    };
}

export var LinkProperty = class extends Property<'link'> {
    readonly callbackType: keyof CallbackTypes;
    readonly linkText: string;
    readonly callback?: CallbackTypes[keyof CallbackTypes]['callback'];

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name) {
            throw new Error('-');
        }
        
        super(
            'link',
            opts.id,
            opts.name,
            opts.desc
        );
        
        this.callbackType = opts.callbackType || 'for-each-instance';
        this.linkText = opts.linkText || this.name;
        this.callback = opts.callback;
    }
}
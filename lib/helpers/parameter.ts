import { Md5 } from "../deps.ts";
import type { Aces } from "./ace.ts";
import type { UserClass } from "./category.ts";

export type DefaultParameters = {
    cmp: {
        klass: Default;
        opts: DefaultOptions;
    };
    objectname: {
        klass: Default;
        opts: DefaultOptions;
    };
    layer: {
        klass: Default;
        opts: DefaultOptions;
    };
    layout: {
        klass: Default;
        opts: DefaultOptions;
    };
    keyb: {
        klass: Default;
        opts: DefaultOptions;
    };
    instancevar: {
        klass: Default;
        opts: DefaultOptions;
    };
    instancevarbool: {
        klass: Default;
        opts: DefaultOptions;
    };
    eventvar: {
        klass: Default;
        opts: DefaultOptions;
    };
    eventvarbool: {
        klass: Default;
        opts: DefaultOptions;
    };
    animation: {
        klass: Default;
        opts: DefaultOptions;
    };
    objinstancevar: {
        klass: Default;
        opts: DefaultOptions;
    };
}

export type Parameters = {
    number: {
        klass: Number;
        opts: NumberOptions;
    };
    string: {
        klass: String;
        opts: StringOptions;
    };
    any: {
        klass: Any;
        opts: AnyOptions;
    };
    boolean: {
        klass: Boolean;
        opts: BooleanOptions;
    };
    combo: {
        klass: Combo;
        opts: ComboOptions;
    };
    object: {
        klass: _Object;
        opts: ObjectOptions;
    };
} & DefaultParameters;

abstract class Parameter<Type extends keyof Parameters> {
    readonly type: Type;
    readonly index: number;
    private readonly method: Aces[keyof Aces]['method'];

    readonly id: string;
    readonly name: string;
    readonly desc?: string;

    constructor(
        type: Type,
        index: number,
        method: Aces[keyof Aces]['method'],
        id?: string,
        name?: string,
        desc?: string
    ) {
        this.index = index;
        this.method = method;
        this.type = type;
        this.id = id || `${method.name.toLowerCase()}-${index}`
        this.name = name || `[${index}]`;
        this.desc = desc;
    }
}

type DefaultOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
}

class Default<
    T extends keyof DefaultParameters = keyof DefaultParameters
> extends Parameter<T> {
    constructor(
        type: T,
        index: number,
        method: Aces[keyof Aces]['method'],
        opts?: Partial<DefaultOptions>,
    ) {
        super(
            type,
            index,
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        )
    }
}

type NumberOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** *Optional*. A numeric value */
    readonly value: number;
}

class Number extends Parameter<'number'> {
    readonly value: number;

    constructor(
        index: number, 
        method: Aces[keyof Aces]['method'],
        opts?: Partial<NumberOptions>,
    ) {
        super(
            'number', 
            index, 
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        );

        this.value = opts?.value || 0;
    }
}

type AnyOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** *Optional*. Either a number or a string. */
    readonly value: string | number;
}

class Any extends Parameter<'any'> {
    readonly value: string | number;

    constructor(
        index: number, 
        method: Aces[keyof Aces]['method'],
        opts?: Partial<AnyOptions>,
    ) {
        super(
            'any', 
            index, 
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        );

        this.value = opts?.value || 0;
    }
}

type BooleanOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /** *Optional*. A boolean parameter, displayed as a checkbox */
    readonly checked: boolean;
}

class Boolean extends Parameter<'boolean'> {
    readonly value: 'true' | 'false';

    constructor(
        index: number,
        method: Aces[keyof Aces]['method'],
        opts?: Partial<BooleanOptions>,
    ) {
        super(
            'boolean',
            index,
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        );

        if (opts && opts.checked) {
            if (opts.checked === true) {
                this.value = 'true';
            } else {
                this.value = 'false';
            }
        } else {
            this.value = 'false';
        }
    }
}

type ComboOptions<Items extends Record<string, string> = Record<string, string>> = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /**
     * Must be used to specify the available items.
     * @example { id: 'Item 1', id2: 'Item 2' }
     */
    readonly items: Items;
    /**
     * *Optional*. A dropdown list. Items must be specified with the "items" property.
     */
    readonly initialValue: keyof Items;
}

class Combo extends Parameter<'combo'> {
    readonly items: Record<string, string>;
    readonly initialValue: keyof this['items'];

    allItemIds() {
        return Object.keys(this.items);
    }

    constructor(
        index: number,
        method: Aces[keyof Aces]['method'],
        opts?: Partial<ComboOptions>,
    ) {
        if (!opts?.items) {
            throw new Error(`Can't create combo parameter without any item`);
        }
        super(
            'combo',
            index,
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        );

        this.items = opts.items;

        if (opts.initialValue) {
            if (this.allItemIds().includes(opts.initialValue)) {
                this.initialValue = opts.initialValue;
            } else {
                this.initialValue = this.items[0]; 
            }
        } else {
            this.initialValue = this.items[0];
        }
    }
}

type ObjectOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /**
     * *Optional*. An array of plugin IDs allowed to be shown by the object picker.
     * @description For example, use ["Sprite"] to only allow the object parameter to select a Sprite.
     * @example ["Sprite"]
     */
    readonly allowedPluginIds: string[];
}

class _Object extends Parameter<'object'> {
    readonly allowedPluginIds?: string[];

    constructor(
        index: number,
        method: Aces[keyof Aces]['method'],
        opts?: Partial<ObjectOptions>,
    ) {
        super(
            'object',
            index,
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        );

        this.allowedPluginIds = opts?.allowedPluginIds;
    }
}

type StringOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /**
     * *Optional*. 
     * A string parameter.
     */
    readonly value: string;
    /**
     * *Optional*. 
     * Set to a globally unique ID and string constants with the same ID will offer autocomplete in the editor.
     */
    readonly autocompleteId: string;
}

class String extends Parameter<'string'> {
    readonly value: string;
    readonly autocompleteId?: string;

    constructor(
        index: number, 
        method: Aces[keyof Aces]['method'],
        opts?: Partial<StringOptions>,
    ) {
        super(
            'string', 
            index, 
            method,
            opts?.id,
            opts?.name,
            opts?.desc
        );

        this.value = opts?.value || '""';

        if (opts?.autocompleteId) {
            const hash = Md5.hashStr(opts.autocompleteId);
            this.autocompleteId = hash;
        }
    }
}

/**
 * Helper
 */

type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
}

export function parameter<Type extends keyof Parameters>(
    type: Type,
    opts?: Partial<Options & Parameters[Type]['opts']>
) {
    return function (
        method: Aces[keyof Aces]['method'],
        context: ClassMethodDecoratorContext<any>
    ) {
        context.addInitializer(function (this: UserClass) {
            if (!this._$parameters$_) this._$parameters$_ = new Map();

            let parameters = this._$parameters$_.get(method.name);

            if (!parameters) {
                this._$parameters$_.set(method.name, []);
                parameters = this._$parameters$_.get(method.name)!;
            }

            const index = parameters.length - 1;

            if (type === 'number') {
                parameters.push(
                    //@ts-ignore opts type
                    new Number(index, method, opts)
                );
            } else if (type === 'string') {
                parameters.push(
                    //@ts-ignore opts type
                    new String(index, method, opts)
                );
            } else if (type === 'any') {
                parameters.push(
                    //@ts-ignore opts type
                    new Any(index, method, opts)
                );
            } else if (type === 'boolean') {
                parameters.push(
                    //@ts-ignore opts type
                    new Boolean(index, method, opts)
                );
            } else if (type === 'combo') {
                parameters.push(
                    //@ts-ignore opts type
                    new Combo(index, method, opts)
                );
            } else if (type === 'object') {
                parameters.push(
                    //@ts-ignore opts type
                    new _Object(index, method, opts)
                );
            } else {
                parameters.push(
                    //@ts-ignore opts type
                    new Default(type, index, method, opts)
                );
            }
        })
    }
}
import { Property } from "./index.ts";

export type Options = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    readonly items: Record<string, string>;
    /**
     * A dropdown list property.
     * @description The property is set to the zero-based index of the chosen item.
     * The Items field of the options object must be used to specify the available items.
     */
    readonly initialValue: string;
}

export var ComboProperty = class extends Property<'combo'> {
    readonly items: Record<string, string>;
    readonly initialValue: keyof this['items'];

    allItemIds() {
        return Object.keys(this.items);
    }

    constructor(
        opts?: Partial<Options>
    ) {
        if (!opts?.id || !opts?.name || !opts?.items) {
            throw new Error(`Can't create combo parameter without any item`);
        }

        super(
            'combo',
            opts.id,
            opts.name,
            opts.desc
        );

        this.items = opts.items;

        if (typeof opts.initialValue !== 'undefined') {
            if (this.allItemIds().includes(opts.initialValue)) {
                this.initialValue = opts.initialValue;
            } else {
                this.initialValue = this.allItemIds()[0];
            }
        } else {
            this.initialValue = this.allItemIds()[0];
        }
    }
}
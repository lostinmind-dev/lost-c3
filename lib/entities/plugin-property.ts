export enum Property {
    /** Parameter dewsc */
    Integer = 'integer',
    Float = 'float',
    Percent = 'percent',
    Text = 'text',
    LongText = 'longtext',
    Checkbox = 'check',
    Font = 'font',
    Combo = 'combo',
    Color = 'color',
    Object = 'object',
    Group = 'group',
    Info = 'info',
    Link = 'link',
    // ProjectFile = 'projectfile'
}

export class PluginProperty<
    A = any,
    P = any,
    I = any,
    T = any
> {

    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly opts: AddonPropertyOptions<A, P, I, T>
    ) {

        if (
            opts.type === Property.Link
        ) {
            if (!opts.linkText) {
                opts.linkText = name;
            }
        }

        if (opts.type === Property.Color) {
            if (opts.initialValue) {
                opts.initialValue = this.#normalizeRgb(opts.initialValue);
            }
        }
    }

    #normalizeRgb(rgb: [number, number, number]): [number, number, number] {
        if (
            rgb.length !== 3 ||
            rgb.some(c => typeof c !== "number" || c < 0 || c > 255)
        ) {
            return [0, 0, 0];
        }
        return [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255];
    }
}

export type AddonPropertyOptions<
    A = any,
    P = any,
    I = any,
    T = any
> =
    A extends 'plugin' ? PluginPropertyOptions<P, I, T> :
    A extends 'behavior' ? BehaviorPropertyOptions : never
    ;


export type PluginPropertyOptions<P, I, T> =
    P extends 'object' ? ObjectPluginPropertyOptions<I, T> :
    P extends 'world' ? WorldPluginPropertyOptions<I, T> : never
    ;

export type BehaviorPropertyOptions =
    | IntegerPropertyOptions
    | FloatPropertyOptions
    | PercentPropertyOptions
    | TextPropertyOptions
    | LongTextPropertyOptions
    | CheckPropertyOptions
    | FontPropertyOptions
    | ComboPropertyOptions
    | ColorPropertyOptions
    | ObjectPropertyOptions
    | GroupPropertyOptions
    ;

type ObjectPluginPropertyOptions<I, T> =
    | IntegerPropertyOptions
    | FloatPropertyOptions
    | PercentPropertyOptions
    | TextPropertyOptions
    | LongTextPropertyOptions
    | CheckPropertyOptions
    | FontPropertyOptions
    | ComboPropertyOptions
    | ColorPropertyOptions
    | ObjectPropertyOptions
    | GroupPropertyOptions
    | InfoPropertyOptions<I>
    | LinkPropertyOnceForTypeOptions<T>
    ;

type WorldPluginPropertyOptions<I, T> =
    | IntegerPropertyOptions
    | FloatPropertyOptions
    | PercentPropertyOptions
    | TextPropertyOptions
    | LongTextPropertyOptions
    | CheckPropertyOptions
    | FontPropertyOptions
    | ComboPropertyOptions
    | ColorPropertyOptions
    | ObjectPropertyOptions
    | GroupPropertyOptions
    | InfoPropertyOptions<I>
    | LinkPropertyForEachInstance<I>
    | LinkPropertyOnceForTypeOptions<T>
    ;

type IntegerPropertyOptions = {
    readonly type: Property.Integer;
    /**
     * *Optional*. An integer number property, always rounded to a whole number.
     */
    initialValue?: number;
    /**
     * *Optional*. Specify a minimum value for a numeric property.
     */
    readonly min?: number;
    /**
     * *Optional*. Specify a maximum value for a numeric property.
     */
    readonly max?: number;
}

/** Object represents 'float' plugin property */
type FloatPropertyOptions = {
    readonly type: Property.Float;
    /**
     * *Optional*. A floating-point number property.
     */
    initialValue?: number;
    /**
     * *Optional*. Specify a minimum value for a numeric property.
     */
    readonly min?: number;
    /**
     * *Optional*. Specify a maximum value for a numeric property.
     */
    readonly max?: number;
}

/** Object represents 'percent' plugin property */
type PercentPropertyOptions = {
    readonly type: Property.Percent;
    /**
     * *Optional*. A floating-point number in the range **[0-1]** represented as a percentage.
     * @description For example if the user enters 50%, the property will be set to a value of 0.5.
     */
    initialValue?: number;
}

/** Object represents 'text' plugin property */
type TextPropertyOptions = {
    readonly type: Property.Text;
    /**
     * *Optional*. A field the user can enter a string in to.
     */
    initialValue?: string;
}

/** Object represents 'longtext' plugin property */
type LongTextPropertyOptions = {
    readonly type: Property.LongText;
    /**
     * *Optional*. The same as "text", but a button with an ellipsis ("...") appears on the right side of the field.
     * @description The user can click this button to open a dialog to edit a long string more conveniently.
     * This is useful for potentially long content like the project description, or the main text of the Text object.
     */
    initialValue?: string;
}

/** Object represents 'check' plugin property */
type CheckPropertyOptions = {
    readonly type: Property.Checkbox;
    /**
     * *Optional*. A checkbox property.
     */
    initialValue?: boolean;
}

/** Object represents 'font' plugin property */
type FontPropertyOptions = {
    readonly type: Property.Font;
    /**
     * A field which displays the name of a font and provides a button to open a font picker dialog.
     * @description The property is set to a string of the name of the font.
     */
    initialValue?: string;
}

/** Object represents 'combo' plugin property */
type ComboPropertyOptions = {
    readonly type: Property.Combo;
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    readonly items: [string, string][];
    /**
     * A dropdown list property.
     * @description The property is set to the zero-based index of the chosen item.
     * The Items field of the options object must be used to specify the available items.
     */
    initialValue?: string;
}

/** Object represents 'color' plugin property */
type ColorPropertyOptions = {
    readonly type: Property.Color;
    /**
     * *Optional*. A color picker property.
     * Must be an RGB array of numbers.
     * @example [255, 255, 255]
     */
    initialValue?: [number, number, number];
}

/** Object represents 'object' plugin property */
type ObjectPropertyOptions = {
    readonly type: Property.Object;
    /**
     * *Optional*. An object picker property allowing the user to pick an object class. 
     * @description At runtime, this passes a SID (Serialization ID) for the chosen object class, or -1 if none was picked. 
     * Use the runtime method GetObjectClassBySID to look up the corresponding ObjectClass.
     * @param allowedPluginIds An array of plugin ID strings to filter the object picker by. This can also contain the special string "<world>" to allow any world-type plugin.
     */
    readonly allowedPluginIds?: string[];
}

/** Object represents 'group' plugin property */
type GroupPropertyOptions = {
    /**
     * Creates a new group in the Properties Bar.
     */
    readonly type: Property.Group;
}

/** Object represents 'info' plugin property */
type InfoPropertyOptions<I> = {
    readonly type: Property.Info;
    /**
     * Creates a read-only string that cannot be edited.
     */
    readonly callback: (inst: I) => string;
}

/** Object represents 'link' plugin property with 'for-each-instance' callback type */
type LinkPropertyForEachInstance<I> = {
    readonly type: Property.Link;
    /**
     * Specifies how the link callback function is used.
     * @example 'for-each-instance'
     * @description The callback is run once per selected instance in the Layout View.
     * The callback parameter is an instance of your addon (deriving from SDK.IWorldInstanceBase).
     * This is useful for per-instance modifications, such as a link to make all instances their original size. 
     */
    readonly callbackType: 'for-each-instance';
    readonly callback: (inst: I) => void;
    /**  *Optional*. Sets the text of the clickable link. */
    linkText?: string;
}

/** Object represents 'link' plugin property with 'once-for-type' callback type */
type LinkPropertyOnceForTypeOptions<T> = {
    readonly type: Property.Link;
    /**
     * Specifies how the link callback function is used.
     * @description The callback is run once regardless of how many instances are selected in the Layout View.
     * The callback parameter is your addon's object type (deriving from SDK.ITypeBase).
     * This is useful for per-type modifications, such as a link to edit the object image.
     */
    readonly callbackType: 'once-for-type';
    readonly callback: (type: T) => void;
    /**  *Optional*. Sets the text of the clickable link. */
    linkText?: string;
}
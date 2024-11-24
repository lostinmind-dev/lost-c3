/** Object that represents all types of plugin property. */
export enum Property {
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
    Link = 'link'
}

/**
 * @class Represents plugin property info.
 */
export class PluginProperty {
    readonly _id: string;
    readonly _name: string;
    readonly _description: string;
    readonly _opts: PropertyOptions;
    readonly _funcString?: string;
    
    constructor(id: string, name: string, description: string, opts: PropertyOptions) {
        this._id = id;
        this._name = name;
        this._description = description;

        if (opts.type === Property.Link) {
            this._funcString = opts.callback.toString();
        }

        if (opts.type === Property.Color) {
            if (opts.initialValue) {
                opts.initialValue = this.normalizeRGB(opts.initialValue);
            }
        }

        this._opts = opts;
    }
    
    private normalizeRGB(colors: [number, number, number]): [number, number, number] {
        if (
            colors.length !== 3 || 
            colors.some(c => typeof c !== "number" || c < 0 || c > 255)
        ) {
            return [0, 0, 0];
        }
        return [colors[0] / 255, colors[1] / 255, colors[2] / 255];
    }

    protected deserializeFunction(funcString: string): Function | null {
        try {
            const cleanedFuncString = funcString.trim();
    
            const arrowFunctionMatch = cleanedFuncString.match(/^\((.*)\)\s*=>\s*\{([\s\S]*)\}$/);
            const regularFunctionMatch = cleanedFuncString.match(/^function\s*\((.*)\)\s*\{([\s\S]*)\}$/);
    
            if (arrowFunctionMatch) {
                const args = arrowFunctionMatch[1].trim();
                const body = arrowFunctionMatch[2].trim();
                return new Function(args, body);
            }
    
            if (regularFunctionMatch) {
                const args = regularFunctionMatch[1].trim();
                const body = regularFunctionMatch[2].trim();
                return new Function(args, body);
            }

            return null;
        } catch (error) {
            console.error("Failed to deserialize function:", error);
            return null;
        }
    }

}

/** All available plugin property options  */
export type PropertyOptions = 
    IntegerProperty |
    FloatProperty |
    PercentProperty |
    TextProperty |
    LongTextProperty |
    CheckProperty |
    FontProperty |
    ComboProperty |
    ColorProperty |
    ObjectProperty |
    GroupProperty |
    InfoProperty |
    LinkProperty
;

/** Base properties for any plugin property. */
type PropertyOptionsBase = {
    /**
     * Type of plugin property.
     */
    type: Property;
}

/** Object represents 'integer' plugin property */
interface IntegerProperty extends PropertyOptionsBase {
    type: Property.Integer;
    /**
     * *Optional*. An integer number property, always rounded to a whole number.
     */
    initialValue?: number;
    /**
     * *Optional*. Specify a minimum value for a numeric property.
     */
    min?: number;
    /**
     * *Optional*. Specify a maximum value for a numeric property.
     */
    max?: number;
}

/** Object represents 'float' plugin property */
interface FloatProperty extends PropertyOptionsBase {
    type: Property.Float;
    /**
     * *Optional*. A floating-point number property.
     */
    initialValue?: number;
    /**
     * *Optional*. Specify a minimum value for a numeric property.
     */
    min?: number;
    /**
     * *Optional*. Specify a maximum value for a numeric property.
     */
    max?: number;
}

/** Object represents 'percent' plugin property */
interface PercentProperty extends PropertyOptionsBase {
    type: Property.Percent;
    /**
     * *Optional*. A floating-point number in the range **[0-1]** represented as a percentage.
     * @description For example if the user enters 50%, the property will be set to a value of 0.5.
     */
    initialValue?: number;
}

/** Object represents 'text' plugin property */
interface TextProperty extends PropertyOptionsBase {
    type: Property.Text;
    /**
     * *Optional*. A field the user can enter a string in to.
     */
    initialValue?: string;
}

/** Object represents 'longtext' plugin property */
interface LongTextProperty extends PropertyOptionsBase {
    type: Property.LongText;
    /**
     * *Optional*. The same as "text", but a button with an ellipsis ("...") appears on the right side of the field.
     * @description The user can click this button to open a dialog to edit a long string more conveniently.
     * This is useful for potentially long content like the project description, or the main text of the Text object.
     */
    initialValue?: string;
}

/** Object represents 'check' plugin property */
interface CheckProperty extends PropertyOptionsBase {
    type: Property.Checkbox;
    /**
     * *Optional*. A checkbox property.
     */
    initialValue?: boolean;
}

/** Object represents 'font' plugin property */
interface FontProperty extends PropertyOptionsBase {
    type: Property.Font;
    /**
     * A field which displays the name of a font and provides a button to open a font picker dialog.
     * @description The property is set to a string of the name of the font.
     */
    initialValue?: string;
}

/** Object represents 'combo' plugin property */
interface ComboProperty extends PropertyOptionsBase {
    type: Property.Combo;
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    items: [string, string][];
    /**
     * A dropdown list property.
     * @description The property is set to the zero-based index of the chosen item.
     * The Items field of the options object must be used to specify the available items.
     */
    initialValue?: string;
}

/** Object represents 'color' plugin property */
interface ColorProperty extends PropertyOptionsBase {
    type: Property.Color;
    /**
     * *Optional*. A color picker property.
     * Must be an RGB array of numbers.
     * @example [255, 255, 255]
     */
    initialValue?: [number, number, number];
}

/** Object represents 'object' plugin property */
interface ObjectProperty extends PropertyOptionsBase {
    type: Property.Object;
    /**
     * *Optional*. An object picker property allowing the user to pick an object class. 
     * @description At runtime, this passes a SID (Serialization ID) for the chosen object class, or -1 if none was picked. 
     * Use the runtime method GetObjectClassBySID to look up the corresponding ObjectClass.
     * @param allowedPluginIds An array of plugin ID strings to filter the object picker by. This can also contain the special string "<world>" to allow any world-type plugin.
     */
    allowedPluginIds?: string[];
}

/** Object represents 'group' plugin property */
interface GroupProperty extends PropertyOptionsBase {
    /**
     * Creates a new group in the Properties Bar.
     */
    type: Property.Group;
}

/** Object represents 'info' plugin property */
interface InfoProperty extends PropertyOptionsBase {
    type: Property.Info;
    /**
     * Creates a read-only string that cannot be edited.
     */
    info: string;
}

/** Object represents 'link' plugin property */
type LinkProperty = LinkPropertyForEachInstance | LinkPropertyOnceForType

/** Object represents 'link' plugin property with 'for-each-instance' callback type */
interface LinkPropertyForEachInstance extends PropertyOptionsBase {
    type: Property.Link;
    /**
     * Specifies how the link callback function is used.
     * @example 'for-each-instance'
     * @description The callback is run once per selected instance in the Layout View.
     * The callback parameter is an instance of your addon (deriving from SDK.IWorldInstanceBase).
     * This is useful for per-instance modifications, such as a link to make all instances their original size. 
     */
    callbackType: 'for-each-instance';
    callback: (inst: SDK.IWorldInstanceBase) => void;
}

/** Object represents 'link' plugin property with 'once-for-type' callback type */
interface LinkPropertyOnceForType extends PropertyOptionsBase {
    type: Property.Link;
    /**
     * Specifies how the link callback function is used.
     * @description The callback is run once regardless of how many instances are selected in the Layout View.
     * The callback parameter is your addon's object type (deriving from SDK.ITypeBase).
     * This is useful for per-type modifications, such as a link to edit the object image.
     */
    callbackType: 'once-for-type';
    callback: (type: SDK.ITypeBase) => void;
}
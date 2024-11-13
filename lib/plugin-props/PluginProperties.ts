type PluginPropertyType = 'integer' | 'float' | 'percent' | 'text' | 'longtext' | 'check' | 'font' | 'combo' | 'color' | 'object' | 'group' | 'info' | 'link';

interface PluginPropertyOptionsBase {
    /**
     * Type of the property
     */
    Type: PluginPropertyType;
    /**
     * A string with a unique identifier for this property.
     * This is used to refer to the parameter in the language file.
     */
    Id: string;
    /**
     * The name of the property
     */
    Name: string;
    /**
     * Optional. The property description
     */
    Description?: string;    
}

interface IntegerPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * An integer number property, always rounded to a whole number.
     */
    Type: 'integer';
    /**
     * Optional. Specify a minimum value for a numeric property.
     */
    Min?: number;
    /**
     * Optional. Specify a maximum value for a numeric property.
     */
    Max?: number;
    /**
     * @example 117
     */
    InitialValue: number; 
}

interface FloatPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A floating-point number property.
     */
    Type: 'float';
    /**
     * Optional. Specify a minimum value for a numeric property.
     */
    Min?: number;
    /**
     * Optional. Specify a maximum value for a numeric property.
     */
    Max?: number;
    /**
     * @example 1.785
     */
    InitialValue: number; 
}

interface PercentPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A floating-point number in the range [0-1] represented as a percentage.
     * @description For example if the user enters 50%, the property will be set to a value of 0.5.
     */
    Type: 'percent';
    /**
     * @example 0.5
     */
    InitialValue: number; 
}

interface TextPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A field the user can enter a string in to.
     */
    Type: 'text';
    /**
     * @example "Lost"
     */
    InitialValue: string; 
}

interface LongTextPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * The same as "text", but a button with an ellipsis ("...") appears on the right side of the field.
     * @description The user can click this button to open a dialog to edit a long string more conveniently.
     * This is useful for potentially long content like the project description, or the main text of the Text object.
     */
    Type: 'longtext';
    /**
     * @example "Some long text that shows with a button with ellipsis ("...")"
     */
    InitialValue: string; 
}

interface CheckPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A checkbox property, returning a boolean.
     */
    Type: 'check';
    /**
     * @example true
     */
    InitialValue: boolean; 
}

interface FontPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A field which displays the name of a font and provides a button to open a font picker dialog.
     * @description The property is set to a string of the name of the font.
     */
    Type: 'font';
    /**
     * Optional.
     * @example "Arial"
     */
    InitialValue?: string; 
}

interface ComboPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A dropdown list property.
     * @description The property is set to the zero-based index of the chosen item.
     * The Items field of the options object must be used to specify the available items.
     */
    Type: 'combo';
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    Items: [string, string][];
    /**
     * Optional. Set to the zero-based index of the chosen item. 
     * @description If not specified, Lost automatically set the zero-base index of available items.
     * @example "item_one"
     */
    InitialValue?: string; 
}

interface ColorPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * A color picker property.
     */
    Type: 'color',
    /**
     * Optional. Must be an array of numbers.
     * @example [1, 0, 0] -> Red
     */
    InitialValue?: [number, number, number];
}

interface ObjectPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * An object picker property allowing the user to pick an object class. 
     * @description At runtime, this passes a SID (Serialization ID) for the chosen object class, or -1 if none was picked. 
     * Use the runtime method GetObjectClassBySID to look up the corresponding ObjectClass.
     */
    Type: 'object',
    /**
     * Optional. An array of plugin ID strings to filter the object picker by. 
     * @description This can also contain the special string "<world>" to allow any world-type plugin.
     * @example "<world>"
     */
    AllowedPluginIds?: string[];
}

interface GroupPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * Creates a new group in the Properties Bar.
     * @example "My Group"
     */
    Type: 'group';
}

interface InfoPropertyOptions extends PluginPropertyOptionsBase {
    /**
     * Creates a read-only string that cannot be edited.
     */
    Type: 'info',
    /**
     * @example "Name"
     */
    Value: string;
}

interface LinkPropertyOptions<T> extends PluginPropertyOptionsBase {
    /**
     * **For plugins only** — creates a clickable link in the Properties Bar.
     * @description There is no value associated with this property. A linkCallback function must be specified in the options object.
     */
    Type: 'link',
    /**
     * Specifies how the link callback function is used.
     * @description This can be one of the following:
     *
     * @example 'for-each-instance'
     * @description the callback is run once per selected instance in the Layout View.
     * The callback parameter is an instance of your addon (deriving from SDK.IWorldInstanceBase).
     * This is useful for per-instance modifications, such as a link to make all instances their original size. 
     * 
     * @example 'once-for-type'
     * @description the callback is run once regardless of how many instances are selected in the Layout View.
     * The callback parameter is your addon's object type (deriving from SDK.ITypeBase).
     * This is useful for per-type modifications, such as a link to edit the object image.
     */
    CallbackType: 'for-each-instance' | 'once-for-type';
    /**
     * A function that is called when the link is clicked.
     * @description The number of calls, and the type of the parameter, are determined by the callbackType option.
     */
    Callback: (p: T) => void;
}

type PluginPropertyOptions<T> = 
    IntegerPropertyOptions | FloatPropertyOptions | PercentPropertyOptions |
    TextPropertyOptions | LongTextPropertyOptions | CheckPropertyOptions |
    FontPropertyOptions | ComboPropertyOptions | ColorPropertyOptions |
    ObjectPropertyOptions | GroupPropertyOptions | InfoPropertyOptions |
    LinkPropertyOptions<T>;

export class Property<T> {
    readonly Options: PluginPropertyOptions<T>;
    constructor(Options: PluginPropertyOptions<T>) {

        if (!Options.Description) Options.Description = 'There is no any description yet...';

        switch (Options.Type) {
            // deno-lint-ignore no-case-declarations
            case 'combo':
                const itemsIds = Options.Items.map(e => e[0]);
                if (!Options.InitialValue) {
                    /* Set the first item of all as initial value */
                    Options.InitialValue = itemsIds[0];
                } 
                if (Options.InitialValue && !(itemsIds.indexOf(Options.InitialValue) !== -1)) {
                    /* If provided Id doesn't exist, set the first item of all as initial value. */
                    Options.InitialValue = itemsIds[0];
                };
                break;
            case 'color':
                if (!Options.InitialValue) Options.InitialValue = [0, 0, 0];
                break;
            case 'object':
                if (!Options.AllowedPluginIds) Options.AllowedPluginIds = ["<world>"];
                break;
            case 'font':
                if (!Options.InitialValue) Options.InitialValue = '';
                break;
            default:
                break;
        }

        this.Options = Options;
    }
}
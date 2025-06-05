export type Property =
    | IIntegerProperty
    | IFloatProperty
    | IPercentProperty
    | ITextProperty
    | ILongTextProperty
    | IFontProperty
    | ICheckboxProperty
    | IComboProperty
    | IColorProperty
    | IObjectProperty
    | IInfoProperty
    | ILinkPropertyForEachInstance
    | ILinkPropertyOnceForType
;

interface INumericProperty {
    readonly value?: number;
    readonly min?: number;
    readonly max?: number;
}

interface IIntegerProperty extends INumericProperty {
    readonly type: 'integer';
}

interface IFloatProperty extends INumericProperty {
    readonly type: 'float';
}

interface IPercentProperty extends INumericProperty {
    readonly type: 'percent';
    /**
     * *Optional* Value in percents
     * @default 50 (%)
     */
    readonly value?: number;
}

interface IStringProperty {
    readonly value?: string;
}

interface ITextProperty extends IStringProperty {
    readonly type: 'text';
}

interface ILongTextProperty extends IStringProperty {
    readonly type: 'longtext';
}

interface IFontProperty extends IStringProperty {
    readonly type: 'font';
    /**
     * *Optional* Font name
     * @default 'Arial'
     */
    readonly value?: string;
}

interface ICheckboxProperty {
    readonly type: 'check';
    /**
     * Initial value of check box
     * @default false
     */
    readonly checked?: boolean;
}

interface IComboProperty<
    Items extends Record<string, string> = Record<string, string>
> {
    readonly type: 'combo';
    /**
     * Must be used to specify the available items.
     * @example {
     *  item_1: 'Item 1',
     *  item_2: 'Item 2'
     * }
     * 
     */
    readonly items: Items;
    /**
     * *Optional* If not provided, will be used the first id from *items* field
     */
    readonly value?: keyof Items;
}


type RgbColor = [red: number, green: number, blue: number, alpha?: number];
type HexColor = `#${string | number}`

interface IColorProperty {
    readonly type: 'color';
    readonly value?: HexColor | RgbColor;
}

interface IObjectProperty {
    readonly type: 'object';
    /**
     * *Optional*
     * An array of plugin ID strings to filter the object picker by. This can also contain the special string "<world>" to allow any world-type plugin.
     */
    readonly allowedPluginIds?: string[];
}

/** Object represents 'info' plugin property */
interface IInfoProperty<SDKInst = any> {
    readonly type: 'info';
    /**
     * Creates a read-only string that cannot be edited.
     */
    callback: (inst: SDKInst) => string;
}

/** Object represents 'link' plugin property with 'for-each-instance' callback type */
interface ILinkPropertyForEachInstance<SDKInst = any> {
    readonly type: 'link';
    /**
     * Specifies how the link callback function is used.
     * @example 'for-each-instance'
     * @description The callback is run once per selected instance in the Layout View.
     * The callback parameter is an instance of your addon (deriving from SDK.IWorldInstanceBase).
     * This is useful for per-instance modifications, such as a link to make all instances their original size. 
     */
    readonly callbackType: 'for-each-instance';
    readonly callback: (inst: SDKInst) => void;
    /**  *Optional*. Sets the text of the clickable link. */
    readonly linkText?: string;
}

/** Object represents 'link' plugin property with 'once-for-type' callback type */
interface ILinkPropertyOnceForType<SDKType = any> {
    readonly type: 'link';
    /**
     * Specifies how the link callback function is used.
     * @description The callback is run once regardless of how many instances are selected in the Layout View.
     * The callback parameter is your addon's object type (deriving from SDK.ITypeBase).
     * This is useful for per-type modifications, such as a link to edit the object image.
     */
    readonly callbackType: 'once-for-type';
    readonly callback: (type: SDKType) => void;
    /**  *Optional*. Sets the text of the clickable link. */
    readonly linkText?: string;
}
export type ParamType = 
    'number' | 'string' | 'any' | 'boolean' | 
    'combo' | 'cmp' | 'object' | 'objectname' | 
    'layer' | 'layout' | 'keyb' | 'instancevar' | 
    'instancevarbool' | 'eventvar' | 'eventvarbool' | 'animation' |
    'objinstancevar';

interface ParamOptionsBase {
    /**
     * Type of the parameter.
     */
    Type: ParamType;
    /**
     * A string with a unique identifier for this parameter.
     * @description This is used to refer to the parameter in the language file.
     */
    Id: string;
    /**
     * The name of the parameter.
     */
    Name: string;
    /**
     * The parameter description.
     */
    Description?: string;
    /**
     * A string which is used as the initial expression for expression-based parameters. 
     * @description This is still a string for "NumberParam" type parameters. 
     * It can contain any valid expression for the parameter, such as "1 + 1".
     * For "boolean" parameters, use a string of either "true" or "false".
     * For "ComboParam" parameters, this is the initial item ID.
     */
    InitialValue?: string;
}

interface NumberParamOptions extends ParamOptionsBase {
    /**
     * A number parameter
     */
    Type: 'number';
}

interface StringParamOptions extends ParamOptionsBase {
    /**
     * A string parameter
     */
    Type: 'string';
    /**
     * Optional. Set to a globally unique ID and string constants with the same ID will offer autocomplete in the editor.
     * @description This is useful for "tag" parameters. 
     * Note the Id must be unique to all other plugins and behaviors in Construct, so it is a good idea to include your plugin or behavior name in the string, e.g. "myplugin-tag".
     * @example "myplugin-tag-param"
     */
    AutocompleteId?: boolean;    
}

interface AnyParamOptions extends ParamOptionsBase {
    /**
     * Either a number or a string
     */
    Type: 'any';
}

interface BooleanParamOptions extends ParamOptionsBase {
    /**
     * A boolean parameter, displayed as a checkbox
     */
    Type: 'boolean';
    /**
     * Optional. Default is **false**. Use a string of either "true" or "false".
     * @example "true"
     */
    InitialValue?: 'true' | 'false';
}

interface ComboParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list.
     * @description Items must be specified with the "Items" property.
     */
    Type: 'combo';
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    Items: [string, string][];
}

interface CmpParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with comparison options like "equal to", "less than" etc.
     */
    Type: 'cmp';
}

interface ObjectParamOptions extends ParamOptionsBase {
    /**
     * An object picker.
     * @description The types of plugin to show can be filtered using an optional "AllowedPluginIds" property.
     */
    Type: 'object';
    /**
     * Optional. An array of plugin IDs allowed to be shown by the object picker.
     * @description For example, use ["Sprite"] to only allow the object parameter to select a Sprite.
     * @example ["Sprite"]
     */
    AllowedPluginIds?: string[];
}

interface ObjectNameParamOptions extends ParamOptionsBase {
    /**
     * A string parameter which is interpreted as an object name
     */
    Type: 'objectname';
}

interface LayerParamOptions extends ParamOptionsBase {
    /**
     * A string parameter which is interpreted as a layer name
     */
    Type: 'layer';
}

interface LayoutParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with every layout in the project
     */
    Type: 'layout';
}

interface KeybParamOptions extends ParamOptionsBase {
    /**
     * A keyboard key picker
     */
    Type: 'keyb';
}

interface InstanceVarParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with the non-boolean instance variables the object has
     */
    Type: 'instancevar';
}

interface InstanceVarBoolParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with the boolean instance variables the object has
     */
    Type: 'instancevarbool';
}

interface EventVarParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with non-boolean event variables in scope
     */
    Type: 'eventvar';
}

interface EventVarBoolParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with boolean event variables in scope
     */
    Type: 'eventvarbool';
}

interface AnimationParamOptions extends ParamOptionsBase {
    /**
     * A string parameter which is interpreted as an animation name in the object
     */
    Type: 'animation';
}

interface ObjInstanceVarParamOptions extends ParamOptionsBase {
    /**
     * A dropdown list with non-boolean instance variables available in a prior "object" parameter.
     * @requires An "object" type parameter.
     */
    Type: 'objinstancevar'
}

export type ParamOptions = 
    NumberParamOptions | StringParamOptions | AnyParamOptions | 
    BooleanParamOptions | ComboParamOptions | CmpParamOptions |
    ObjectParamOptions | ObjectNameParamOptions | LayerParamOptions |
    LayoutParamOptions | KeybParamOptions | InstanceVarParamOptions |
    InstanceVarBoolParamOptions | EventVarParamOptions | EventVarBoolParamOptions |
    AnimationParamOptions | ObjInstanceVarParamOptions;

export class Param<T extends ParamOptions> {
    readonly Options: T;
    constructor(Options: T) {
    
        if (!Options.Description) Options.Description = 'There is no any description yet...';
        
        switch (Options.Type) {
            case 'number':
                if (!Options.InitialValue) Options.InitialValue = '';
                break;
            case 'string':
                if (!Options.AutocompleteId) Options.AutocompleteId = false;
                if (!Options.InitialValue) Options.InitialValue = '""';
                break;
            case 'boolean':
                if (!Options.InitialValue) Options.InitialValue = 'false';
                break;
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
            case 'object':
                if (!Options.AllowedPluginIds) Options.AllowedPluginIds = ["<world>"];
                break;
            default:
                if (!Options.InitialValue) Options.InitialValue = '""';
                break;
        }

        this.Options = Options;
    }
}

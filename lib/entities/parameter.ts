/** Object that represents all types of ACE's parameter. */
export enum Parameter {
    Number = 'number',
    String = 'string',
    Any = 'any',
    Boolean = 'boolean',
    Combo = 'combo',
    Cmp = 'cmp',
    Object = 'object',
    ObjectName = 'objectname',
    Layer = 'layer',
    Layout = 'layout',
    Keyb = 'keyb',
    InstanceVar = 'instancevar',
    InstanceVarBool = 'instancevarbool',
    EventVar = 'eventvar',
    EventVarBool = 'eventvarbool',
    Animation = 'animation',
    ObjInstanceVar = 'objinstancevar',
    /** Hidden */
    Template = 'template'
}

/**
 * @class represents ACE's parameter info.
 */
export class ParameterEntity {

    constructor(
        readonly id: string,
        readonly name: string,
        readonly description: string,
        readonly opts: ParameterOptions
    ) {

        if (name.length === 0) this.name = id;

        if (opts.type === Parameter.Combo) {
            if (opts.initialValue) {
                const items = opts.items.map(i => i[0]);
                if (!items.includes(opts.initialValue)) {
                    opts.initialValue = items[0]
                }
            }
        }
    }
}

/** All available ACE's parameter options  */
export type ParameterOptions =
    | INumberParameter
    | IStringParameter
    | IAnyParameter
    | IBooleanParameter
    | IComboParameter
    | ICmpParameter
    | IObjectParameter
    | IObjectNameParameter
    | ILayerParameter
    | ILayoutParameter
    | IKeybParameter
    | IInstanceVarParameter
    | IInstanceVarBoolParameter
    | IEventVarParameter
    | IEventVarBoolParameter
    | IAnimationParameter
    | IObjInstanceVarParameter
    ;


/** Base properties for any ACE's parameter. */
type ParameterBase = {
    /**
     * Type of parameter.
     */
    readonly type: Parameter;
}

/** Object represents 'number' parameter */
interface INumberParameter extends ParameterBase {
    readonly type: Parameter.Number;
    /**
     * *Optional*. A number parameter
     */
    initialValue?: number;
}

/** Object represents 'string' parameter */
interface IStringParameter extends ParameterBase {
    readonly type: Parameter.String;
    /**
     * *Optional*. A string parameter.
     */
    initialValue?: string;
    /**
     * *Optional*. Set to a globally unique ID and string constants with the same ID will offer autocomplete in the editor.
     */
    readonly autocomplete?: true;
}

/** Object represents 'any' parameter */
interface IAnyParameter extends ParameterBase {
    readonly type: Parameter.Any;
    /**
     * *Optional*. Either a number or a string.
     */
    initialValue?: string | number;
}

/** Object represents 'boolean' parameter */
interface IBooleanParameter extends ParameterBase {
    readonly type: Parameter.Boolean;
    /**
     * *Optional*. A boolean parameter, displayed as a checkbox
     */
    initialValue?: true;
}

/** Object represents 'combo' parameter */
interface IComboParameter extends ParameterBase {
    readonly type: Parameter.Combo;
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    readonly items: [string, string][];
    /**
     * *Optional*. A dropdown list. Items must be specified with the "items" property.
     */
    initialValue?: string;
}

/** Object represents 'cmp' parameter */
interface ICmpParameter extends ParameterBase {
    /**
     * A dropdown list with comparison options like "equal to", "less than" etc.
     */
    readonly type: Parameter.Cmp;
}

/** Object represents 'object' parameter */
interface IObjectParameter extends ParameterBase {
    /**
     * An object picker.
     * @description The types of plugin to show can be filtered using an optional "allowedPluginIds" property.
     */
    readonly type: Parameter.Object;
    /**
     * *Optional*. An array of plugin IDs allowed to be shown by the object picker.
     * @description For example, use ["Sprite"] to only allow the object parameter to select a Sprite.
     * @example ["Sprite"]
     */
    readonly allowedPluginIds?: string[];
}

/** Object represents 'objectname' parameter */
interface IObjectNameParameter extends ParameterBase {
    /**
     * A string parameter which is interpreted as an object name
     */
    readonly type: Parameter.ObjectName;
}

/** Object represents 'layer' parameter */
interface ILayerParameter extends ParameterBase {
    /**
     * A string parameter which is interpreted as a layer name
     */
    readonly type: Parameter.Layer;
}

/** Object represents 'layout' parameter */
interface ILayoutParameter extends ParameterBase {
    /**
     * A dropdown list with every layout in the project
     */
    readonly type: Parameter.Layout;
}

/** Object represents 'keyb' parameter */
interface IKeybParameter extends ParameterBase {
    /**
     * A keyboard key picker
     */
    readonly type: Parameter.Keyb;
}

/** Object represents 'instancevar' parameter */
interface IInstanceVarParameter extends ParameterBase {
    /**
     * A dropdown list with the non-boolean instance variables the object has
     */
    readonly type: Parameter.InstanceVar;
}

/** Object represents 'instancevarbool' parameter */
interface IInstanceVarBoolParameter extends ParameterBase {
    /**
     * A dropdown list with the boolean instance variables the object has
     */
    readonly type: Parameter.InstanceVarBool;
}

/** Object represents 'eventvar' parameter */
interface IEventVarParameter extends ParameterBase {
    /**
     * A dropdown list with non-boolean event variables in scope
     */
    readonly type: Parameter.EventVar;
}

/** Object represents 'eventvarbool' parameter */
interface IEventVarBoolParameter extends ParameterBase {
    /**
     * A dropdown list with boolean event variables in scope
     */
    readonly type: Parameter.EventVarBool;
}

/** Object represents 'animation' parameter */
interface IAnimationParameter extends ParameterBase {
    /**
     * A string parameter which is interpreted as an animation name in the object
     */
    readonly type: Parameter.Animation;
}

/** Object represents 'objinstancevar' parameter */
interface IObjInstanceVarParameter extends ParameterBase {
    /**
     * A dropdown list with non-boolean instance variables available in a prior 'object' parameter.
     * @requires An Parameter.Object type parameter.
     */
    readonly type: Parameter.ObjInstanceVar;
}

/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param opts Parameter options.
 */
export function addParam(id: string, name: string, opts: ParameterOptions): ParameterEntity;
/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param description Optional. The parameter description.
 * @param opts Parameter options.
 */
export function addParam(id: string, name: string, description: string, opts: ParameterOptions): ParameterEntity;
/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param descriptionOrOpts The parameter description OR parameter options.
 * @param opts Parameter options.
 */
export function addParam(
    id: string,
    name: string,
    descriptionOrOpts: string | ParameterOptions,
    opts?: ParameterOptions
): ParameterEntity {
    let description: string = 'There is no any description yet...';
    let options: ParameterOptions;

    if (typeof descriptionOrOpts === 'string' && opts) {
        // Если переданы описание и опции
        description = descriptionOrOpts;
        options = opts;
    } else if (typeof descriptionOrOpts === 'object') {
        // Если переданы только опции
        options = descriptionOrOpts;
    } else {
        throw new Error(
            `Invalid parameter options provided. Ensure you pass either a description and options, or only options.`
        );
    }
    return new ParameterEntity(id, name, description, options);
}
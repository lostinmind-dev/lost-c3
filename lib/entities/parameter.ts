import { Md5 } from "../../deps.ts";
import { Addon } from "../addon/index.ts";

/**
 * @class represents ACE's parameter info.
 */
export class Parameter {
    readonly _id: string;
    readonly _name: string;
    readonly _description: string;
    readonly _opts: ParameterOptions;

    constructor(
        id: string,
        name: string,
        description: string,
        opts: ParameterOptions
    ) {
        this._id = id;
        this._name = name;
        if (name.length === 0) this._name = id;
        this._description = description;

        if (opts.type === Param.String) {
            if (opts.autocompleteId) {
                const hash = Md5.hashStr(Addon.getConfig().addonId + opts.autocompleteId);
                opts.autocompleteId = hash;
            }
        }
        if (opts.type === Param.Combo) {
            if (opts.initialValue) {
                const items = opts.items.map(i => i[0]);
                if (!items.includes(opts.initialValue)) {
                    opts.initialValue = items[0]
                }
            }
        }
        this._opts = opts;
    }
}

/** Object that represents all types of ACE's parameter. */
export enum Param {
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
    ObjInstanceVar = 'objinstancevar'
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
    readonly type: Param;
}

/** Object represents 'number' parameter */
interface INumberParameter extends ParameterBase {
    readonly type: Param.Number;
    /**
     * *Optional*. A number parameter
     */
    initialValue?: number;
}

/** Object represents 'string' parameter */
interface IStringParameter extends ParameterBase {
    readonly type: Param.String;
    /**
     * *Optional*. A string parameter.
     */
    initialValue?: string;
    /**
     * *Optional*. Set to a globally unique ID and string constants with the same ID will offer autocomplete in the editor.
     */
    autocompleteId?: string;
}

/** Object represents 'any' parameter */
interface IAnyParameter extends ParameterBase {
    readonly type: Param.Any;
    /**
     * *Optional*. Either a number or a string.
     */
    initialValue?: string | number;
}

/** Object represents 'boolean' parameter */
interface IBooleanParameter extends ParameterBase {
    readonly type: Param.Boolean;
    /**
     * *Optional*. A boolean parameter, displayed as a checkbox
     */
    initialValue?: boolean;
}

/** Object represents 'combo' parameter */
interface IComboParameter extends ParameterBase {
    readonly type: Param.Combo;
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
    readonly type: Param.Cmp;
}

/** Object represents 'object' parameter */
interface IObjectParameter extends ParameterBase {
    /**
     * An object picker.
     * @description The types of plugin to show can be filtered using an optional "allowedPluginIds" property.
     */
    readonly type: Param.Object;
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
    readonly type: Param.ObjectName;
}

/** Object represents 'layer' parameter */
interface ILayerParameter extends ParameterBase {
    /**
     * A string parameter which is interpreted as a layer name
     */
    readonly type: Param.Layer;
}

/** Object represents 'layout' parameter */
interface ILayoutParameter extends ParameterBase {
    /**
     * A dropdown list with every layout in the project
     */
    readonly type: Param.Layout;
}

/** Object represents 'keyb' parameter */
interface IKeybParameter extends ParameterBase {
    /**
     * A keyboard key picker
     */
    readonly type: Param.Keyb;
}

/** Object represents 'instancevar' parameter */
interface IInstanceVarParameter extends ParameterBase {
    /**
     * A dropdown list with the non-boolean instance variables the object has
     */
    readonly type: Param.InstanceVar;
}

/** Object represents 'instancevarbool' parameter */
interface IInstanceVarBoolParameter extends ParameterBase {
    /**
     * A dropdown list with the boolean instance variables the object has
     */
    readonly type: Param.InstanceVarBool;
}

/** Object represents 'eventvar' parameter */
interface IEventVarParameter extends ParameterBase {
    /**
     * A dropdown list with non-boolean event variables in scope
     */
    readonly type: Param.EventVar;
}

/** Object represents 'eventvarbool' parameter */
interface IEventVarBoolParameter extends ParameterBase {
    /**
     * A dropdown list with boolean event variables in scope
     */
    readonly type: Param.EventVarBool;
}

/** Object represents 'animation' parameter */
interface IAnimationParameter extends ParameterBase {
    /**
     * A string parameter which is interpreted as an animation name in the object
     */
    readonly type: Param.Animation;
}

/** Object represents 'objinstancevar' parameter */
interface IObjInstanceVarParameter extends ParameterBase {
    /**
     * A dropdown list with non-boolean instance variables available in a prior 'object' parameter.
     * @requires An Param.Object type parameter.
     */
    readonly type: Param.ObjInstanceVar;
}

/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param opts Parameter options.
 */
export function addParam(id: string, name: string, opts: ParameterOptions): Parameter;
/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param description Optional. The parameter description.
 * @param opts Parameter options.
 */
export function addParam(id: string, name: string, description: string, opts: ParameterOptions): Parameter;
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
): Parameter {
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
    return new Parameter(id, name, description, options);
}
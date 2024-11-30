import { Md5 } from "../../deps.ts";
import type { EntityParamOptions, EntityType } from './entity.ts';

export type ComboIdArray = string[];

/**
 * @class represents ACE's parameter info.
 */
export class Parameter<A extends ComboIdArray = ComboIdArray, E extends EntityType = EntityType> {
    readonly _id: string;
    readonly _name: string;
    readonly _description: string;
    readonly _opts: EntityParamOptions<E, A>;
    
    constructor(
        id: string,
        name: string,
        description: string,
        opts: EntityParamOptions<E, A>
    ) {
        this._id = id;
        this._name = name;
        if (name.length === 0) this._name = id;
        this._description = description;

        if (opts.type === Param.String) {
            if (opts.autocompleteId) {
                const hash = Md5.hashStr(id + opts.autocompleteId);
                opts.autocompleteId = hash;
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
export type ParamOptions<A extends ComboIdArray> = 
    NumberParam |
    StringParam |
    AnyParam |
    BooleanParam |
    ComboParam<A> |
    CmpParam |
    ObjectParam |
    ObjectNameParam |
    LayerParam |
    LayoutParam |
    KeybParam |
    InstanceVarParam |
    InstanceVarBoolParam |
    EventVarParam |
    EventVarBoolParam |
    AnimationParam |
    ObjInstanceVarParam
;

/** All available expression parameter options  */
export type ExpressionParamOptions = 
    NumberParam |
    StringParam |
    AnyParam
;

/** Base properties for any ACE's parameter. */
type ParamOptionsBase = {
    /**
     * Type of parameter.
     */
    type: Param;
}

/** Object represents 'number' parameter */
interface NumberParam extends ParamOptionsBase {
    type: Param.Number;
    /**
     * *Optional*. A number parameter
     */
    initialValue?: number;
}

/** Object represents 'string' parameter */
interface StringParam extends ParamOptionsBase {
    type: Param.String;
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
interface AnyParam extends ParamOptionsBase {
    type: Param.Any;
    /**
     * *Optional*. Either a number or a string.
     */
    initialValue?: string | number;
}

/** Object represents 'boolean' parameter */
interface BooleanParam extends ParamOptionsBase {
    type: Param.Boolean;
    /**
     * *Optional*. A boolean parameter, displayed as a checkbox
     */
    initialValue?: boolean;
}

/** Object represents 'combo' parameter */
interface ComboParam<A extends ComboIdArray> extends ParamOptionsBase {
    type: Param.Combo;
    /**
     * Must be used to specify the available items.
     * @example [["item_one", "Item 1"], ["item_two", "Item 2"]]
     */
    items: [A[number], string][];
    /**
     * *Optional*. A dropdown list. Items must be specified with the "items" property.
     */
    initialValue?: A[number];
}

/** Object represents 'cmp' parameter */
interface CmpParam extends ParamOptionsBase {
    /**
     * A dropdown list with comparison options like "equal to", "less than" etc.
     */
    type: Param.Cmp;
}

/** Object represents 'object' parameter */
interface ObjectParam extends ParamOptionsBase {
    /**
     * An object picker.
     * @description The types of plugin to show can be filtered using an optional "allowedPluginIds" property.
     */
    type: Param.Object;
    /**
     * *Optional*. An array of plugin IDs allowed to be shown by the object picker.
     * @description For example, use ["Sprite"] to only allow the object parameter to select a Sprite.
     * @example ["Sprite"]
     */
    allowedPluginIds?: string[];
}

/** Object represents 'objectname' parameter */
interface ObjectNameParam extends ParamOptionsBase {
    /**
     * A string parameter which is interpreted as an object name
     */
    type: Param.ObjectName;
}

/** Object represents 'layer' parameter */
interface LayerParam extends ParamOptionsBase {
    /**
     * A string parameter which is interpreted as a layer name
     */
    type: Param.Layer;
}

/** Object represents 'layout' parameter */
interface LayoutParam extends ParamOptionsBase {
    /**
     * A dropdown list with every layout in the project
     */
    type: Param.Layout;
}

/** Object represents 'keyb' parameter */
interface KeybParam extends ParamOptionsBase {
    /**
     * A keyboard key picker
     */
    type: Param.Keyb;
}

/** Object represents 'instancevar' parameter */
interface InstanceVarParam extends ParamOptionsBase {
    /**
     * A dropdown list with the non-boolean instance variables the object has
     */
    type: Param.InstanceVar;
}

/** Object represents 'instancevarbool' parameter */
interface InstanceVarBoolParam extends ParamOptionsBase {
    /**
     * A dropdown list with the boolean instance variables the object has
     */
    type: Param.InstanceVarBool;
}

/** Object represents 'eventvar' parameter */
interface EventVarParam extends ParamOptionsBase {
    /**
     * A dropdown list with non-boolean event variables in scope
     */
    type: Param.EventVar;
}

/** Object represents 'eventvarbool' parameter */
interface EventVarBoolParam extends ParamOptionsBase {
    /**
     * A dropdown list with boolean event variables in scope
     */
    type: Param.EventVarBool;
}

/** Object represents 'animation' parameter */
interface AnimationParam extends ParamOptionsBase {
    /**
     * A string parameter which is interpreted as an animation name in the object
     */
    type: Param.Animation;
}

/** Object represents 'objinstancevar' parameter */
interface ObjInstanceVarParam extends ParamOptionsBase {
    /**
     * A dropdown list with non-boolean instance variables available in a prior 'object' parameter.
     * @requires An Param.Object type parameter.
     */
    type: Param.ObjInstanceVar;
}

/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param opts Parameter options.
 */
export function addParam<A extends ComboIdArray = ComboIdArray>(id: string, name: string, opts: EntityParamOptions<EntityType, A>): Parameter<A>;
/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param description Optional. The parameter description.
 * @param opts Parameter options.
 */
export function addParam<A extends ComboIdArray = ComboIdArray>(id: string, name: string, description: string, opts: EntityParamOptions<EntityType, A>): Parameter<A>;
/**
 * Adds parameter to action/condition/expression entity.
 * @param id The unique identifier for the parameter.
 * @param name The name that appears in the action/condition/expression parameters dialog.
 * @param descriptionOrOpts The parameter description OR parameter options.
 * @param opts Parameter options.
 */
export function addParam<A extends ComboIdArray = ComboIdArray>(
    id: string,
    name: string,
    descriptionOrOpts: string | EntityParamOptions<EntityType, A>,
    opts?: EntityParamOptions<EntityType, A>
): Parameter<A> {
    let description: string = 'There is no any description yet...';
    let options: EntityParamOptions<EntityType, A>;

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

    return new Parameter<A>(id, name, description, options);
}
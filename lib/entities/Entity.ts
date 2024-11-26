import { bold, italic } from '../misc/text-formatting.ts';
import type { ExpressionParamOptions, Parameter, ParamOptions } from './parameter.ts';

export enum EntityType {
    Action = 'action',
    Condition = 'condition',
    Expression = 'expression'
}

interface EntityFuncReturnTypeMap {
    [EntityType.Action]: void;
    [EntityType.Condition]: boolean;
    [EntityType.Expression]: number | string;
}

export type EntityFuncReturnType<E extends EntityType> = EntityFuncReturnTypeMap[E];

export abstract class Entity<E extends EntityType> {
    readonly _type: E;
    readonly _id: string;
    readonly _name: string;
    _displayText: string;
    readonly _description: string;
    readonly _params: Array<Parameter<E>>;
    readonly _func: (this: any, ...args: any[]) => EntityFuncReturnType<E>;
    
    readonly _isDeprecated: boolean;

    constructor(
        type: E,
        id: string,
        name: string,
        description: string,
        func: (this: any, ...args: any[]) => EntityFuncReturnType<E>,
        isDeprecated: boolean,
        displayText?: string,
        params?: Array<Parameter<E>>
    ) {
        this._id = id;
        this._type = type;
        this._name = name;
        if (name.length === 0) this._name = this._id;
        this._description = description;
        this._func = func;
        this._isDeprecated = isDeprecated;
        this._displayText = displayText || '';
        this._params = params || [];

        if (
            this._type === EntityType.Action ||
            this._type === EntityType.Condition
        ) {
            this._checkDisplayText();
        }
    }

    private _setDisplayTextToDefault() {
        const _displayText: string = this.removePlaceholders(this._displayText);

        const _params: string[] = [];

        this._params.forEach((param, i) => {
            if (i === this._params.length - 1) {
                _params.push(`${italic(param._name)}: ${bold(`{${i}}`)}`);
            } else {
                _params.push(`${italic(param._name)}: ${bold(`{${i}}`)}` + ', ');
            }
        })

        const finalDisplayText = `${_displayText} (${_params.join('')})`;
        this._displayText = finalDisplayText;
        return this;
    }

    private _isDisplayTextCorrect(displayText: string): boolean {
        for (let i = 0; i < this._params.length; i++) {
            if (!displayText.includes(`{${i}}`))
            return false;
        }
        return true;
    }

    private removePlaceholders(str: string) {
        return str.replace(/,\s*\{\d+\}|\{\d+\},?|\s*,\s*$|\s*\(.*?\)/g, '').trim();
    }

    private _checkDisplayText() {
        if (this._displayText.length === 0) {
            this._displayText = this._name;
        }
        if (this._params.length > 0) {
            if (!this._isDisplayTextCorrect(this._displayText)) {
                this._setDisplayTextToDefault();
            }
        }
    }
}  

/** Object represents base options for each entity type */
export type EntityOptions<T extends EntityType> = {
    /**
     * 
     */
    readonly isDeprecated?: boolean;
    /**
     * *Optional*. Entity parameters.
     */
    readonly params?: Array<Parameter<T>>;
    /**
     * *Optional*. Default is **False**.
     * Set to true to highlight the ACE in the condition/action/expression picker dialogs. 
     */
    readonly highlight?: boolean;
}

/** Map of Parameter options for evert entity type. */
interface EntityParamOptionsMap {
    [EntityType.Action]: ParamOptions;
    [EntityType.Condition]: ParamOptions;
    [EntityType.Expression]: ExpressionParamOptions;
}

/** Seperated parameter options for every entity type. */
export type EntityParamOptions<T extends EntityType> = EntityParamOptionsMap[T];

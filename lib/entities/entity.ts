import { bold, italic } from '../misc/text-formatting.ts';
import type { Parameter } from './parameter.ts';

export type EntityType =
    | 'action'
    | 'condition'
    | 'expression'
    ;

export abstract class Entity<E extends EntityType> {
    readonly _type: E;
    readonly _id: string;
    readonly _name: string;
    _displayText: string;
    readonly _description: string;
    readonly _params: Parameter[];
    readonly _func: (this: any, ...args: any[]) => void;

    readonly _isDeprecated: boolean;

    constructor(
        type: E,
        id: string,
        name: string,
        description: string,
        func: (this: any, ...args: any[]) => void,
        isDeprecated: boolean,
        displayText?: string,
        params?: Parameter[]
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
            this._type === 'action' ||
            this._type === 'condition'
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
export type EntityOptions = {
    /**
     * *Optional*. Set to true to mark as deprecated.
     */
    readonly isDeprecated?: boolean;
    /**
     * *Optional*. Entity parameters.
     */
    readonly params?: Parameter[];
    /**
     * *Optional*. Default is **False**.
     * Set to true to highlight the ACE in the condition/action/expression picker dialogs. 
     */
    readonly highlight?: boolean;
}

import type { Aces } from "../helpers/ace.ts";
import type { Category } from "../helpers/category.ts";
import type { Parameters } from "../helpers/parameter.ts";

type AcesJson = {
    [categoryId: string]: AcesCategory;
}

type AcesCategory = {
    actions?: IAction[];
    conditions?: ICondition[];
    expressions?: IExpression[];
}

interface IAce {
    id: string;
    isDeprecated?: boolean;
    highlight?: boolean;
    params?: Array<IDefault | INumber | IString | IAny | IBoolean | ICombo | IObject>;
}

export interface IAction extends IAce {
    scriptName: string;
    isAsync?: boolean;
}

export interface ICondition extends IAce {
    scriptName: string;
    isTrigger?: boolean;
    isFakeTrigger?: boolean;
    isStatic?: boolean;
    isLooping?: boolean;
    isInvertible?: boolean;
    isCompatibleWithTriggers?: boolean;
}

export interface IExpression extends IAce {
    expressionName: string;
    returnType: 'string' | 'number' | 'any';
    isVariadicParameters?: boolean;
}

interface IParameter {
    id: string;
    type: keyof Parameters
}

interface IDefault extends IParameter {
    id: string;
    type: 'cmp' | 'objectname' | 'layer' | 'layout' | 'keyb' | 'instancevar' | 'instancevarbool' | 'eventvar' | 'eventvarbool' | 'animation' | 'objinstancevar';
}

interface IAny extends IParameter {
    type: 'any';
    initialValue?: string;
}

interface INumber extends IParameter {
    type: 'number';
    initialValue?: string;
}

interface IString extends IParameter {
    type: 'string';
    initialValue?: string;
    autocompleteId?: string;
}

interface IBoolean extends IParameter {
    type: 'boolean';
    initialValue?: 'true' | 'false';
}

interface ICombo extends IParameter {
    type: 'combo';
    items: string[];
    initialValue: string;
}

interface IObject extends IParameter {
    type: 'object';
    allowedPluginIds?: string[];
}

export class AcesManager {
    private parametersToJson(parameters: Category['aces'][0]['parameters']): IAce['params'] {
        const params: IAce['params'] = [];

        for (const parameter of parameters) {
            if (
                parameter.type === 'number' ||
                parameter.type === 'any'
            ) {
                params.push({
                    id: parameter.id,
                    type: parameter.type,
                    initialValue: `"${String(parameter.value)}"`,
                });
            } else if (parameter.type === 'string') {
                params.push({
                    id: parameter.id,
                    type: parameter.type,
                    initialValue: `"${parameter.value}"`,
                    autocompleteId: parameter.autocompleteId
                });
            } else if (parameter.type === 'boolean') {
                params.push({
                    id: parameter.id,
                    type: parameter.type,
                    initialValue: parameter.value
                });
            } else if (parameter.type === 'combo') {
                params.push({
                    id: parameter.id,
                    type: parameter.type,
                    items: parameter.allItemIds(),
                    initialValue: parameter.initialValue
                });
            } else if (parameter.type === 'object') {
                params.push({
                    id: parameter.id,
                    type: parameter.type,
                    allowedPluginIds: parameter.allowedPluginIds
                });
            } else {
                params.push({
                    id: parameter.id,
                    type: parameter.type
                });
            }
        }

        return params;
    }
    private acesToJson<T extends keyof Aces>(type: T, aces: Aces[T]['klass'][]) {
        const _aces: Aces[T]['json'][] = [];

        for (const ace of aces) {
            if (ace.type === 'action') {
                _aces.push({
                    id: ace.id,
                    scriptName: ace.method.name,
    
                    isDeprecated: ace.deprecated,
                    highlight: ace.highlight,
                    
                    params: this.parametersToJson(ace.parameters),
                    
                    isAsync: ace.async,
                });
            } else if (ace.type === 'condition') {
                _aces.push({
                    id: ace.id,
                    scriptName: ace.method.name,
    
                    isDeprecated: ace.deprecated,
                    highlight: ace.highlight,
                    
                    params: this.parametersToJson(ace.parameters),
    
                    isTrigger: ace.trigger,
                    isFakeTrigger: ace.fakeTrigger,
                    isStatic: ace.static,
                    isLooping: ace.looping,
                    isInvertible: ace.invertible,
                    isCompatibleWithTriggers: ace.compatibleWithTriggers
                });
            } else if (ace.type === 'expression') {
                _aces.push({
                    id: ace.id,
                    expressionName: ace.method.name,
    
                    isDeprecated: ace.deprecated,
                    highlight: ace.highlight,
                    
                    params: this.parametersToJson(ace.parameters),
    
                    returnType: ace.returnType,
                    isVariadicParameters: ace.variadicParameters
                });
            } else {
                throw new Error('Unknown ace type', ace);
            }
        }

        if (_aces.length === 0) return undefined;

        return _aces;
    }

    createJson(categories: Category[]): AcesJson {
        const data: AcesJson = {};

        for (const category of categories) {
            if (category.dev) continue;

            data[category.id] = {
                actions: this.acesToJson('action', category.allActions()),
                conditions: this.acesToJson('condition', category.allConditions()),
                expressions: this.acesToJson('expression', category.allExpressions())
            };
        }

        return data;
    }
}
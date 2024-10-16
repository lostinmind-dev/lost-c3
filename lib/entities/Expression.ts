import type { CategoryTarget } from "./Category.ts";
import type { EntityOptionsWithSpecificParams, LostEntityWithSpecificParams, LostEntityOptions, PropertyKeyObject } from "./Entity.ts";

type AllowedParamsType = 'number' | 'string' | 'any';

export interface LostExpression extends LostEntityWithSpecificParams<AllowedParamsType> {
    Type: 'Expression',
    Options: LostEntityOptions & {
        ReturnType: AllowedParamsType;
        IsVariadicParameters: boolean;
    }
}

interface ExpressionEntityOptions extends EntityOptionsWithSpecificParams<AllowedParamsType> {
    /**
     * One of "number", "string", "any". 
     * @description The runtime function must return the corresponding type, and "any" must still return either a number or a string.
     * @example "string" OR "number" OR "any"
     */
    ReturnType: AllowedParamsType,
    /**
     * Optional. Default is **False**. Allow the user to enter any number of parameters beyond those defined. 
     * @description In other words the parameters (if any) listed in "params" are required, but this flag enables adding further "any" type parameters beyond the end.
     * @example true
     */
    IsVariadicParameters?: boolean;
}

export function Expression(Options: ExpressionEntityOptions): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol | PropertyKeyObject,
        descriptor?: TypedPropertyDescriptor<any>
    ) {

        let methodName: string = '';
        let method: any;
        
        if (typeof propertyKey === 'object' && 'name' in propertyKey) {
            methodName = String(propertyKey.name);
            method = propertyKey.access.get();
        } else if (descriptor) {
            methodName = String(propertyKey);
            method = descriptor.value;
        }

        if (typeof method === 'undefined') {
            throw new Error('Decorator lost method.')
        }

        if (!target.constructor.prototype['Expressions']) {
            target.constructor.prototype['Expressions'] = [];
        }

        const Expression: LostExpression = {
            Type: 'Expression',
            Id: Options.Id,
            Name: Options.Name,
            Description: Options.Description || 'There is no any description yet...',
            Options: {
                ReturnType: Options.ReturnType,
                IsVariadicParameters: Options.IsVariadicParameters || false,


                ScriptName: methodName,
                Script: method,
                Highlight: Options.Highlight || false,
                Deprecated: Options.Deprecated || false
            },
            Params: Options.Params || []
        };

        target.constructor.prototype['Expressions'].push(Expression);
    }    
}
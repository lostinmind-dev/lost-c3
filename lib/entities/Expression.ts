import type { EntityOptionsWithSpecificParams, LostEntityWithSpecificParams, LostEntityOptions } from "./Entity.ts";

type AllowedParamsType = 'number' | 'string' | 'any';

export interface LostExpression extends LostEntityWithSpecificParams<AllowedParamsType> {
    Type: 'Expression';
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

export function Expression<T>(Options: ExpressionEntityOptions) {
    return function (
        value: (this: any) => void,
        context: ClassMethodDecoratorContext<T, (this: any) => void>
    ) {
        context.addInitializer(function (this: any) {

            if (!this.constructor.prototype['Expressions']) {
                this.constructor.prototype['Expressions'] = [];
            }

            const Expression: LostExpression = {
                Type: 'Expression',
                Id: Options.Id,
                Name: Options.Name,
                Description: Options.Description || 'There is no any description yet...',
                Options: {
                    ReturnType: Options.ReturnType,
                    IsVariadicParameters: Options.IsVariadicParameters || false,
    
    
                    ScriptName: String(context.name),
                    Script: value,
                    Highlight: Options.Highlight || false,
                    Deprecated: Options.Deprecated || false
                },
                Params: Options.Params || []
            };

            this.constructor.prototype['Expressions'].push(Expression)

        })
    }    
}
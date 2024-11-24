import { Entity, type EntityFuncReturnType, type EntityOptions, EntityType } from './entity.ts';

/**
 * @class represents Expression entity.
 */
export class Expression extends Entity<EntityType.Expression> {
    readonly _opts?: IExpressionOptions;
    constructor(
        name: string,
        description: string,
        func: (this: any, ...args: any[]) => EntityFuncReturnType<EntityType.Expression>,
        opts?: IExpressionOptions
    ) {
        super(EntityType.Expression, name, description, func);
        this._opts = opts;
    }
}

/** Object that represents options for Expression entity. */
export interface IExpressionOptions extends EntityOptions<EntityType.Expression> {
    /**
     * *Optional*. Default is **any**. The runtime function must return the corresponding type, and "any" must still return either a number or a string.
     */
    readonly returnType?: ExpressionReturnType;
    /**
     * *Optional*. Default is **False**. Allow the user to enter any number of parameters beyond those defined. 
     * @description In other words the parameters (if any) listed in "params" are required, but this flag enables adding further "any" type parameters beyond the end.
     */
    readonly isVariadicParameters?: boolean;
}

/** Expression return type */
export type ExpressionReturnType = 'string' | 'number' | 'any';


export function expression<T>(name: string): any;
export function expression<T>(name: string, descriptionOrOpts: string | IExpressionOptions, opts: IExpressionOptions): any
export function expression<T>(name: string, descriptionOrOpts?: string | IExpressionOptions, opts?: IExpressionOptions): any {
    return function (
        value: (this: any, ...args: any[]) => number | string,
        context: ClassMethodDecoratorContext<T, (this: any, ...args: any[]) => string | number>
    ) {
        context.addInitializer(function (this: any, ...args: any[]) {

            let description: string = 'There is no any description yet...';
            let options: IExpressionOptions | undefined;

            if (typeof descriptionOrOpts === 'string') {
                description = descriptionOrOpts;

                if (typeof opts === 'object') {
                    options = opts;
                }
            } else {
                //
            }

            if (!this.constructor.prototype._expressions) {
                this.constructor.prototype._expressions = [];
            }

            this.constructor.prototype._expressions.push(
                new Expression(name, description, value, options)
            )

        })
    }    
}

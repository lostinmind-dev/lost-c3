import { Entity, type EntityOptions } from './entity.ts';

/**
 * @class represents Expression entity.
 */
export class ExpressionEntity extends Entity<'expression'> {
    readonly _opts?: IExpressionOptions;
    constructor(
        id: string,
        name: string,
        description: string,
        func: (this: any, ...args: any[]) => void,
        opts?: IExpressionOptions
    ) {
        super('expression', id, name, description, func, opts?.isDeprecated || false, '', opts?.params);
        this._opts = opts;
    }
}

/** Object that represents options for Expression entity. */
export interface IExpressionOptions extends EntityOptions {
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

export function Expression(id: string, name: string): any;
export function Expression(id: string, name: string, opts: IExpressionOptions): any;
export function Expression(id: string, name: string, description: string): any;
export function Expression(id: string, name: string, description: string, opts: IExpressionOptions): any;
export function Expression(
    id: string, 
    name: string,
    descriptionOrOpts?: string | IExpressionOptions,
    opts?: IExpressionOptions
): any {
    return function (
        value: (this: any, ...args: any[]) => number | string,
        context: ClassMethodDecoratorContext<any, (this: any, ...args: any[]) => string | number>
    ) {
        context.addInitializer(function (this: any) {
            let description: string = 'There is no any description yet...';
            let options: IExpressionOptions | undefined;

            if (typeof descriptionOrOpts === 'string') {
                description = descriptionOrOpts;
                if (opts && typeof opts === 'object') {
                    options = opts;
                }
            } else if (descriptionOrOpts && typeof descriptionOrOpts === 'object') {
                options = descriptionOrOpts;
            }

            if (!this.constructor.prototype._expressions) {
                this.constructor.prototype._expressions = [];
            }

            this.constructor.prototype._expressions.push(
                new ExpressionEntity(id, name, description, value, options)
            );
        });
    };
}

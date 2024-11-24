import { Entity, type EntityFuncReturnType, type EntityOptions, EntityType } from "./entity.ts";

/**
 * @class represents Action entity.
 */
export class Action extends Entity<EntityType.Action> {
    readonly _opts?: IActionOptions;

    constructor(
        name: string,
        displayText: string,
        description: string,
        func: (this: any, ...args: any[]) => EntityFuncReturnType<EntityType.Action>,
        opts?: IActionOptions
    ) {
        super(EntityType.Action, name, description, func, displayText, opts?.params);
        this._opts = opts;
    }
}

/** Object that represents options for Acton entity. */
interface IActionOptions extends EntityOptions<EntityType.Action> {
    /**
     * *Optional*. Default is **False**. Set to true to mark the action as asynchronous. 
     * @description Make the action method an async function, and the system Wait for previous actions to complete action will be able to wait for the action as well.
     */
    readonly isAsync?: boolean;
}


export function action<I>(name: string, displayText: string): any;
export function action<I>(name: string, displayText: string, description: string): any;
export function action<I>(name: string, displayText: string, description: string, opts: IActionOptions): any;
export function action<I>(name: string, displayText: string, descriptionOrOpts?: string | IActionOptions, opts?: IActionOptions): any {
    return function (
        value: (this: any, ...args: any[]) => void,
        context: ClassMethodDecoratorContext<I, (this: any, ...args: any[]) => void>
    ) {
        context.addInitializer(function (this: any, ...args: any[]) {

            let description: string = 'There is no any description yet...';
            let options: IActionOptions | undefined;

            if (typeof descriptionOrOpts === 'string') {
                description = descriptionOrOpts;

                if (typeof opts === 'object') {
                    options = opts;
                }
            } else {
                //
            }

            if (!this.constructor.prototype._actions) {
                this.constructor.prototype._actions = [];
            }

            this.constructor.prototype._actions.push(
                new Action(name, displayText, description, value, options)
            )

        })
    }
}
import { Entity, type EntityFuncReturnType, type EntityOptions, EntityType } from "./entity.ts";

/**
 * @class represents Action entity.
 */
export class ActionEntity extends Entity<EntityType.Action> {
    readonly _opts?: IActionOptions;

    constructor(
        id: string,
        name: string,
        displayText: string,
        description: string,
        func: (this: any, ...args: any[]) => EntityFuncReturnType<EntityType.Action>,
        opts?: IActionOptions
    ) {
        super(EntityType.Action, id, name, description, func, opts?.isDeprecated || false, displayText, opts?.params);
        this._opts = opts;

    }
}

/** Object that represents options for Acton entity. */
interface IActionOptions extends EntityOptions {
    /**
     * *Optional*. Default is **False**. Set to true to mark the action as asynchronous. 
     * @description Make the action method an async function, and the system Wait for previous actions to complete action will be able to wait for the action as well.
     */
    readonly isAsync?: boolean;
}


export function Action(id: string, name: string, displayText: string): any;
export function Action(id: string, name: string, displayText: string, opts: IActionOptions): any;
export function Action(id: string, name: string, displayText: string, description: string): any;
export function Action(id: string, name: string, displayText: string, description: string, opts: IActionOptions): any;
export function Action(
    id: string,
    name: string,
    displayText: string,
    descriptionOrOpts?: string | IActionOptions,
    opts?: IActionOptions
): any {
    return function (
        value: (this: any, ...args: any[]) => void,
        context: ClassMethodDecoratorContext<any, (this: any, ...args: any[]) => void>
    ) {
        context.addInitializer(function (this: any) {
            let description = 'There is no any description yet...';
            let options: IActionOptions | undefined;

            // Обработка необязательных параметров
            if (typeof descriptionOrOpts === 'string') {
                description = descriptionOrOpts; // Если третий параметр строка, это описание
                if (opts && typeof opts === 'object') {
                    options = opts; // Четвёртый параметр — это опции
                }
            } else if (descriptionOrOpts && typeof descriptionOrOpts === 'object') {
                options = descriptionOrOpts; // Если третий параметр объект, это опции
            }

            // Инициализация массива действий
            if (!this.constructor.prototype._actions) {
                this.constructor.prototype._actions = [];
            }

            // Добавление нового действия
            this.constructor.prototype._actions.push(
                new ActionEntity(id, name, displayText, description, value, options)
            );
        });
    };
}

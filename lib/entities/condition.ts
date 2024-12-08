import { Entity, type EntityFuncReturnType, type EntityOptions, EntityType } from './entity.ts';
/**
 * @class represents Condition entity.
 */
export class ConditionEntity extends Entity<EntityType.Condition> {
    readonly _opts?: IConditionOptions;
    constructor(
        id: string,
        name: string,
        displayText: string,
        description: string,
        func: (this: any, ...args: any[]) => EntityFuncReturnType<EntityType.Condition>,
        opts?: IConditionOptions
    ) {
        super(EntityType.Condition, id, name, description, func, opts?.isDeprecated || false, displayText, opts?.params);
        this._opts = opts;
    }
}

/** Object that represents options for Condition entity. */
export interface IConditionOptions extends EntityOptions {
    /**
     * *Optional*. Default is **True**. Specifies a trigger condition.
     * @description This appears with an arrow in the event sheet. 
     * Instead of being evaluated every tick, triggers only run when they are explicity triggered by a runtime call.
     */
    readonly isTrigger?: boolean;
    /**
     * *Optional*. Default is **False**. Specifies a fake trigger. 
     * @description This appears identical to a trigger in the event sheet, but is actually evaluated every tick. 
     * This is useful for conditions which are true for a single tick, such as for APIs which must poll a value every tick.
     */
    readonly isFakeTrigger?: boolean;
    /**
     * *Optional*. Default is **False**. Normally, the condition runtime method is executed once per picked instance. 
     * @description If the condition is marked static, the runtime method is executed once only, on the object type class. 
     * This means the runtime method must also implement the instance picking entirely itself, including respecting negation and OR blocks.
     */
    readonly isStatic?: boolean;
    /**
     * *Optional*. Default is **False**. Display an icon in the event sheet to indicate the condition loops. 
     * @description The condition method should use ILoopingConditionContext to implement its loop.
     * @link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/iloopingconditioncontext
     */
    readonly isLooping?: boolean;
    /**
     * *Optional*. Default is **true**. Allow the condition to be inverted in the event sheet.
     * @description Set to False to disable invert.
     */
    readonly isInvertible?: boolean;
    /**
     * *Optional*. Default is **True**. Allow the condition to be used in the same branch as a trigger. 
     * @description Set to false if the condition does not make sense when used in a trigger, such as the Trigger once condition.
     */
    readonly isCompatibleWithTriggers?: boolean;
}


export function Condition(id: string, name: string, displayText: string): any;
export function Condition(id: string, name: string, displayText: string, opts: IConditionOptions): any;
export function Condition(id: string, name: string, displayText: string, description: string): any;
export function Condition(id: string, name: string, displayText: string, description: string, opts: IConditionOptions): any;
export function Condition(
    id: string,
    name: string,
    displayText: string,
    descriptionOrOpts?: string | IConditionOptions,
    opts?: IConditionOptions
): any {
    return function (
        value: (this: any, ...args: any[]) => boolean,
        context: ClassMethodDecoratorContext<any, (this: any, ...args: any[]) => boolean>
    ) {
        context.addInitializer(function (this: any) {
            let description = 'There is no any description yet...';
            let options: IConditionOptions | undefined;

            // Обработка аргументов
            if (typeof descriptionOrOpts === 'string') {
                description = descriptionOrOpts; // Если третий аргумент — строка, это описание
                if (opts && typeof opts === 'object') {
                    options = opts; // Четвёртый аргумент — опции
                }
            } else if (descriptionOrOpts && typeof descriptionOrOpts === 'object') {
                options = descriptionOrOpts; // Если третий аргумент — объект, это опции
            }

            if (!this.constructor.prototype._conditions) {
                this.constructor.prototype._conditions = [];
            }

            this.constructor.prototype._conditions.push(
                new ConditionEntity(id, name, displayText, description, value, options)
            );

        });
    };
}

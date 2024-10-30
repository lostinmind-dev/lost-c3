import type { EntityOptionsBase, LostEntity, LostEntityOptions } from "./Entity.ts";

export interface LostCondition extends LostEntity {
    Type: 'Condition';
    DisplayText: string;
    Options: LostEntityOptions & {
        IsTrigger: boolean;
        IsFakeTrigger: boolean;
        IsStatic: boolean;
        IsLooping: boolean;
        IsInvertible: boolean;
        IsCompatibleWithTriggers: boolean;
    }
}

interface ConditionEntityOptions extends EntityOptionsBase {
    /**
     * The text that appears in the event sheet.
     * @description You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders.
     * (There must be one parameter placeholder per parameter.) For behaviors only, the placeholder {my} is substituted for the behavior name and icon.
     * @example "On end" OR "On end with options: {0}"
     */
    DisplayText: string,
    /**
     * Specifies a trigger condition. 
     * @description This appears with an arrow in the event sheet. 
     * Instead of being evaluated every tick, triggers only run when they are explicity triggered by a runtime call.
     * @example true
     */
    IsTrigger: boolean;
    /**
     * Optional. Default is **False**. Specifies a fake trigger. 
     * @description This appears identical to a trigger in the event sheet, but is actually evaluated every tick. 
     * This is useful for conditions which are true for a single tick, such as for APIs which must poll a value every tick.
     * @example true
     */
    IsFakeTrigger?: boolean;
    /**
     * Optional. Default is **False**. Normally, the condition runtime method is executed once per picked instance. 
     * @description If the condition is marked static, the runtime method is executed once only, on the object type class. 
     * This means the runtime method must also implement the instance picking entirely itself, including respecting negation and OR blocks.
     * @example true
     */
    IsStatic?: boolean;
    /**
     * Optional. Default is **False**. Display an icon in the event sheet to indicate the condition loops. 
     * @description The condition method should use ILoopingConditionContext to implement its loop.
     * @link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/iloopingconditioncontext
     * @example false
     */
    IsLooping?: boolean;
    /**
     * Optional. Default is **True**. Allow the condition to be inverted in the event sheet.
     * @description Set to false to disable invert.
     * @example false
     */
    IsInvertible?: boolean;
    /**
     * Optional. Default is **True**. Allow the condition to be used in the same branch as a trigger. 
     * @description Set to false if the condition does not make sense when used in a trigger, such as the Trigger once condition.
     * @example false
     */
    IsCompatibleWithTriggers?: boolean;
}

export function Condition<T>(Options: ConditionEntityOptions) {
    return function (
        value: (this: any, ...args: any[]) => void,
        context: ClassMethodDecoratorContext<T, (this: any, ...args: any[]) => void>
    ) {
        context.addInitializer(function (this: any) {
           
            if (!this.constructor.prototype['Conditions']) {
                this.constructor.prototype['Conditions'] = [];
            }

            const Condition: LostCondition = {
                Type: 'Condition',
                Id: Options.Id,
                Name: Options.Name,
                DisplayText: Options.DisplayText,
                Description: Options.Description || 'There is no any description yet...',
                Options: {
                    IsTrigger: Options.IsTrigger,
                    IsFakeTrigger: Options.IsFakeTrigger || false,
                    IsStatic: Options.IsStatic || false,
                    IsLooping: Options.IsLooping || false,
                    IsInvertible: Options.IsInvertible || true,
                    IsCompatibleWithTriggers: Options.IsCompatibleWithTriggers || true,
    
    
                    ScriptName: String(context.name),
                    Script: value,
                    Highlight: Options.Highlight || false,
                    Deprecated: Options.Deprecated || false
                },
                Params: Options.Params || []
            };
            
            this.constructor.prototype['Conditions'].push(Condition)

        })
    }
}
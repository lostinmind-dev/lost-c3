import type { EntityOptionsBase, LostEntity, LostEntityOptions } from "./Entity.ts";

export interface LostAction extends LostEntity {
    Type: 'Action';
    DisplayText: string;
    Options: LostEntityOptions & {
        IsAsync: boolean;
    }
}

interface ActionEntityOptions extends EntityOptionsBase {
    /**
     * The text that appears in the event sheet.
     * @description You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders.
     * (There must be one parameter placeholder per parameter.) For behaviors only, the placeholder {my} is substituted for the behavior name and icon.
     * @example "Do action" OR "Do action with options: OptionId:{0}"
     */
    DisplayText: string,
    /**
     * Set to true to mark the action as asynchronous. 
     * @description Make the action method an async function, and the system Wait for previous actions to complete action will be able to wait for the action as well.
     * @example true
     */
    IsAsync?: boolean;
}

export function Action<I>(Options: ActionEntityOptions) {
    return function (
        value: (this: any, ...args: any[]) => void,
        context: ClassMethodDecoratorContext<I, (this: any, ...args: any[]) => void>
    ) {
        context.addInitializer(function (this: any, ...args: any[]) {

            if (!this.constructor.prototype['Actions']) {
                this.constructor.prototype['Actions'] = [];
            }

            const Action: LostAction = {
                Type: 'Action',
                Id: Options.Id,
                Name: Options.Name,
                DisplayText: Options.DisplayText,
                Description: Options.Description || 'There is no any description yet...',
                Options: {
                    IsAsync: Options.IsAsync || false,
                    ScriptName: String(context.name),
                    Script: value,
                    Highlight: Options.Highlight || false,
                    Deprecated: Options.Deprecated || false
                },
                Params: Options.Params || []
            };

            this.constructor.prototype['Actions'].push(Action)

        })
    }
}
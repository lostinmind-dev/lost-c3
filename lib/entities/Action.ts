import type { EntityOptionsBase, LostEntity, LostEntityOptions, PropertyKeyObject } from "./Entity.ts";

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

export function Action(Options: ActionEntityOptions): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol | PropertyKeyObject,
        descriptor?: TypedPropertyDescriptor<any>
    ): TypedPropertyDescriptor<any> | void {

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

        if (!target.constructor.prototype['Actions']) {
            target.constructor.prototype['Actions'] = [];
        }

        const Action: LostAction = {
            Type: 'Action',
            Id: Options.Id,
            Name: Options.Name,
            DisplayText: Options.DisplayText,
            Description: Options.Description || 'There is no any description yet...',
            Options: {
                IsAsync: Options.IsAsync || false,
                ScriptName: methodName,
                Script: method,
                Highlight: Options.Highlight || false,
                Deprecated: Options.Deprecated || false
            },
            Params: Options.Params || []
        };

        target.constructor.prototype['Actions'].push(Action);
        return;
    }
}
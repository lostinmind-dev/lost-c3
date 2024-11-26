import type { ActionEntity } from './action.ts';
import type { ConditionEntity } from './condition.ts';
import type { ExpressionEntity } from './expression.ts';

interface ICategoryOptions {
    /**
     * *Optional*. Default is **False**. Deprecate all category Actions, Conditions, Expressions.
     * @description If True, all category Actions, Conditions, Expressions will mark as Deprecated.
     */
    readonly isDeprecated?: boolean;
    /**
     * *Optional*. Default is **False**. Remove all category Actions, Conditions, Expressions from addon.
     * @description If True, all category Actions, Conditions, Expressions will not include in addon.
     */
    readonly inDevelopment?: boolean;
}

export type CategoryClassType = {
    readonly _id: string;
    readonly _name: string;
    readonly _isDeprecated: boolean;
    readonly _inDevelopment: boolean;

    readonly _actions: ActionEntity[];
    readonly _conditions: ConditionEntity[];
    readonly _expressions: ExpressionEntity[];
}


/**
 * **Creates collection of actions/conditions/expressions**
 * @param id Category id to indetify, must me unique for all addon.
 * @param name Category name that will be displayed in action/condition picker dialog.
 * @param opts *Optional*. Custom options.
 */
export function Category(id: string, name: string, opts?: ICategoryOptions ) {
    return function (target: any, context: ClassDecoratorContext) {
        target.prototype._id = id;
        target.prototype._name = name;
        if (name.length === 0) {
            target.prototype._name = id;
        }
        target.prototype._isDeprecated = opts?.isDeprecated || false;
        target.prototype._inDevelopment = opts?.inDevelopment || false;

        if (!target.prototype._actions) target.prototype._actions = [];
        if (!target.prototype._conditions) target.prototype._conditions = [];
        if (!target.prototype._expressions) target.prototype._expressions = [];
    }
}
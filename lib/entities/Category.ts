import type { LostAction } from "./Action.ts";
import type { LostCondition } from "./Condition.ts";
import type { LostExpression } from "./Expression.ts";

interface CategoryOptions {
    /**
     * Category id to indetify, must me unique for all addon.
     * @description By convention this is lowercase with dashes for separators
     * @example "my-category".
     */
    Id: string;
    /**
     * Category name that will be displayed in Construct 3.
     * @example "My Category"
     */
    Name: string;
    /**
     * Optional. Default is **False**. Deprecate all category Actions, Conditions, Expressions.
     * @description If True, all category Actions, Conditions, Expressions will mark as Deprecated.
     */
    Deprecated?: boolean;
    /**
     * Optional. Default is **False**. Remove all category Actions, Conditions, Expressions from addon.
     * @description If True, all category Actions, Conditions, Expressions will not include in addon.
     */
    InDevelopment?: boolean;
}

export type CategoryClassType = {
    Id: string;
    Name: string;
    Deprecated: boolean;
    InDevelopment: boolean;

    Actions: LostAction[];
    Conditions: LostCondition[];
    Expressions: LostExpression[];
}

export function Category(Options: CategoryOptions) {
    return function (target: Function, context: ClassDecoratorContext) {
        target.prototype['Id'] = Options.Id;
        target.prototype['Name'] = Options.Name;
        target.prototype['Deprecated'] = Options.Deprecated || false;
        target.prototype['InDevelopment'] = Options.InDevelopment || false;

        if (!target.prototype['Actions']) target.prototype['Actions'] = [];
        if (!target.prototype['Conditions']) target.prototype['Conditions'] = [];
        if (!target.prototype['Expressions']) target.prototype['Expressions'] = [];
    }
}
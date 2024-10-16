import type { LostAction } from "./Action.ts";
import type { LostCondition } from "./Condition.ts";
import type { LostExpression } from "./Expression.ts";

interface LostCategoryOptions {
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

export interface CategoryTarget {
    constructor: {
        prototype: LostCategoryBase
    }
}


export abstract class LostCategoryBase {
    readonly Id: string;
    readonly Name: string;

    readonly Deprecated: boolean;
    readonly InDevelopment: boolean;

    Actions: LostAction[] = [];
    Conditions: LostCondition[] = [];
    Expressions: LostExpression[] = [];

    constructor(Options: LostCategoryOptions) {
        const {Id, Name, Deprecated, InDevelopment } = Options;
        this.Id = Id;
        this.Name = Name;

        this.Deprecated = Deprecated || false;
        this.InDevelopment = InDevelopment || false;
    }
}

export function Category(Options: LostCategoryOptions): ClassDecorator {
    return function (BaseClass: any): any {
        return class extends LostCategoryBase {
            constructor() {
                super(Options)
                let prototype;
                if (BaseClass.prototype.Actions) {
                    prototype = BaseClass.prototype;
                } else {
                    prototype = Object.getPrototypeOf(BaseClass)
                }
                this.Actions = [...(prototype.Actions || [])];
                this.Conditions = [...(prototype.Conditions || [])];
                this.Expressions = [...(prototype.Expressions || [])];

            }
        }
    }
}
import type { Parameters } from "./parameter.ts";
import type { Aces } from "./ace.ts"

import { misc } from "../misc.ts";

export type CategoryConstructor<T extends Category = Category> = new () => T;

export type UserClass = {
    _$aces$_?: Array<Aces[keyof Aces]['klass']>;
    _$parameters$_?: Map<string, Array<Parameters[keyof Parameters]['klass']>>;
} & {
    [prop in any]: any;
};

export const IDENTIFIER = '_$lost$_';

export abstract class Category {
    /** Custom identifier for importing category file */
    static [IDENTIFIER] = true;
    
    readonly target: Constructor<UserClass>;
    readonly instance: InstanceType<Constructor<UserClass>>;


    readonly id: string;
    readonly name: string;

    readonly deprecated: boolean;
    readonly dev: boolean;

    readonly aces: Array<Aces[keyof Aces]['klass']> = [];

    actions() {
        return this.aces.filter(ace => ace.type === 'action');
    }

    conditions() {
        return this.aces.filter(ace => ace.type === 'condition');
    }

    expressions() {
        return this.aces.filter(ace => ace.type === 'expression');
    }

    constructor(
        target: Constructor<UserClass>,
        id?: string,
        opts?: Partial<Options>,
    ) {
        this.target = target;
        this.instance = new target();
        this.id = (id) ? misc.clearText(id) : target.name.toLowerCase();
        this.name = opts?.name || target.name;
        this.deprecated = opts?.deprecated || false
        this.dev = opts?.dev || false;

        if (this.instance._$aces$_) {
            for (const ace of this.instance._$aces$_) {
                ace.category = this;
                this.aces.push(ace);
                
                if (!this.instance._$parameters$_) continue;
                
                const parameters = this.instance._$parameters$_.get(ace.method.name);
                if (!parameters) continue;
                
                ace.parameters.push(...parameters.reverse());
                if (ace.type === 'action' || ace.type === 'condition') {
                    ace.displayText = ace.checkDisplayText(ace.displayText);
                }
            }
        }

        delete this.instance._$aces$_;
    }
}

type Options = {
    /** Category displayed name */
    readonly name?: string
    /**
     * *Optional*. Default is **False**. Deprecate all category Actions, Conditions, Expressions.
     * @description If True, all category Actions, Conditions, Expressions will mark as Deprecated.
    */
    readonly deprecated: boolean;
    /**
     * *Optional*. Default is **False**. Remove all category Actions, Conditions, Expressions from addon.
     * @description If True, all category Actions, Conditions, Expressions will not include in addon.
     */
    readonly dev: boolean;
}

export function category(id: string, opts?: Partial<Options>): Function {
    return function <Class extends Constructor<UserClass>>(
        target: Class,
        context: ClassDecoratorContext<Class>
    ) {
        return class extends Category {
            constructor() {
                super(target, id, opts);
            }
        }
    }
}
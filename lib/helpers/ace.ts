import type {
    IAction,
    ICondition,
    IExpression
} from "../addon/acesManager.ts";

import type {
    IAction as ILanguageAction,
    ICondition as ILanguageCondition,
    IExpression as ILanguageExpression
} from "../addon/languageManager.ts";

import type { Category, UserClass } from './category.ts';
import type { Parameters } from "./parameter.ts";

export type Aces = {
    'action': {
        klass: Action;
        opts: ActionOptions;
        method: ActionMethod;
        json: IAction;
        languageJson: ILanguageAction;
    };
    'condition': {
        klass: Condition;
        opts: ConditionOptions;
        method: ConditionMethod;
        json: ICondition;
        languageJson: ILanguageCondition;
    };
    'expression': {
        klass: Expression;
        opts: ExpressionOptions;
        method: ExpressionMethod;
        json: IExpression;
        languageJson: ILanguageExpression;
    };
}

export abstract class Ace<Type extends keyof Aces> {
    category!: Category;
    
    readonly type: Type;
    readonly method: Aces[Type]['method'];

    readonly id: string;
    readonly name: string;
    readonly desc?: string;

    readonly parameters: Array<Parameters[keyof Parameters]['klass']> = [];

    readonly deprecated?: boolean;
    readonly highlight?: boolean;

    constructor(
        type: Type,
        method: Aces[Type]['method'],
        id?: string,
        name?: string,
        desc?: string,
        deprecated?: boolean,
        highlight?: boolean
    ) {
        this.type = type;
        this.method = method;
        this.id = id || method.name.toLowerCase();
        this.name = name || method.name;
        this.desc = desc;
        this.deprecated = deprecated;
        this.highlight = highlight;
    }
}

type ActionMethod = (this: any, ...args: any[]) => void | Promise<void>;
type ActionOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly deprecated: boolean;
    readonly highlight: boolean;
    readonly displayText: string;
}

class Action extends Ace<'action'> {
    readonly displayText: string;

    get async() {
        if (this.method.constructor.name === 'AsyncFunction') {
            return true;
        } return undefined;
    }

    constructor(
        method: ActionMethod,
        opts?: Partial<Options>
    ) {
        super(
            'action',
            method,
            opts?.id,
            opts?.name,
            opts?.desc,
            opts?.deprecated,
            opts?.highlight
        );

        this.displayText = opts?.displayText || this.name;
    }
}

type ConditionMethod = (this: any, ...args: any[]) => boolean;
type ConditionOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly deprecated: boolean;
    readonly highlight: boolean;
    readonly displayText: string;
    /**
     * *Optional*. Default is **True**. Specifies a trigger condition.
     * @description This appears with an arrow in the event sheet. 
     * Instead of being evaluated every tick, triggers only run when they are explicity triggered by a runtime call.
     */
    readonly trigger: boolean;
    /**
     * *Optional*. Default is **False**. Specifies a fake trigger. 
     * @description This appears identical to a trigger in the event sheet, but is actually evaluated every tick. 
     * This is useful for conditions which are true for a single tick, such as for APIs which must poll a value every tick.
     */
    readonly fakeTrigger: boolean;
    /**
     * *Optional*. Default is **False**. Normally, the condition runtime method is executed once per picked instance. 
     * @description If the condition is marked static, the runtime method is executed once only, on the object type class. 
     * This means the runtime method must also implement the instance picking entirely itself, including respecting negation and OR blocks.
     */
    readonly static: boolean;
    /**
     * *Optional*. Default is **False**. Display an icon in the event sheet to indicate the condition loops. 
     * @description The condition method should use ILoopingConditionContext to implement its loop.
     * @link https://www.construct.net/en/make-games/manuals/construct-3/scripting/scripting-reference/addon-sdk-interfaces/iloopingconditioncontext
     */
    readonly looping: boolean;
    /**
     * *Optional*. Default is **true**. Allow the condition to be inverted in the event sheet.
     * @description Set to False to disable invert.
     */
    readonly invertible: boolean;
    /**
     * *Optional*. Default is **True**. Allow the condition to be used in the same branch as a trigger. 
     * @description Set to false if the condition does not make sense when used in a trigger, such as the Trigger once condition.
     */
    readonly compatibleWithTriggers: boolean;
};

class Condition extends Ace<'condition'> {
    readonly displayText: string;
    readonly trigger: boolean;
    readonly fakeTrigger?: boolean;
    readonly static?: boolean;
    readonly looping?: boolean;
    readonly invertible: boolean;
    readonly compatibleWithTriggers: boolean;

    constructor(
        method: ConditionMethod,
        opts?: Partial<ConditionOptions>
    ) {
        super(
            'condition',
            method,
            opts?.id,
            opts?.name,
            opts?.desc,
            opts?.deprecated,
            opts?.highlight
        );

        this.displayText = opts?.displayText || this.name;

        if (opts && typeof opts.trigger === 'boolean') {
            this.trigger = opts.trigger;
        } else {
            this.trigger = true;
        }

        this.fakeTrigger = opts?.fakeTrigger;
        this.static = opts?.static;
        this.looping = opts?.looping;

        if (opts && typeof opts.invertible === 'boolean') {
            this.invertible = opts.invertible;
        } else {
            this.invertible = true;
        }

        if (opts && typeof opts.compatibleWithTriggers === 'boolean') {
            this.compatibleWithTriggers = opts.compatibleWithTriggers;
        } else {
            this.compatibleWithTriggers = true;
        }
    }
}


type ExpressionMethod = (this: any, ...args: any[]) => string | number;
type ExpressionOptions = {
    readonly id: string;
    readonly name: string;
    readonly desc: string;
    readonly deprecated: boolean;
    readonly highlight: boolean;
    /**
     * *Optional*. Default is **any**. The runtime function must return the corresponding type, and "any" must still return either a number or a string.
     */
    readonly returnType: 'string' | 'number' | 'any';
    /**
     * *Optional*. Default is **False**. Allow the user to enter any number of parameters beyond those defined. 
     * @description In other words the parameters (if any) listed in "params" are required, but this flag enables adding further "any" type parameters beyond the end.
     */
    readonly variadicParameters: boolean;
};

class Expression extends Ace<'expression'> {
    readonly returnType: 'string' | 'number' | 'any';
    readonly variadicParameters?: boolean;

    constructor(
        method: ExpressionMethod,
        opts?: Partial<ExpressionOptions>
    ) {
        super(
            'expression',
            method,
            opts?.id,
            opts?.name,
            opts?.desc,
            opts?.deprecated,
            opts?.highlight
        );

        this.returnType = opts?.returnType || 'any';
        this.variadicParameters = opts?.variadicParameters || false;
    }
}

type Options = {
    readonly id: string;
    readonly name: string;
    readonly displayText: string;
    readonly desc: string;
    /**
     * *Optional*. Default is **False**. Set to true to mark as deprecated.
     */
    readonly deprecated: boolean;
    /**
     * *Optional*. Default is **False**.
     * Set to true to highlight the ACE in the condition/action/expression picker dialogs. 
     */
    readonly highlight: boolean;
}

export function ace<Type extends keyof Aces>(
    type: Type,
    opts?: Partial<Options & Aces[Type]['opts']>
) {
    return function (
        method: Aces[Type]['method'],
        context: ClassMethodDecoratorContext<any>
    ) {
        context.addInitializer(function (this: UserClass) {
            if (!this._$aces$_) this._$aces$_ = [];

            if (type === 'action') {
                const actionOpts = opts as Partial<Options & ActionOptions>;

                this._$aces$_.push(
                    new Action(method as Aces['action']['method'], actionOpts)
                );
            } else if (type === 'condition') {
                const conditionOpts = opts as Partial<Options & ConditionOptions>;

                this._$aces$_.push(
                    new Condition(method as Aces['condition']['method'], conditionOpts)
                );
            } else if (type === 'expression') {
                const expressionOpts = opts as Partial<Options & ExpressionOptions>;

                this._$aces$_.push(
                    new Expression(method as Aces['expression']['method'], expressionOpts)
                );
            }
        });
    }
}
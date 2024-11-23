import { ActionV2 } from '../lib/entities/Action.ts';
import { Category, Action, Condition, Expression } from '../mod.ts';
import type { Instance } from './Instance.ts';


Category({ Id: '', Name: '' })
export default class MyCategory {

    @ActionV2('', '')

    @Condition({
        Id: `onCondition`,
        Name: ``,
        DisplayText: ``,
        Description: ``,
        IsTrigger: true
    })
    onCondition(this: Instance) { return true };


    @Expression({
        Id: `Expression`,
        Name: `Expression`,
        Description: ``,
        ReturnType: 'string'
    })
    Expression(this: Instance) {
        return  ''
    };
}
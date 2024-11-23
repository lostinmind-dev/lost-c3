
import { Action, Category, Condition } from '../mod.ts';
import type { Instance } from './Instance.ts';

function ParamDecorator() {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        console.log(`Decorated parameter in ${String(propertyKey)} at position ${parameterIndex}`);
    };
}

@Category({Id: 'Name', Name: 'Test'})
export default class Test {
    @Action({
        Id: '',
        Name: '',
        DisplayText: ''
    })
    doAction(this: Instance) {
        // console.log('test')
        // this.test
    };

    @Condition({
        Id: `onCondition`,
        Name: ``,
        DisplayText: ``,
        Description: ``,
        IsTrigger: true
    })
    onCondition() {
        
    };
}
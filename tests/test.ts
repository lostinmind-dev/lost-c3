import { Action, Category, Condition } from '../mod.ts';
import type { Instance } from './Instance.ts';

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
    onCondition(this: Instance, test: string) {
        
    };
}

const C = new Test();
console.log(C.constructor.prototype)
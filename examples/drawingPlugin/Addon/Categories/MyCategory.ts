import { Category, Action, Condition, Expression, addParam, Param } from "../../../../mod.ts";
import type { Instance } from "../Instance.ts";


@Category('id1', 'name')
export default class {
    
    @Action('test', '', '', {
        params: [
            addParam('1', '', { type: Param.String, autocompleteId: 'test1' })
        ],
        isAsync: true
    })
    doAction(): void {
        console.log('hello')
        console.log('hello')
    }

    @Condition('myId', '', '', {
        isTrigger: true,
        params: [
            addParam('test', 'test2112', {
                type: Param.String,
                autocompleteId: 'test1'
            })

        ]
    })
    onCondition(this: Instance): boolean {
        return false;
    }

    @Condition('myId2', '', '', {
        isTrigger: true,
        params: [
            addParam('test', 'test2112', {
                type: Param.String,
                autocompleteId: 'test1'
            })

        ]
    })
    onCondition1(this: Instance): boolean {
        return false;
    }

    @Expression('id1', '')
    GetValue(): string | number {
        return 2
    }
}
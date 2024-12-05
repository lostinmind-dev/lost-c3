import { Category, Action, Condition, Expression, addParam, Param } from "../../../../mod.ts";
import type { Instance } from "../Instance.ts";


type ComboItemsCollection = ['id1', 'id2', 'hello', 'test', 'test1'];

@Category<CategoriesCollection>('main', 'name')
export default class {

    @Action('test', '', '', {
        params: [
            addParam('1', '', { type: Param.String, initialValue: '' }),
            addParam<ComboItemsCollection>('2', '', { type: Param.Combo, items: [['hello', 'Test'], ['id2', 'Test 2']], initialValue: 'id1' })
        ],
        isAsync: true
    })
    doAction(): void {
        console.log('hello')
        console.log('hello')
        console.log('hello')
        // console.log('hello')
        console.log('hello')
    }

    @Condition('myId', '', '', {
        isTrigger: true
    })
    onCondition(this: number): boolean {
        return true;
    }

    @Expression('id1', '', {
        params: [
            addParam('', '', { type: Param.Animation })
        ]
    })
    GetValue(this: string): string | number {
        return 2
    }
}
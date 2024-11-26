import { Category, Action, Condition, Expression, addParam, Param } from "../../../../mod.ts";
import type { Instance } from "../Instance.ts";


@Category('id1', 'name')
export default class {
    
    @Action('test', '', '', {
        params: [
            addParam('te', '', { type: Param.String }),
            addParam('te1', '', { type: Param.String })
        ],
        isAsync: true
    })
    doAction(): void {
        /**
         * 
         */
    }

    @Condition('myId', '', '', {
        isTrigger: true
    })
    onCondition(this: Instance): boolean {
        return false;
    }

    @Expression('id1', '')
    Expre(): string | number {
        return 2
    }
}
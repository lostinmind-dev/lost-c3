import { action } from "../../../../lib/entities/action.ts";
import { category } from "../../../../lib/entities/category.ts";
import { condition } from "../../../../lib/entities/condition.ts";
import { expression, ExpressionReturnType } from "../../../../lib/entities/expression.ts";
import { Param, param } from "../../../../lib/entities/parameter.ts";
import type { Instance } from "../Instance.ts";


@category('id', 'name')
export default class {
    
    @action('', '', '', {
        params: [
            param('a', 'a',{ type: Param.Number })
        ]
    })
    doAction(): void {
        /**
         * 
         */
    }

    @condition('', '', '', {
        isTrigger: true
    })
    onCondition(this: Instance): boolean {
        return false;
    }

    @expression('')
    Expre(): string | number {
        return 2
    }
}
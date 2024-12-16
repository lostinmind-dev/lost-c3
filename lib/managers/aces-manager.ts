// deno-lint-ignore-file no-case-declarations
import type {
    AcesJSON, AceParameter, AceStringParameter, AceBooleanParameter,
    AceComboParameter, AceObjectParameter, AceCategory, AceAction,
    AceCondition, AceExpression
} from "../../shared/types/json/aces.ts";
import { Param } from "../entities/parameter.ts";
import type { ActionEntity } from "../entities/action.ts";
import type { ICategory } from "../entities/category.ts";
import type { ConditionEntity } from "../entities/condition.ts";
import type { ExpressionEntity } from "../entities/expression.ts";
import type { Parameter } from "../entities/parameter.ts";
import { LostAddonProject } from "../lost.ts";

export abstract class AcesManager {

    static create(): AcesJSON {
        const aces: AcesJSON = {} as AcesJSON;

        LostAddonProject.addon._categories.forEach(c => {
            aces[c._id] = this.#createCategory(c);
        });

        return aces;
    }

    static #createParameter(parameter: Parameter): AceParameter {
        const aceParameter: AceParameter = {} as AceParameter;

        aceParameter['id'] = parameter._id;
        aceParameter['type'] = parameter._opts.type;

        switch (parameter._opts.type) {
            case Param.Number:
                aceParameter['initialValue'] = (parameter._opts.initialValue) ? String(parameter._opts.initialValue) : '';
                break;
            case Param.String:
                const p = aceParameter as AceStringParameter;
                p['initialValue'] = (parameter._opts.initialValue) ? `"${String(parameter._opts.initialValue)}"` : "";
                p['autocompleteId'] = parameter._opts.autocompleteId;
                break;
            case Param.Any:
                if (parameter._opts.initialValue) {
                    if (typeof parameter._opts.initialValue === 'string') {
                        aceParameter['initialValue'] = `"${String(parameter._opts.initialValue)}"`;
                    } else if (typeof parameter._opts.initialValue === 'number') {
                        aceParameter['initialValue'] = String(parameter._opts.initialValue);
                    }
                } else {
                    aceParameter['initialValue'] = '';
                }
                break;
            case Param.Boolean:
                const b = aceParameter as AceBooleanParameter;
                if (typeof parameter._opts.initialValue === 'boolean') {
                    switch (parameter._opts.initialValue) {
                        case true:
                            b['initialValue'] = 'true';
                            break;
                        default:
                            b['initialValue'] = 'false';
                            break;
                    }
                } else {
                    b['initialValue'] = 'false';
                }
                break;
            case Param.Combo:
                const c = aceParameter as AceComboParameter;
                const items = parameter._opts.items.map(item => item[0]);

                c['items'] = items;

                if (parameter._opts.initialValue) {
                    if (items.includes(parameter._opts.initialValue)) {
                        c['initialValue'] = parameter._opts.initialValue;
                    } else {
                        c['initialValue'] = items[0];
                    }
                } else {
                    c['initialValue'] = items[0];
                }
                break;
            case Param.Object:
                const o = aceParameter as AceObjectParameter;

                o['allowedPluginIds'] = parameter._opts.allowedPluginIds
                break
            // case Param.ComboGrouped:
            //     const cg = aceParameter as AceComboGroupedParameter;

            //     const itemGroups = parameter._opts.groups.map(group => {
            //         return {
            //             id: group.id,
            //             items: group.items.map(item => item[0])
            //         }
            //     })
            //     cg['itemGroups'] = itemGroups;
            //     break;
        }

        return aceParameter;
    }

    static #createCategory(category: ICategory): AceCategory {
        const aceCategory: AceCategory = {} as AceCategory;

        aceCategory['actions'] = [...category._actions.map(e => this.#createAction(e))],
            aceCategory['conditions'] = [...category._conditions.map(e => this.#createCondition(e))],
            aceCategory['expressions'] = [...category._expressions.map(e => this.#createExpression(e))]

        return aceCategory;
    }


    static #createAction(entity: ActionEntity): AceAction {
        const aceEntity: AceAction = {} as AceAction;

        aceEntity['id'] = entity._id;
        aceEntity['scriptName'] = entity._func.name;
        aceEntity['highlight'] = entity._opts?.highlight;
        aceEntity['isDeprecated'] = entity._opts?.isDeprecated;
        aceEntity['isAsync'] = entity._opts?.isAsync;

        if (entity._params.length > 0) {
            aceEntity['params'] = [...entity._params.map(p => this.#createParameter(p))];
        }

        return aceEntity;
    }

    static #createCondition(entity: ConditionEntity): AceCondition {
        const aceEntity: AceCondition = {} as AceCondition;

        aceEntity['id'] = entity._id;
        aceEntity['scriptName'] = entity._func.name;
        aceEntity['highlight'] = entity._opts?.highlight;
        aceEntity['isDeprecated'] = entity._opts?.isDeprecated;
        aceEntity['isTrigger'] = entity._opts?.isTrigger || true;
        aceEntity['isFakeTrigger'] = entity._opts?.isFakeTrigger;
        aceEntity['isStatic'] = entity._opts?.isStatic;
        aceEntity['isLooping'] = entity._opts?.isLooping;
        aceEntity['isInvertible'] = entity._opts?.isInvertible || true;
        aceEntity['isCompatibleWithTriggers'] = entity._opts?.isCompatibleWithTriggers || true;

        if (entity._params.length > 0) {
            aceEntity['params'] = [...entity._params.map(p => this.#createParameter(p))];
        }

        return aceEntity;
    }

    static #createExpression(entity: ExpressionEntity): AceExpression {
        const aceEntity: AceExpression = {} as AceExpression;

        aceEntity['id'] = entity._id;
        aceEntity['expressionName'] = entity._func.name;
        aceEntity['highlight'] = entity._opts?.highlight;
        aceEntity['isDeprecated'] = entity._opts?.isDeprecated;
        aceEntity['returnType'] = entity._opts?.returnType || 'any';
        aceEntity['isVariadicParameters'] = entity._opts?.isVariadicParameters;

        if (entity._params.length > 0) {
            aceEntity['params'] = [...entity._params.map(p => this.#createParameter(p))];
        }

        return aceEntity;
    }
}
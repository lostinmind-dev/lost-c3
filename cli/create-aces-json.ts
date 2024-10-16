import type { LostCategoryBase } from "../lib/entities.ts";
import type { AcesJSON, AceAction, AceCondition, AceExpression, AceParam } from "../lib/json.ts";

import { BUILD_PATH } from "./paths.ts";

export async function createAcesJSON(categories: LostCategoryBase[]) {
    const AcesJSON = {} as AcesJSON;

    categories.forEach(category => {
        AcesJSON[category.Id] = {
            'actions': [],
            'conditions': [],
            'expressions': []
        }

        category['Actions'].forEach(action => {
            const {Id, Options, Params} = action;
            const {ScriptName, Highlight, Deprecated, IsAsync} = Options;
            const AceAction = {} as AceAction;
            AceAction['id'] = Id;
            AceAction['scriptName'] = ScriptName;
            AceAction['highlight'] = Highlight;
            AceAction['isDeprecated'] = Deprecated;
            AceAction['isAsync'] = IsAsync;
            AceAction['params'] = [];
            Params.forEach(param => {
                const {Type, Id, InitialValue} = param.Options;
                const AceParam = {} as AceParam;
                AceParam['id'] = Id;
                AceParam['type'] = Type;
                AceParam['initialValue'] = InitialValue as string;
                if (Type === 'string') AceParam['autocompleteId'] = param.Options.AutocompleteId;
                if (Type === 'combo') {
                    const paramItems = param.Options.Items.map(item => item[0]);
                    AceParam['items'] = paramItems;
                }
                if (Type === 'object') AceParam['allowedPluginIds'] = param.Options.AllowedPluginIds;
                AceAction['params'].push(AceParam);
            })
            if (category.Deprecated) AceAction['isDeprecated'] = true;
            AcesJSON[category.Id]['actions'].push(AceAction);
        })

        category['Conditions'].forEach(condition => {
            const {Id, Options, Params} = condition;
            const {
                ScriptName, Highlight, Deprecated, 
                IsTrigger, IsFakeTrigger, IsStatic, IsLooping,
                IsInvertible, IsCompatibleWithTriggers
            } = Options;
            const AceCondition = {} as AceCondition;
            AceCondition['id'] = Id;
            AceCondition['scriptName'] = ScriptName;
            AceCondition['highlight'] = Highlight;
            AceCondition['isDeprecated'] = Deprecated;
            AceCondition['isTrigger'] = IsTrigger;
            AceCondition['isFakeTrigger'] = IsFakeTrigger;
            AceCondition['isStatic'] = IsStatic;
            AceCondition['isLooping'] = IsLooping;
            AceCondition['isInvertible'] = IsInvertible;
            AceCondition['isCompatibleWithTriggers'] = IsCompatibleWithTriggers;

            Params.forEach(param => {
                const {Type, Id, InitialValue} = param.Options;
                const AceParam = {} as AceParam;
                AceParam['id'] = Id;
                AceParam['type'] = Type;
                AceParam['initialValue'] = InitialValue as string;
                if (Type === 'string') AceParam['autocompleteId'] = param.Options.AutocompleteId;
                if (Type === 'combo') {
                    const paramItems = param.Options.Items.map(item => item[0]);
                    AceParam['items'] = paramItems;
                }
                if (Type === 'object') AceParam['allowedPluginIds'] = param.Options.AllowedPluginIds;
                AceCondition['params'].push(AceParam);
            })
            if (category.Deprecated) AceCondition['isDeprecated'] = true;
            AcesJSON[category.Id]['conditions'].push(AceCondition);
        })

        category['Expressions'].forEach(expression => {
            const {Id, Options, Params} = expression;
            const {ScriptName, Highlight, Deprecated, ReturnType, IsVariadicParameters} = Options;
            const AceExpression = {} as AceExpression;
            AceExpression['id'] = Id;
            AceExpression['expressionName'] = ScriptName;
            AceExpression['highlight'] = Highlight;
            AceExpression['isDeprecated'] = Deprecated;
            AceExpression['returnType'] = ReturnType;
            AceExpression['isVariadicParameters'] = IsVariadicParameters;

            Params.forEach(param => {
                const {Type, Id, InitialValue} = param.Options;
                const AceParam = {} as AceParam;
                AceParam['id'] = Id;
                AceParam['type'] = Type;
                AceParam['initialValue'] = InitialValue as string;
                if (Type === 'string') AceParam['autocompleteId'] = param.Options.AutocompleteId;
            })
            if (category.Deprecated) AceExpression['isDeprecated'] = true;
            AcesJSON[category.Id]['expressions'].push(AceExpression);
        })
    })

    await Deno.writeTextFile(`${BUILD_PATH}/aces.json`, JSON.stringify(AcesJSON, null, 4));
}
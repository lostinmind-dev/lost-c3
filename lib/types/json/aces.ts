import type { ExpressionReturnType } from "../../entities/expression.ts";
import type { Parameter } from "../../entities/parameter.ts";


export type AcesJSON = {
    [categoryId: string]: AceCategory;
}

export type AceCategory = {
    "actions": AceAction[];
    "conditions": AceCondition[];
    "expressions": AceExpression[];
}

type AceBase = {
    "id": string;
    "isDeprecated"?: boolean;
    "highlight"?: boolean;
    "params"?: AceParameter[];
}
/** Ace Action */

export type AceAction = {
    "scriptName": string;
    "isAsync"?: boolean;
} & AceBase;

export type AceCondition = {
    "scriptName": string;
    "isTrigger"?: boolean;
    "isFakeTrigger"?: boolean;
    "isStatic"?: boolean;
    "isLooping"?: boolean;
    "isInvertible"?: boolean;
    "isCompatibleWithTriggers"?: boolean;
} & AceBase;


export type AceExpression = {
    "expressionName": string;
    "returnType": ExpressionReturnType;
    "isVariadicParameters"?: boolean;
} & AceBase;

export type AceParameter =
    | AceParameterBase
    | AceStringParameter
    | AceBooleanParameter
    | AceComboParameter
    | AceObjectParameter
    | AceComboGroupedParameter
    ;

type AceParameterBase = {
    "id": string;
    "type": Parameter;
    "initialValue"?: string;
}

export type AceStringParameter = {
    "type": Parameter.String;
    "autocompleteId"?: string;
} & AceParameterBase

export type AceBooleanParameter = {
    "type": Parameter.Boolean;
    "initialValue"?: 'true' | 'false';
} & AceParameterBase

export type AceComboParameter = {
    "type": Parameter.Combo;
    "items": string[];
} & AceParameterBase

export type AceObjectParameter = {
    "type": Parameter.Object;
    "allowedPluginIds"?: string[];
} & AceParameterBase

export type AceComboGroupedParameter = {
    // "type": Parameter.ComboGrouped;
    // "itemGroups": {
    //     id: string;
    //     items: string[];
    // }[];
} & AceParameterBase
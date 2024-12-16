import type { ExpressionReturnType } from "../../../lib/entities/expression.ts";
import type { Param } from "../../../lib/entities/parameter.ts";

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
    "type": Param;
    "initialValue"?: string;
}

export type AceStringParameter = {
    "type": Param.String;
    "autocompleteId"?: string;
} & AceParameterBase

export type AceBooleanParameter = {
    "type": Param.Boolean;
    "initialValue"?: 'true' | 'false';
} & AceParameterBase

export type AceComboParameter = {
    "type": Param.Combo;
    "items": string[];
} & AceParameterBase

export type AceObjectParameter = {
    "type": Param.Object;
    "allowedPluginIds"?: string[];
} & AceParameterBase

export type AceComboGroupedParameter = {
    // "type": Param.ComboGrouped;
    // "itemGroups": {
    //     id: string;
    //     items: string[];
    // }[];
} & AceParameterBase
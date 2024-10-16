import type { ParamType } from "../params/Params.ts";

export interface AcesJSON {
    [categoryName: string]: {
        "actions": AceAction[];
        "conditions": AceCondition[];
        "expressions": AceExpression[];
    }
}

interface AceBase {
    "id": string;
    "isDeprecated": boolean;
    "highlight": boolean;
    "params": AceParam[];
}

export interface AceParam {
    "id": string;
    "type": ParamType;
    "initialValue": string;
    "items"?: string[];
    "allowedPluginIds"?: string[];
    "autocompleteId"?: boolean;
}

export interface AceAction extends AceBase {
    "scriptName": string;
    "isAsync": boolean;
}

export interface AceCondition extends AceBase {
    "scriptName": string;
    "isTrigger": boolean;
    "isFakeTrigger"?: boolean;
    "isStatic"?: boolean;
    "isLooping"?: boolean;
    "isInvertible"?: boolean;
    "isCompatibleWithTriggers"?: boolean;
}

export interface AceExpression extends AceBase {
    "expressionName": string;
    "returnType": "number" | "string" | "any";
    "isVariadicParameters"?: boolean;
}
import type { Param } from '../lib/entities/parameter.ts';
import type { AddonType } from '../lib/config.ts';

export type EntityCollection = {
    [key: string]: Function;
}

export type AddonJson = {
    "supports-worker-mode"?: boolean;
    "min-construct-version"?: string;
    "is-c3-addon": true;
    "sdk-version": 2;
    "type": AddonType;
    "name": string;
    "id": string;
    "version": string;
    "author": string;
    "website": string;
    "documentation": string;
    "description": string;
    "editor-scripts": string[];
    "file-list": string[];
}

export type AcesJson = {
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

export type AceParam = {
    "id": string;
    "type": Param;
    "initialValue": string;
    "items"?: string[];
    "allowedPluginIds"?: string[];
    "autocompleteId"?: string;
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

export type LanguageJson = {
    "languageTag": 'en-US',
    "fileDescription": string;
    "text": {
        "behaviors": {
            [addonId: string]: {
                "name": string;
                "description": string;
                "help-url": string;
                "properties": {
                    [propertyId: string]: LanguagePluginProperty;
                },
                "aceCategories": {
                    [categoryId: string]: string;
                },
                "conditions": {
                    [conditionId: string]: LanguageCondition;
                },
                "actions": {
                    [actionId: string]: LanguageAction;
                },
                "expressions": {
                    [expressionId: string]: LanguageExpression;
                }
            }
        },
        "plugins": {
            [addonId: string]: {
                "name": string;
                "description": string;
                "help-url": string;
                "properties": {
                    [propertyId: string]: LanguagePluginProperty;
                },
                "aceCategories": {
                    [categoryId: string]: string;
                },
                "conditions": {
                    [conditionId: string]: LanguageCondition;
                },
                "actions": {
                    [actionId: string]: LanguageAction;
                },
                "expressions": {
                    [expressionId: string]: LanguageExpression;
                }
            }
        }
    }
};

export interface LanguageParam {
    "name": string;
    "desc": string
    "items"?: {
        [itemId: string]: string;
    };
}

export interface LanguageCondition {
    /**
     * @description
     * the name that appears in the condition/action picker dialog.
     */
    "list-name": string;
    /**
     * @description
     * the text that appears in the event sheet. 
     * You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders.
     * (There must be one parameter placeholder per parameter.)
     * For behaviors only, the placeholder {my} is substituted for the behavior name and icon.
     */
    "display-text": string;
    /**
     * @description
     * a description of the action or condition, which appears as a tip at the top of the condition/action picker dialog.
     */
    "description": string;
    "params": {
        [paramId: string]: LanguageParam;
    };
}

export interface LanguageAction {
    /**
     * @description
     * the name that appears in the condition/action picker dialog.
     */
    "list-name": string;
    /**
     * @description
     * the text that appears in the event sheet. 
     * You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders.
     * (There must be one parameter placeholder per parameter.)
     * For behaviors only, the placeholder {my} is substituted for the behavior name and icon.
     */
    "display-text": string;
    /**
     * @description
     * a description of the action or condition, which appears as a tip at the top of the condition/action picker dialog.
     */
    "description": string;
    "params": {
        [paramId: string]: LanguageParam;
    };
}

export interface LanguageExpression {
    /**
     * @description
     * the description that appears in the expressions dictionary, which lists all available expressions.
     */
    "description": string;
    /**
     * @description
     * the translated name of the expression name. 
     * In the en-US file, this should simply match the expression name from the expression definition. 
     * This key mainly exists so it can be changed in other languages, making it possible to translate expressions in some contexts. 
     * Note when actually typing an expression the non-translated expression name must always be used.
     */
    "translated-name": string;
    "params": {
        [paramId: string]: LanguageParam;
    };
}

export interface LanguagePluginProperty {
    "name": string;
    "desc": string;
    "items"?: {
        [itemId: string]: string;
    };
    "link-text"?: string;
}
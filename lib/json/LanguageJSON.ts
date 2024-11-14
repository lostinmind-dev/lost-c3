// deno-lint-ignore-file no-namespace
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
}

export interface LanguageEffectParameter {
    "name": string;
    "desc": string;
}

export namespace LanguageJSON {
    export interface Plugin {
        "languageTag": "en-US",
        "fileDescription": string;
        "text": {
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
    }

    export interface Behavior {
        "languageTag": "en-US",
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
            }
        }
    }

    export interface Theme {
        "languageTag": "en-US",
        "fileDescription": string;
        "text": {
            "themes": {
                [addonId: string]: {
                    "name": string;
                    "description": string;
                    "help-url": string;
                }
            }
        }
    }

    export interface Effect {
        "languageTag": "en-US",
        "fileDescription": string;
        "text": {
            "effects": {
                [addonId: string]: {
                    "name": string;
                    "description": string;
                    "parameters": {
                        [parameterId: string]: LanguageEffectParameter
                    };
                }
            }
        }
    }
}
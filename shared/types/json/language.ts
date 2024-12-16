export type LanguageJSON = {
    "languageTag": string;
    "fileDescription": string;
    "text": {
        [key in 'plugins' | 'behaviors']: {
            [id: string]: {
                "name": string;
                "description": string;
                "properties": LanguagePropertiesCollection,
                "help-url": string;
                "aceCategories": LanguageAceCategoriesCollection,
                "conditions": LanguageConditionsCollection,
                "actions": LanguageActionsCollection,
                "expressions": LanguageExpressionsCollection
            }
        }
    }
}

export type LanguageActionsCollection = {
    [id: string]: LanguageAction;
}

export type LanguageConditionsCollection = {
    [id: string]: LanguageCondition;
}

export type LanguageExpressionsCollection = {
    [id: string]: LanguageExpression;
}

export type LanguageAceCategoriesCollection = {
    [id: string]: string;
}

export type LanguagePropertiesCollection = {
    [id: string]: LanguageProperty;
};

/** Plugin Property */
export type LanguageProperty =
    | LanguagePropertyBase
    | LanguageComboProperty
    | LanguageLinkProperty
    ;

type LanguagePropertyBase = {
    "name": string;
    "desc": string;
}

export type LanguageComboProperty = {
    "items": {
        [id: string]: string;
    }
} & LanguagePropertyBase;

export type LanguageLinkProperty = {
    "link-text": string;
} & LanguagePropertyBase

/** ACEs */
export type LanguageCondition = {
    "list-name": string;
    "display-text": string;
    "description": string;
    "params"?: AceParametersCollection;
}

export type LanguageAction = {
    "list-name": string;
    "display-text": string;
    "description": string;
    "params"?: AceParametersCollection;
}

export type LanguageExpression = {
    "translated-name": string;
    "description": string;
    "params"?: AceParametersCollection;
}

/** Ace Parameter */
export type LanguageAceParameter =
    | LanguageAceParameterBase
    | LanguageAceComboParameter
    | LanguageAceComboGroupedParameter
    ;

export type AceParametersCollection = {
    [id: string]: LanguageAceParameter
}

type LanguageAceParameterBase = {
    "name": string;
    "desc": string;
}

export type LanguageAceComboParameter = {
    "items": {
        [id: string]: string;
    }
} & LanguageAceParameterBase;

export type LanguageAceComboGroupedParameter = {
    "itemGroups": {
        [id: string]: {
            "name": string;
            "items": {
                [id: string]: string;
            }
        }
    }
} & LanguageAceParameterBase
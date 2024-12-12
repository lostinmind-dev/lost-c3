import type { AddonType } from "../lib/config.ts";
import { EntityType } from "../lib/entities/entity.ts";
import type { ExpressionReturnType } from "../lib/entities/expression.ts";
import type { Param } from "../lib/entities/parameter.ts";

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


export type AddonJSON = {
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
};

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
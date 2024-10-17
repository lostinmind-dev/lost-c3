export enum ErrorMessage {
    CATEGORY_ID_EMPTY = `'Id' field in the category must not be empty!`,
    CATEGORY_NAME_EMPTY = `'Name' field in the category must not be empty!`,
    CATEGORY_ID_DUPLICATED = `Categories with the same 'Id' was detected`,

    ACTIONS_ID_DUPLICATED = `Actions with the same 'Id' was detected!`,
    CONDITIONS_ID_DUPLICATED = `Conditions with the same 'Id' was detected!`,
    EXPRESSIONS_ID_DUPLICATED = `Expressions with the same 'Id' was detected!`,

    ACTION_ID_EMPTY = `Action 'Id' field must not be empty!`,
    ACTION_NAME_EMPTY = `Action 'Name' field must not be empty!`,
    ACTION_DISPLAY_TEXT_EMPTY = `Action 'DisplayText' field must not be empty!`,
    ACTION_DISPLAY_TEXT_SHOULD_CONTAIN_PLACEHOLDERS = `Action 'DisplayText' field must contain a placeholder for each parameter!`,

    CONDITION_ID_EMPTY = `Condition 'Id' field must not be empty!`,
    CONDITION_NAME_EMPTY = `Condition 'Name' field must not be empty!`,
    CONDITION_DISPLAY_TEXT_EMPTY = `Condition 'DisplayText' field must not be empty!`,
    CONDITION_DISPLAY_TEXT_SHOULD_CONTAIN_PLACEHOLDERS = `Condition 'DisplayText' field must contain a placeholder for each parameter!`,

    EXPRESSION_ID_EMPTY = `Expression 'Id' field must not be empty!`,
    EXPRESSION_NAME_EMPTY = `Expression 'Name' field must not be empty!`,
}

export enum WarningMessage {
    ICON_NOT_DETECTED_OR_WRONG_FORMAT = `Addon icon was not detected or it has wrong format. (Set to default icon)`,
    CATEGORY_DEPRECATED = `Сategory has Deprecated mode enabled. All Actions/Conditions/Expressions will not be available but added to the addon!`,
    CATEGORY_IN_DEVELOPMENT = `Сategory has InDevelopment mode enabled. All Actions/Conditions/Expressions was not added to the addon!`
}
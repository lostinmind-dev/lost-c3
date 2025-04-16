export type BehaviorInfo = {
    /**
     * The category for the behavior when displaying it in the Add behavior dialog.
     * @example 'general'
     */
    readonly category: BehaviorCategories[number];
    /**
     * *Optional*. Default is ***False***. Set a boolean of whether the behavior is allowed to be added more than once to the same object.
     * @description The default is false, which means the behavior can be added multiple times to the same object.
     * Set to true to only allow it to be added once to each object.
     */
    readonly onlyOneAllowed?: boolean;
};

type BehaviorCategories = [
    'attributes',
    'general',
    'movements',
    'other',
];
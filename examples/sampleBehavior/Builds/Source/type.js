const Lost = {"addonId":"LostPluginId"};
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors[Lost.addonId];

BEHAVIOR_CLASS.Type = class LostBehaviorType extends SDK.IBehaviorTypeBase {
    constructor(sdkBehavior, iBehaviorType) {
        super(sdkBehavior, iBehaviorType);
    }
};
export {};
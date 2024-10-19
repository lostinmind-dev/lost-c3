const ADDON_ID = "";
const SDK = globalThis.SDK;
const BEHAVIOR_CLASS = SDK.Behaviors[ADDON_ID];
BEHAVIOR_CLASS.Type = class LostBehaviorType extends SDK.IBehaviorTypeBase {
    constructor(sdkBehavior, iBehaviorType) {
        super(sdkBehavior, iBehaviorType);
    }
};
export {};
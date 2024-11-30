const Lost = {"addonId":"LostPluginId"};
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors[Lost.addonId];

BEHAVIOR_CLASS.Instance = class LostBehaviorInstance extends SDK.IBehaviorInstanceBase {
    constructor(sdkBehType, behInst) {
        super(sdkBehType, behInst);
    }
};
export {};
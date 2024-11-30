const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;
C3.Behaviors[Lost.addonId].Type = class LostBehaviorType extends globalThis.ISDKBehaviorTypeBase {
    constructor() {
        super();
    }
    _onCreate() { }
};

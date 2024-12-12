const Lost = {"addonId":"LostPluginId"};
class LostBehaviorInstance extends globalThis.ISDKBehaviorInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Behaviors[Lost.addonId].Cnds;
    }
    _release() {
        super._release();
    }
}
export {};

globalThis.C3.Behaviors["LostPluginId"].Instance = LostBehaviorInstance;
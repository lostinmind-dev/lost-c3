const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;
class LostInstance extends globalThis.ISDKInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Plugins[Lost.addonId].Cnds;
    }
    _release() {
        super._release();
    }
}
C3.Plugins[Lost.addonId].Instance = LostInstance;
export {};

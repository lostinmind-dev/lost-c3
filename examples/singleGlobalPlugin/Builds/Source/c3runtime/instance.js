const C3 = globalThis.C3;
class Instance extends globalThis.ISDKInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Plugins[Lost.addonId].Cnds;
    }
    _release() {
        super._release();
    }
}
export {};

globalThis.C3.Plugins["LostPluginId"].Instance = Instance;
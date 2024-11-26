const Lost = {"addonId":"LostPluginId"};
const C3 = globalThis.C3;
C3.Plugins[Lost.addonId].Type = class LostType extends globalThis.ISDKObjectTypeBase {
    constructor() {
        super();
    }
    _onCreate() { }
};
export {};

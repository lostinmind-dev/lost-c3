const Lost = {"addonId":"LostPluginId"};
import { GPUResourceManager } from './modules/index.js';
class Instance extends globalThis.ISDKInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Plugins[Lost.addonId].Cnds;
        console.log(GPUResourceManager);
    }
    _release() {
        super._release();
    }
}

globalThis.C3.Plugins["LostPluginId"].Instance = Instance;
const Lost = {"addonId":"LostPluginId"};
import { GPUResourceManager } from './modules/index.js';
const C3 = globalThis.C3;
const a = new GPUResourceManager();
console.log(a);
class Instance extends globalThis.ISDKInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Plugins[Lost.addonId].Cnds;
    }
    _release() {
        super._release();
    }
}
C3.Plugins[Lost.addonId].Instance = Instance;

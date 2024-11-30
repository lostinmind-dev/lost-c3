const Lost = {"addonId":"LostPluginId"};
import { GPUResourceManager } from './modules/index.js';
const C3 = globalThis.C3;
const a = new GPUResourceManager();
console.log(a);
class LostBehaviorInstance extends globalThis.ISDKBehaviorInstanceBase {
    constructor() {
        super();
        this.Conditions = C3.Plugins[Lost.addonId].Cnds;
    }
    _release() {
        super._release();
    }
}
C3.Behaviors[Lost.addonId].Instance = LostBehaviorInstance;

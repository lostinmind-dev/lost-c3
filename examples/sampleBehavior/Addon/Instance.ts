import { GPUResourceManager } from "./Modules/index.ts";

const C3 = globalThis.C3;

const a = new GPUResourceManager();

console.log(a)

class LostBehaviorInstance extends globalThis.ISDKBehaviorInstanceBase<IWorldInstance> {

    readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

    constructor() {
        super();

        const properties = this._getInitProperties() as PluginProperties;

    }

    _release() {
		super._release();
	}


	// _tick() {
	// 	const dt = this.instance.dt;
	// 	// ... code to run every tick for this behavior ...
	// }
}

C3.Behaviors[Lost.addonId].Instance = LostBehaviorInstance;
export type { LostBehaviorInstance as Instance };
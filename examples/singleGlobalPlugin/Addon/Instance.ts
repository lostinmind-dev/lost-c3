import { GPUResourceManager } from "./Modules/index.ts";

const C3 = globalThis.C3;

const a = new GPUResourceManager();

console.log(a)

class Instance extends globalThis.ISDKInstanceBase {

    readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

    constructor() {
        super();
        const properties = this._getInitProperties() as PluginProperties;
    }

    _release() {
		super._release();
	}
}

C3.Plugins[Lost.addonId].Instance = Instance;
export type { Instance };
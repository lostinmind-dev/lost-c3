import { GPUResourceManager } from "./Modules/index.ts";

class Instance extends globalThis.ISDKInstanceBase {

    readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

    constructor() {
        super();
        const properties = this._getInitProperties() as PluginProperties;
        console.log(GPUResourceManager)
    }

    _release() {
		super._release();
	}
}

/** Important to save export type for Typescript compiler */
export type { Instance };
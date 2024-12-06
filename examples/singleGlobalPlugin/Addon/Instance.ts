const C3 = globalThis.C3;

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

export type { Instance };
const C3 = globalThis.C3;

class LostInstance extends globalThis.ISDKInstanceBase {

    readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

    constructor() {
        super();
        const properties = this._getInitProperties();

    }

    _release() {
		super._release();
	}
}

C3.Plugins[Lost.addonId].Instance = LostInstance;
export type { LostInstance as Instance };
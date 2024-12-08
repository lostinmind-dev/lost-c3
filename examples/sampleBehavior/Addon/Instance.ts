class LostBehaviorInstance extends globalThis.ISDKBehaviorInstanceBase<IWorldInstance> {

    readonly Conditions = C3.Behaviors[Lost.addonId].Cnds;

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

export type { LostBehaviorInstance as Instance };
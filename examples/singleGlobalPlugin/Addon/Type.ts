import type { Instance } from "@Instance";

const C3 = globalThis.C3;

C3.Plugins[Config.AddonId].Type = class LostType extends globalThis.ISDKObjectTypeBase<Instance> {
	constructor() {
		super();
	}
	
	_onCreate() {}
};
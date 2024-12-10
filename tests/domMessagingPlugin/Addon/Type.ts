import type { Instance } from "./Instance.ts";

const C3 = globalThis.C3;

C3.Plugins[Lost.addonId].Type = class LostType extends globalThis.ISDKObjectTypeBase<Instance> {
	constructor() {
		super();
	}
	
	_onCreate() {}
};
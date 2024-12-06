import type { Instance } from "./Instance.ts";

class LostType extends globalThis.ISDKObjectTypeBase<Instance> {
	constructor() {
		super();
	}
	
	_onCreate() {}
};


/** Export should be here for compiler (to detect class) */
export type { LostType };
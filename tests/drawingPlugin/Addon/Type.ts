import type { Instance } from "./Instance.ts";

class LostDrawingType extends globalThis.ISDKObjectTypeBase<Instance> {
	constructor() {
		super();
	}
	
	_onCreate() {
		this.runtime.assets.loadImageAsset(this.getImageInfo());
	}

	_loadTextures(renderer: IRenderer) {
		return renderer.loadTextureForImageInfo(this.getImageInfo(), {
			sampling: this.runtime.sampling
		});
	}

	_releaseTextures(renderer: IRenderer) {
		renderer.releaseTextureForImageInfo(this.getImageInfo());
	}
};

/** Important to save export type for Typescript compiler */
export type { LostDrawingType };
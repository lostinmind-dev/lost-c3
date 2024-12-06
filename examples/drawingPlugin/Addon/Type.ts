import type { Instance } from "./Instance.ts";

const C3 = globalThis.C3;

C3.Plugins[Lost.addonId].Type = class LostDrawingType extends globalThis.ISDKObjectTypeBase<Instance> {
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
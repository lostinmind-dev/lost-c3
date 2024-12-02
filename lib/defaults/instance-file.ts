// deno-lint-ignore-file no-fallthrough
import type { AddonType, LostConfig, PluginConfig } from "../../lib/config.ts";
import { dedent } from "../../shared/misc.ts";
import Lost from "./lost.ts";

export default function file(config: LostConfig<AddonType>) {

const DrawingPlugin = dedent`
${Lost(config.addonId)}
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[Lost.addonId];

PLUGIN_CLASS.Instance = class LostDrawingInstance extends SDK.IWorldInstanceBase {
	constructor(sdkType, inst) {
		super(sdkType, inst);
	}
	
	Release() { }
	
	OnCreate() { }
	
	OnPlacedInLayout() {
		this.OnMakeOriginalSize();
	}
	
	Draw(iRenderer, iDrawParams) {
		const texture = this.GetTexture();
		
		if (texture) {
			this._inst.ApplyBlendMode(iRenderer);
			iRenderer.SetTexture(texture);
			iRenderer.SetColor(this._inst.GetColor());
			iRenderer.Quad3(this._inst.GetQuad(), this.GetTexRect());
		} else {
			iRenderer.SetAlphaBlend();
			iRenderer.SetColorFillMode();
			
			if (this.HadTextureError()) {
				iRenderer.SetColorRgba(0.25, 0, 0, 0.25);
            } else {
				iRenderer.SetColorRgba(0, 0, 0.1, 0.1);
            }
			
			iRenderer.Quad(this._inst.GetQuad());
		}
	}
	
	GetTexture() {
		const image = this.GetObjectType().GetImage();
		return super.GetTexture(image);
	}
	
	IsOriginalSizeKnown() {
		return true;
	}
	
	GetOriginalWidth() {
		return this.GetObjectType().GetImage().GetWidth();
	}
	
	GetOriginalHeight() {
		return this.GetObjectType().GetImage().GetHeight();
	}
	
	OnMakeOriginalSize() {
		const image = this.GetObjectType().GetImage();
		this._inst.SetSize(image.GetWidth(), image.GetHeight());
	}
	
	HasDoubleTapHandler() {
		return true;
	}
	
	OnDoubleTap() {
		this.GetObjectType().EditImage();
	}
	
	OnPropertyChanged(id, value) {
	}
	
	LoadC2Property(name, valueString) {
		return false;
	}
};
`;

const Plugin = dedent`
${Lost(config.addonId)}
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[Lost.addonId];

PLUGIN_CLASS.Instance = class LostInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }
};
`;

const Behavior = dedent`
${Lost(config.addonId)}
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors[Lost.addonId];

BEHAVIOR_CLASS.Instance = class LostBehaviorInstance extends SDK.IBehaviorInstanceBase {
    constructor(sdkBehType, behInst) {
        super(sdkBehType, behInst);
    }
};
`;

switch (config.type) {
	case "plugin":
		switch ((config as PluginConfig).pluginType) {
			case "object":
				return Plugin;
			case "world":
				return DrawingPlugin;
		}
	case "behavior":
		return Behavior;
}

}
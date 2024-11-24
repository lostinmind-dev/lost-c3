import type { AddonType, LostConfig } from "./config.ts";

export abstract class Addon {
    readonly _type: AddonType;
    readonly _config: LostConfig;
    _icon: AddonIconFile | null;

    constructor(type: AddonType, config: LostConfig) {
        this._type = type;
        this._config = config;
        this._icon = null;
    }
}
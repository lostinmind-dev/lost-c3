import type { AddonType, LostConfig } from "./config.ts";

export abstract class Addon<T extends AddonType> {
    readonly _type: T;
    readonly _config: LostConfig<T>;
    _icon: AddonIconFile = {
        type: 'icon',
        fileName: 'icon.svg',
        path: '-',
        relativePath: 'icon.svg',
        iconType: 'image/svg+xml'
    };

    constructor(type: T, config: LostConfig<T>) {
        this._type = type;
        this._config = config;

    }
}
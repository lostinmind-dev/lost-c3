import type { AddonType, LostConfig } from "./config.ts";
import type { AddonFile } from "../shared/types/AddonFile.ts";
import type { RemoteScript, RuntimeScript } from "../shared/types.ts";
import type { ICategory } from "./entities/category.ts";


export abstract class Addon {
    readonly _categories: ICategory[]
    readonly _files: AddonFile[];
    readonly _config: LostConfig<AddonType>;

    readonly _properties: any[];
    readonly _runtimeScripts: RuntimeScript[];
    readonly _remoteScripts: RemoteScript[];

    constructor(config: LostConfig<AddonType>) {
        this._config = config;
        this._categories = [];
        this._files = [];
        this._properties = [];
        this._runtimeScripts = [];
        this._remoteScripts = [];
    }

}
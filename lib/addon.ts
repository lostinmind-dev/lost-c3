import type { LostConfig } from "./config.ts";
import type { AddonFile } from "../shared/types/addon-file.ts";
import type { RemoteScript, RuntimeScript } from "../shared/types/index.ts";
import type { ICategory } from "./entities/category.ts";
import type { PluginProperty } from "./entities/plugin-property.ts";


export abstract class Addon<A, P, I, T> {
    readonly _categories: ICategory[]
    readonly _files: AddonFile[];
    readonly _config: LostConfig<any, any>;

    readonly _properties: PluginProperty<A, P, I, T>[];
    readonly _runtimeScripts: RuntimeScript[];
    readonly _remoteScripts: RemoteScript[];

    constructor(config: LostConfig<any, any>) {
        this._config = config;
        this._categories = [];
        this._files = [];
        this._properties = [];
        this._runtimeScripts = [];
        this._remoteScripts = [];
    }

}
import type { Addon } from "./addon.ts";
import type { AddonType, LostConfig } from "./config.ts";
import type { EditorInstanceType } from "./entities/plugin-property.ts";


export function defineConfig<T extends AddonType>(config: LostConfig<T>) {
    return config;
}

export function defineAddon<T extends Addon<AddonType, any>>(addon: T) {
    return addon;
}
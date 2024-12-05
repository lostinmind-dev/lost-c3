import type { Addon } from "./addon.ts";
import type { AddonType, LostConfig } from "./config.ts";


export function defineConfig<T extends AddonType>(config: LostConfig<T>) {
    return config;
}

export function defineAddon<T extends Addon<any, any, any>>(addon: T) {
    return addon;
}
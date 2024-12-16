import type { Addon } from "./addon.ts";
import type { AddonPluginType, AddonType, IBehaviorConfig, LostConfig, PluginConfig } from "./config.ts";


export function defineConfig<A extends AddonType, P extends AddonPluginType = AddonPluginType>(config: LostConfig<A, P>) {
    return config;
}

export function defineAddon(addon: Addon<any, any, any, any>) {
    return addon;
}
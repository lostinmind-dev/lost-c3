import type { AddonPluginType, AddonType } from "./types/index.ts";
import type { LostConfig } from "./lost-config.ts";

export function defineConfig<A extends AddonType, P extends AddonPluginType = AddonPluginType>(config: LostConfig<A, P>) {
    return config;
}
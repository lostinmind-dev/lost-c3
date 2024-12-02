import type { Plugin } from "./plugin.ts";
import type { Behavior } from "./behavior.ts";
import type { AddonType, LostConfig } from "./config.ts";

type AddonClassesMap = {
    plugin: Plugin;
    behavior: Behavior;
}

type AddonClassType<T extends AddonType> = AddonClassesMap[T];

export function defineConfig<T extends AddonType = 'plugin'>(config: LostConfig<T>) {
    return config;
}

export function defineAddon<T extends AddonType = 'plugin'>(addon: AddonClassType<T>) {
    return addon;
}
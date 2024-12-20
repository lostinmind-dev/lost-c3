import type { AddonPluginType, AddonType } from "../../types/index.ts";
import type { LostConfig, PluginConfig } from "../../lost-config.ts";
import { Addon } from "../index.ts";


export class Plugin<
    P extends AddonPluginType = 'object',
    A extends AddonType = 'plugin'
> extends Addon<A, P> {

    constructor(config: LostConfig<A, P>) {
        super(config);
    }

}
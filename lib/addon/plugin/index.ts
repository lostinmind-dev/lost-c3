import type { AddonPluginType } from "types/index.ts";
import type { PluginConfig } from "../../lost-config.ts";
import { Addon } from "../index.ts";


export class Plugin<P extends AddonPluginType> extends Addon<'plugin'> {
    constructor(config: PluginConfig<P>) {
        super(config);
    }
}
import type { AddonType, LostConfig } from "../../lib/config.ts";
import { dedent } from "../../shared/misc.ts";
import Lost from "./lost.ts";

export default function typeFile(config: LostConfig<AddonType>) {

const Plugin = dedent`

${Lost(config.addonId)}
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[Lost.addonId];

PLUGIN_CLASS.Type = class LostPluginType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
};
export {};
`;

const Behavior = dedent`

${Lost(config.addonId)}
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors[Lost.addonId];

BEHAVIOR_CLASS.Type = class LostBehaviorType extends SDK.IBehaviorTypeBase {
    constructor(sdkBehavior, iBehaviorType) {
        super(sdkBehavior, iBehaviorType);
    }
};
export {};
`;

switch (config.type) {
    case 'plugin':
        return Plugin;
    case 'behavior':
        return Behavior;
        // break;
}

}
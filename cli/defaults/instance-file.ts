import type { AddonType } from "../../lib/config.ts";
import { dedent } from "../../shared/misc.ts";
import Lost from "./lost.ts";

export default function getDefaultAddonInstanceFile(addonId: string, addonType: AddonType) {

const Plugin = dedent`
${Lost(addonId)}
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[Lost.addonId];

PLUGIN_CLASS.Instance = class LostInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }
};
export {};
`;

const Behavior = dedent`
${Lost(addonId)}
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors[Lost.addonId];

BEHAVIOR_CLASS.Instance = class LostBehaviorInstance extends SDK.IBehaviorInstanceBase {
    constructor(sdkBehType, behInst) {
        super(sdkBehType, behInst);
    }
};
export {};
`;

switch (addonType) {
    case 'plugin':
        return Plugin;
    case 'behavior':
        return Behavior;
}

}
const Lost = {"addonId":"LostPluginId"};
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[Lost.addonId];

PLUGIN_CLASS.Instance = class LostInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }
};
export {};
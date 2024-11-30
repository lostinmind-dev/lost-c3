const Lost = {"addonId":"LostPluginId"};
const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[Lost.addonId];

PLUGIN_CLASS.Type = class LostPluginType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
};
export {};
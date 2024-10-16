const LOST_CONFIG = {};
const CONFIG = LOST_CONFIG.Config;
const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins[CONFIG.AddonId];
PLUGIN_CLASS.Type = class LPluginType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
        console.log('Loaded plugin type.')
    }
};
export {};

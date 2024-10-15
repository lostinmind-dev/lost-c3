const LOST_CONFIG = {};
const CONFIG = LOST_CONFIG.Config;
const C3 = globalThis.C3;
C3.Plugins[CONFIG.AddonId] = class LPlugin extends globalThis.ISDKPluginBase {
    constructor() {
        super();
    }
};

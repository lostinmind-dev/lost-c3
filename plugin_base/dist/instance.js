const LOST_CONFIG = {};
const CONFIG = LOST_CONFIG.Config;
const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins[CONFIG.AddonId];
PLUGIN_CLASS.Instance = class LCInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }
    Release() { }
    OnCreate() { console.log(`%c Lost addon loaded! `, `background: #222; color: #bada55`); }
    OnPropertyChanged(id, value) { }
};
export {};

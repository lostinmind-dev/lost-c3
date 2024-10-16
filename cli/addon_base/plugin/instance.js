const ADDON_ID = "";
const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins[ADDON_ID];
PLUGIN_CLASS.Instance = class LostInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }
    Release() { }
    OnCreate() { console.log(`%c Lost addon loaded! `, `background: #222; color: #bada55`); }
    OnPropertyChanged(id, value) { }
};
export {};
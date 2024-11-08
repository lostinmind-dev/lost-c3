const ADDON_ID = "";
const SDK = globalThis.SDK;
const BEHAVIOR_CLASS = SDK.Behaviors[ADDON_ID];
BEHAVIOR_CLASS.Instance = class LostBehaviorInstance extends SDK.IBehaviorInstanceBase {
    constructor(sdkBehType, behInst) {
        super(sdkBehType, behInst);
    }
    Release() { }
    OnCreate() { console.log(`%c Lost addon instance loaded! `, `background: #222; color: #bada55`); }
    OnPropertyChanged(id, value) { }
};
export {};
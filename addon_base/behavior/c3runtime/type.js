const ADDON_ID = "";
const C3 = globalThis.C3;
C3.Behaviors[ADDON_ID].Type = class LostBehaviorType extends globalThis.ISDKBehaviorTypeBase {
    constructor() {
        super();
    }
    _onCreate() { }
};
const ADDON_ID = "";
const C3 = globalThis.C3;
C3.Behaviors[ADDON_ID].Type = class LostBehaviorObjectType extends globalThis.ISDKObjectTypeBase {
    constructor() {
        super();
    }
    _onCreate() { }
};
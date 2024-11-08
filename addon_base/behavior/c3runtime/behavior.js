const ADDON_ID = "";
const C3 = globalThis.C3;
C3.Behaviors[ADDON_ID] = class LostBehavior extends globalThis.ISDKBehaviorBase {
    constructor() {
        super();
    }
};
const LOST_CONFIG = {};
const CONFIG = LOST_CONFIG.Config;
const C3 = globalThis.C3;
class LInstance extends globalThis.ISDKInstanceBase {
    constructor() {
        super();
    }
    _release() {
        super._release();
    }
}
;
C3.Plugins[CONFIG.AddonId].Instance = LInstance;

const Lost = {"addonId":"LostPluginId"};
class LostEditorInstance extends SDK.IBehaviorInstanceBase {
    constructor(sdkBehType, behInst) {
        super(sdkBehType, behInst);
    }
    Release() {
    }
    OnCreate() {
    }
    OnPropertyChanged() {
    }
    LoadC2Property() {
        return false; // not handled
    }
}
;
export {};

setTimeout(() => {
    globalThis.SDK.Behaviors["LostPluginId"].Instance = LostEditorInstance;
})
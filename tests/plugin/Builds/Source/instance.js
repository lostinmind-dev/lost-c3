const Lost = {"addonId":"LostPluginId"};
class LostEditorInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
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
    globalThis.SDK.Plugins["LostPluginId"].Instance = LostEditorInstance;
})
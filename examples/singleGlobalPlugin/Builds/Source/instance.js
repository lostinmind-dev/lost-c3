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
export { LostEditorInstance as EditorInstance };

globalThis.SDK.Plugins["LostPluginId"].Instance = LostEditorInstance;
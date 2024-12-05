class LostEditorType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
}
;
export { LostEditorType as EditorType };

globalThis.SDK.Plugins["LostPluginId"].Type = LostEditorType;
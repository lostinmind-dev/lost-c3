class LostEditorType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
}
;
export {};

globalThis.SDK.Plugins["LostPluginId"].Type = LostEditorType;
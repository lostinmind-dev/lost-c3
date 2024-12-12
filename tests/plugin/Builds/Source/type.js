const Lost = {"addonId":"LostPluginId"};
class LostEditorType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
}
;
export {};

setTimeout(() => {
    globalThis.SDK.Plugins["LostPluginId"].Type = LostEditorType;
})
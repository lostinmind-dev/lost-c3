const Lost = {"addonId":"LostPluginId"};
class LostEditorType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
        this.test = 1;
    }
}
;
export {};

setTimeout(() => {
    globalThis.SDK.Plugins["LostPluginId"].Type = LostEditorType;
})
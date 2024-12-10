const Lost = {"addonId":"LostPluginId"};
class LostEditorType extends SDK.IBehaviorTypeBase {
    constructor(sdkBehavior, iBehaviorType) {
        super(sdkBehavior, iBehaviorType);
        this.test = 1;
    }
}
;
export { LostEditorType as EditorType };

setTimeout(() => {
    globalThis.SDK.Behaviors["LostPluginId"].Type = LostEditorType;
})
class LostEditorType extends SDK.IBehaviorTypeBase {
	test = 1;
	constructor(sdkBehavior: SDK.IBehaviorBase, iBehaviorType: SDK.IBehaviorType) {
		super(sdkBehavior, iBehaviorType);
	}
};

export { LostEditorType as EditorType };

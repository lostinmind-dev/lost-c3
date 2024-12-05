class LostEditorType extends SDK.ITypeBase {
	test = 1;
	constructor(sdkPlugin: SDK.IPluginBase, iObjectType: SDK.IObjectType) {
		super(sdkPlugin, iObjectType);
	}
};

export { LostEditorType as EditorType };

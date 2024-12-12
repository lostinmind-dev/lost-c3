class LostEditorType extends SDK.ITypeBase {
	constructor(sdkPlugin: SDK.IPluginBase, iObjectType: SDK.IObjectType) {
		super(sdkPlugin, iObjectType);
	}
};

/** Important to save export type for Typescript compiler */
export type { LostEditorType as EditorType };

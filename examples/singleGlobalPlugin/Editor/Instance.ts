class LostEditorInstance extends SDK.IInstanceBase {
	constructor(sdkType: SDK.ITypeBase, inst: SDK.IObjectInstance) {
		super(sdkType, inst);
	}
	
	Release() {

	}
	
	OnCreate() {

	}
	
	OnPropertyChanged(id: string, value: EditorPropertyValueType) {

	}
	
	LoadC2Property(name: string, valueString: string) {
		return false;		// not handled
	}
};

export { LostEditorInstance as EditorInstance };
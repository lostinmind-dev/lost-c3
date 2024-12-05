class LostEditorInstance extends SDK.IWorldInstanceBase {
	test = 2;
	constructor(sdkType: SDK.ITypeBase, inst: SDK.IWorldInstance) {
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

export { LostEditorInstance as EditorWorldInstance };
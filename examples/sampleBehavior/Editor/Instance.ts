class LostEditorInstance extends SDK.IBehaviorInstanceBase {
	test = 2;
	constructor(sdkBehType: SDK.IBehaviorTypeBase, behInst: SDK.IBehaviorInstance) {
		super(sdkBehType, behInst);
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
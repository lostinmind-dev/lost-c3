const C3 = globalThis.C3;

class LostDOMInstance extends globalThis.ISDKInstanceBase {

    _documentTitle: string = '';

    readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

    constructor() {
        super({ domComponentId: Lost.addonId });
        const properties = this._getInitProperties() as PluginProperties;

        /**
         * Post to the DOM to retrieve the initial state, which makes sure that the initial document title held on the runtime side is correct on startup.
         * Make runtime loading wait for the response.
         */
        this.runtime.sdk.addLoadPromise(
			this._postToDOMAsync("get-initial-state")
			.then(_data =>
			{
				const data = _data as JSONObject;
				this._documentTitle = data["document-title"] as string;
			})
		);

    }

    _release() {
		super._release();
	}
}

C3.Plugins[Lost.addonId].Instance = LostDOMInstance;
export type { LostDOMInstance as Instance };
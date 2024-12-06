// This class handles messages from the runtime, which may be in a Web Worker.
const HANDLER_CLASS = class LostDOMHandler extends globalThis.DOMHandler {
    constructor(iRuntime: IRuntimeInterface) {
        super(iRuntime, Lost.addonId);
        
        // This provides a table of message names to functions to call for those messages.
        // For example the "Set document title" action posts a "set-document-title" message,
        // which will then call _OnSetDocumentTitle().
        this.AddRuntimeMessageHandlers([
            ["get-initial-state",		() => this._OnGetInitialState()],
            ["set-document-title",		e => this._OnSetDocumentTitle(e)]
        ]);
    }
    
    _OnGetInitialState() {
        // Return the initial document title so the DocumentTitle expression has the right
        // value on startup. The return value of this method will be what the PostToDOMAsync()
        // promise resolves to.
        return {
            "document-title": document.title
        };
    }

    // Called by the 'Set document title' action. Since this script is always in the DOM,
    // the document.title property can be accessed directly, and updated with the title
    // sent from the action.
    _OnSetDocumentTitle(e: JSONValue) {
        const data = e as JSONObject;
        document.title = data["title"] as string;
    }
};

globalThis.RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
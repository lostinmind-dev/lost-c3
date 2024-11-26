import Lost from "./lost.ts";

export default function getDefaultAddonTypeFile(addonId: string) {
    const _default = `${Lost(addonId)}\nconst SDK = globalThis.SDK;\nconst PLUGIN_CLASS = SDK.Plugins[Lost.addonId];`
    return `${_default}\nPLUGIN_CLASS.Type = class LostPluginType extends SDK.ITypeBase {
    constructor(sdkPlugin, iObjectType) {
        super(sdkPlugin, iObjectType);
    }
};
export {};`
}
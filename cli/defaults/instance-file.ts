import Lost from "./lost.ts";

export default function getDefaultAddonInstanceFile(addonId: string) {
    const _default = `${Lost(addonId)}\nconst SDK = globalThis.SDK;\nconst PLUGIN_CLASS = SDK.Plugins[Lost.addonId];`
    return `${_default}\nPLUGIN_CLASS.Instance = class LostInstance extends SDK.IInstanceBase {
    constructor(sdkType, inst) {
        super(sdkType, inst);
    }
};
export {};`
}
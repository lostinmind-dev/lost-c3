const ADDON_ID = "";

const CONFIG = {};

const PLUGIN_PROPERTIES = {};

const REMOTE_SCRIPTS = [];

const SCRIPTS = [];

const FILES = [];

const MODULES = [];

const ICON_NAME = "";
const ICON_TYPE = "";

const SDK = globalThis.SDK;

const PLUGIN_CLASS = SDK.Plugins[ADDON_ID] = class LostPlugin extends SDK.IPluginBase {
    constructor() {
        super(ADDON_ID);
        SDK.Lang.PushContext("plugins." + ADDON_ID.toLowerCase());
        this._info.SetName(globalThis.lang(".name"));
        this._info.SetDescription(globalThis.lang(".description"));
        this._info.SetCategory(CONFIG.Category);
        this._info.SetAuthor(CONFIG.Author);
        this._info.SetHelpUrl(globalThis.lang(".help-url"));
        this._info.SetIcon(ICON_NAME, ICON_TYPE);
        this._info.SetIsDeprecated(CONFIG.Deprecated || false);
        this._info.SetCanBeBundled(CONFIG.CanBeBundled || true);
        this._info.SetIsSingleGlobal(CONFIG.IsSingleGlobal || false);
        this._info.SetRuntimeModuleMainScript("c3runtime/main.js")
        
        SDK.Lang.PushContext(".properties");

        REMOTE_SCRIPTS.forEach(url => {
            this._info.AddRemoteScriptDependency(url);
        });
        SCRIPTS.forEach(script => {
            this._info.AddFileDependency({ filename: `scripts/${script.filename}`, type: script.dependencyType });
        });
        FILES.forEach(file => {
            this._info.AddFileDependency({ filename: `files/${file.filename}`, type: file.dependencyType });
        });
        MODULES.forEach(module => {
            this._info.AddC3RuntimeScript(`c3runtime/Modules/${module.filename}`);
        });
        const pps = [];
        PLUGIN_PROPERTIES.forEach(pp => {
            const { Type, Id } = pp.Options;
            switch (Type) {
                case 'integer':
                    if (pp.Options.Min && pp.Options.Max) {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue, minValue: pp.Options.Min, maxValue: pp.Options.Max }));
                    }
                    else if (pp.Options.Min) {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue, minValue: pp.Options.Min }));
                    }
                    else if (pp.Options.Max) {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue, maxValue: pp.Options.Max }));
                    }
                    else {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    }
                    break;
                case 'float':
                    if (pp.Options.Min && pp.Options.Max) {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue, minValue: pp.Options.Min, maxValue: pp.Options.Max }));
                    }
                    else if (pp.Options.Min) {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue, minValue: pp.Options.Min }));
                    }
                    else if (pp.Options.Max) {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue, maxValue: pp.Options.Max }));
                    }
                    else {
                        pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    }
                    break;
                case 'percent':
                    pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    break;
                case 'text':
                    pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    break;
                case 'longtext':
                    pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    break;
                case 'check':
                    pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    break;
                case 'font':
                    pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    break;
                // deno-lint-ignore no-case-declarations
                case 'combo':
                    const items = pp.Options.Items.map(item => item[0]);
                    pps.push(new SDK.PluginProperty(Type, Id, { items: items, initialValue: pp.Options.InitialValue }));
                    break;
                case 'color':
                    pps.push(new SDK.PluginProperty(Type, Id, { initialValue: pp.Options.InitialValue }));
                    break;
                case 'object':
                    pps.push(new SDK.PluginProperty(Type, Id, { allowedPluginIds: pp.Options.AllowedPluginIds }));
                    break;
                case 'group':
                    pps.push(new SDK.PluginProperty(Type, Id));
                    break;
                // deno-lint-ignore no-case-declarations
                case 'info':
                    const returnValue = pp.Options.Value;
                    pps.push(new SDK.PluginProperty(Type, Id, { infoCallback: (inst) => { return returnValue; } }));
                    break;
            }
        });
        this._info.SetProperties(pps);
        SDK.Lang.PopContext();
        SDK.Lang.PopContext();
    }
};
PLUGIN_CLASS.Register(CONFIG.AddonId, PLUGIN_CLASS);
export {};
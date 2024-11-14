const ADDON_ID = "";
const CONFIG = {};
const PLUGIN_PROPERTIES = [];
const REMOTE_SCRIPTS = [];
const SCRIPTS = [];
const FILES = [];
const MODULES = [];
const ICON_NAME = "";
const ICON_TYPE = 'image/svg+xml';
const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins[ADDON_ID] = class LostDrawingPlugin extends SDK.IPluginBase {
    constructor() {
        super(ADDON_ID);
        SDK.Lang.PushContext("plugins." + ADDON_ID.toLowerCase());
        this._info.SetName(globalThis.lang(".name"));
        this._info.SetDescription(globalThis.lang(".description"));
        this._info.SetCategory(CONFIG.Category);
        this._info.SetAuthor(CONFIG.Author);
        this._info.SetHelpUrl(globalThis.lang(".help-url"));
        this._info.SetPluginType("world"); // mark as world plugin, which can draw
        this._info.SetIsResizable(CONFIG.IsResizable);
        this._info.SetIsRotatable(CONFIG.IsRotatable);
        this._info.SetIs3D(CONFIG.Is3D || false);
        this._info.SetHasImage(true);
        this._info.SetIsTiled(CONFIG.IsTiled || false);
        this._info.SetSupportsZElevation(CONFIG.SupportsZElevation);
        this._info.SetSupportsColor(CONFIG.SupportsColor);
        this._info.SetSupportsEffects(CONFIG.SupportsEffects);
        this._info.SetMustPreDraw(CONFIG.MustPreDraw);
        if (CONFIG.CommonACEs) {
            const { CommonACEs } = CONFIG;
            if (CommonACEs.Position) {
                this._info.AddCommonPositionACEs();
            }
            if (CommonACEs.SceneGraph) {
                this._info.AddCommonSceneGraphACEs();
            }
            if (CommonACEs.Size) {
                this._info.AddCommonSizeACEs();
            }
            if (CommonACEs.Angle) {
                this._info.AddCommonAngleACEs();
            }
            if (CommonACEs.Appearance) {
                this._info.AddCommonAppearanceACEs();
            }
            if (CommonACEs.ZOrder) {
                this._info.AddCommonZOrderACEs();
            }
        }
        this._info.SetIcon(ICON_NAME, ICON_TYPE);
        this._info.SetIsDeprecated(CONFIG.Deprecated || false);
        this._info.SetCanBeBundled(CONFIG.CanBeBundled || true);
        this._info.SetRuntimeModuleMainScript("c3runtime/main.js");
        SDK.Lang.PushContext(".properties");
        REMOTE_SCRIPTS.forEach(url => {
            this._info.AddRemoteScriptDependency(url);
        });
        SCRIPTS.forEach(script => {
            const scriptPath = (script.language === 'ts') ? script.relativePath.replace('.ts', '.js') : script.relativePath;
            if (script.scriptType) {
                this._info.AddFileDependency({ filename: `scripts${scriptPath}`, type: script.dependencyType, scriptType: script.scriptType });
            }
            else {
                this._info.AddFileDependency({ filename: `scripts${scriptPath}`, type: script.dependencyType });
            }
        });
        FILES.forEach(file => {
            this._info.AddFileDependency({ filename: `files/${file.filename}`, type: file.dependencyType, fileType: file.fileType });
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

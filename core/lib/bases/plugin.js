const config = {};
const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins[config.info.id] = class LostC3 extends SDK.IPluginBase {
    constructor() {
        super(config.info.id);
        const { info } = config;
        SDK.Lang.PushContext("plugins." + config.info.id.toLowerCase());
        SDK.Lang.PushContext(".properties");
        this._info.SetName(globalThis.lang(".name"));
        this._info.SetDescription(globalThis.lang(".description"));
        this._info.SetHelpUrl(globalThis.lang(".help-url"));
        this._info.SetPluginType(config.info.type);
        this._info.SetCategory(info.category);
        this._info.SetAuthor(info.author);
        this._info.SetIcon('icon.svg', 'image/svg+xml');
        if (typeof info.deprecated !== 'undefined') {
            this._info.SetIsDeprecated(info.deprecated);
        }
        if (typeof info.canBeBundled !== 'undefined') {
            this._info.SetCanBeBundled(info.canBeBundled);
        }
        if (info.type === 'object' && typeof info.singleGlobal !== 'undefined') {
            this._info.SetIsSingleGlobal(info.singleGlobal);
        }
        if (info.type === 'world') {
            this._info.SetHasImage(true);
            if (typeof info.resizable !== 'undefined') {
                this._info.SetIsResizable(info.resizable);
            }
            else {
                this._info.SetIsResizable(true);
            }
            if (typeof info.rotatable !== 'undefined') {
                this._info.SetIsRotatable(info.rotatable);
            }
            else {
                this._info.SetIsRotatable(true);
            }
            if (typeof info.is3D !== 'undefined') {
                this._info.SetIs3D(info.is3D);
            }
            else {
                this._info.SetIs3D(false);
            }
            if (typeof info.tiled !== 'undefined') {
                this._info.SetIsTiled(info.tiled);
            }
            else {
                this._info.SetIsTiled(false);
            }
            if (info.supports) {
                if (info.supports.includes('color')) {
                    this._info.SetSupportsColor(true);
                }
                else {
                    this._info.SetSupportsColor(false);
                }
                if (info.supports.includes('zElevation')) {
                    this._info.SetSupportsZElevation(true);
                }
                else {
                    this._info.SetSupportsZElevation(false);
                }
                if (info.supports.includes('effects')) {
                    this._info.SetSupportsEffects(true);
                }
                else {
                    this._info.SetSupportsEffects(false);
                }
            }
            if (info.mustPreDraw) {
                this._info.SetMustPreDraw(info.mustPreDraw);
            }
            else {
                this._info.SetMustPreDraw(true);
            }
            if (info.commonACEs) {
                if (info.commonACEs.includes('position')) {
                    this._info.AddCommonPositionACEs();
                }
                if (info.commonACEs.includes('scene_graph')) {
                    this._info.AddCommonSceneGraphACEs();
                }
                if (info.commonACEs.includes('size')) {
                    this._info.AddCommonSizeACEs();
                }
                if (info.commonACEs.includes('angle')) {
                    this._info.AddCommonAngleACEs();
                }
                if (info.commonACEs.includes('appereance')) {
                    this._info.AddCommonAppearanceACEs();
                }
                if (info.commonACEs.includes('z_order')) {
                    this._info.AddCommonZOrderACEs();
                }
            }
        }
        this.init();
        SDK.Lang.PopContext();
        SDK.Lang.PopContext();
    }
    init() {
        this._info.SetRuntimeModuleMainScript('c3runtime/main.js');
        this._info.AddC3RuntimeScript('c3runtime/categories.js');
        for (const module of config.modules) {
            this._info.AddC3RuntimeScript(module.path);
        }
        for (const script of config.remoteScripts) {
            if (!script.module) {
                this._info.AddRemoteScriptDependency(script.url, 'module');
            }
            else {
                this._info.AddRemoteScriptDependency(script.url);
            }
        }
        for (const script of config.scripts) {
            this._info.AddFileDependency({
                filename: script.path,
                type: 'external-dom-script'
            });
        }
        this._info.SetProperties(config.properties.map(property => {
            if (property.type === 'integer' || property.type === 'float') {
                return new SDK.PluginProperty(property.type, property.id, {
                    initialValue: property.value,
                    minValue: property.min,
                    maxValue: property.max
                });
            }
            else if (property.type === 'text' || property.type === 'longtext') {
                return new SDK.PluginProperty(property.type, property.id, {
                    initialValue: property.value
                });
            }
            else if (property.type === 'check') {
                return new SDK.PluginProperty(property.type, property.id, {
                    initialValue: property.checked
                });
            }
            else if (property.type === 'percent') {
                return new SDK.PluginProperty(property.type, property.id, {
                    initialValue: property.value
                });
            }
            else if (property.type === 'font') {
                return new SDK.PluginProperty(property.type, property.id, {
                    initialValue: property.fontName
                });
            }
            else if (property.type === 'combo') {
                return new SDK.PluginProperty(property.type, property.id, {
                    items: Object.keys(property.items),
                    initialValue: property.initialValue
                });
            }
            else if (property.type === 'color') {
                return new SDK.PluginProperty(property.type, property.id, {
                    initialValue: property.value
                });
            }
            else if (property.type === 'object') {
                return new SDK.PluginProperty(property.type, property.id, {
                    allowedPluginIds: property.allowedPluginIds
                });
            }
            else {
                return new SDK.PluginProperty(property.type, property.id);
            }
        }));
    }
};
PLUGIN_CLASS.Register(config.info.id, PLUGIN_CLASS);
export {};

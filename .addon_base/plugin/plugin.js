
const config = _lostData.config;
const { icon } = _lostData;
const SDK = globalThis.SDK;
const PLUGIN_CLASS = SDK.Plugins[config.addonId] = class LostPlugin extends SDK.IPluginBase {
    constructor() {
        super(config.addonId);
        SDK.Lang.PushContext("plugins." + config.addonId.toLowerCase());
        this._info.SetName(globalThis.lang(".name"));
        this._info.SetDescription(globalThis.lang(".description"));
        this._info.SetCategory(config.category);
        this._info.SetAuthor(config.author);
        this._info.SetHelpUrl(globalThis.lang(".help-url"));
        this._info.SetIcon(icon.path, icon.iconType);
        if (config.deprecated) {
            this._info.SetIsDeprecated(config.deprecated);
        }
        else {
            this._info.SetIsDeprecated(false);
        }
        if (config.canBeBundled) {
            this._info.SetCanBeBundled(config.canBeBundled);
        }
        else {
            this._info.SetCanBeBundled(true);
        }
        this._info.SetPluginType(config.pluginType);
        if (config.pluginType === 'object') {
            this._info.SetIsSingleGlobal(config.isSingleGlobal || false);
        }
        if (config.pluginType === 'world') {
            this._info.SetHasImage(true);
            if (config.isResizable) {
                this._info.SetIsResizable(config.isResizable);
            }
            else {
                this._info.SetIsResizable(true);
            }
            if (config.isRotatable) {
                this._info.SetIsRotatable(config.isRotatable);
            }
            else {
                this._info.SetIsRotatable(true);
            }
            if (config.is3D) {
                this._info.SetIs3D(config.is3D);
            }
            else {
                this._info.SetIs3D(false);
            }
            if (config.isTiled) {
                this._info.SetIsTiled(config.isTiled);
            }
            else {
                this._info.SetIsTiled(false);
            }
            if (_lostData.hasDefaultImage) {
                this._info.SetDefaultImageURL('default.png');
            }
            ;
            if (config.supportsZElevation) {
                this._info.SetSupportsZElevation(config.supportsZElevation);
            }
            else {
                this._info.SetSupportsZElevation(true);
            }
            if (config.supportsColor) {
                this._info.SetSupportsColor(config.supportsColor);
            }
            else {
                this._info.SetSupportsColor(true);
            }
            if (config.supportsEffects) {
                this._info.SetSupportsEffects(config.supportsEffects);
            }
            else {
                this._info.SetSupportsEffects(true);
            }
            if (config.mustPreDraw) {
                this._info.SetMustPreDraw(config.mustPreDraw);
            }
            else {
                this._info.SetMustPreDraw(true);
            }
            if (config.commonACEs) {
                const commonAces = new Set(config.commonACEs);
                commonAces.forEach(value => {
                    switch (value) {
                        case "position":
                            this._info.AddCommonPositionACEs();
                            break;
                        case "scene_graph":
                            this._info.AddCommonSceneGraphACEs();
                            break;
                        case "size":
                            this._info.AddCommonSizeACEs();
                            break;
                        case "angle":
                            this._info.AddCommonAngleACEs();
                            break;
                        case "appereance":
                            this._info.AddCommonAppearanceACEs();
                            break;
                        case "z_order":
                            this._info.AddCommonZOrderACEs();
                            break;
                    }
                });
            }
        }
        SDK.Lang.PushContext(".properties");
        this.addUserDomSideScripts();
        this.setupUserModules();
        this.addRemoteScripts();
        this.addUserFiles();
        this.addUserScripts();
        this.setupPluginProperties();
        SDK.Lang.PopContext();
        SDK.Lang.PopContext();
    }
    addUserDomSideScripts() {
        const domSideScripts = _lostData.files.filter(file => file.type === 'dom-side-script');
        if (domSideScripts.length > 0) {
            const list = [];
            domSideScripts.forEach(file => {
                list.push(file.path);
            });
            this._info.SetDOMSideScripts(list);
        }
    }
    setupUserModules() {
        const modules = _lostData.files.filter(file => file.type === 'module');
        if (modules.length > 0) {
            this._info.SetRuntimeModuleMainScript('c3runtime/main.js');
            modules.forEach(file => {
                this._info.AddC3RuntimeScript(file.path);
            });
        }
    }
    addRemoteScripts() {
        _lostData.remoteScripts.forEach(script => {
            if (script.type) {
                this._info.AddRemoteScriptDependency(script.url, script.type);
            }
            else {
                this._info.AddRemoteScriptDependency(script.url);
            }
        });
    }
    addUserFiles() {
        const files = _lostData.files.filter(file => file.type === 'file');
        if (files.length > 0) {
            files.forEach(file => {
                if (file.dependencyType === 'copy-to-output') {
                    this._info.AddFileDependency({
                        filename: file.path,
                        type: file.dependencyType,
                        fileType: file.mimeType
                    });
                }
                else {
                    this._info.AddFileDependency({
                        filename: file.path,
                        type: file.dependencyType || 'copy-to-output'
                    });
                }
            });
        }
    }
    addUserScripts() {
        const files = _lostData.files.filter(file => file.type === 'script');
        if (files.length > 0) {
            files.forEach(file => {
                this._info.AddFileDependency({
                    filename: file.path,
                    type: file.dependencyType || 'external-dom-script'
                });
            });
        }
    }
    setupPluginProperties() {
        const properties = [];
        if (_lostData.pluginProperties.length > 0) {
            _lostData.pluginProperties.forEach(property => {
                const { _id, _opts } = property;
                switch (_opts.type) {
                    case "integer":
                        if (_opts.min && _opts.max) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0,
                                minValue: _opts.min,
                                maxValue: _opts.max
                            }));
                        }
                        else if (_opts.min) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0,
                                minValue: _opts.min,
                            }));
                        }
                        else if (_opts.max) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0,
                                maxValue: _opts.max
                            }));
                        }
                        else {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0
                            }));
                        }
                        break;
                    case "float":
                        if (_opts.min && _opts.max) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0,
                                minValue: _opts.min,
                                maxValue: _opts.max
                            }));
                        }
                        else if (_opts.min) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0,
                                minValue: _opts.min,
                            }));
                        }
                        else if (_opts.max) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0,
                                maxValue: _opts.max
                            }));
                        }
                        else {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                initialValue: _opts.initialValue || 0
                            }));
                        }
                        break;
                    case "percent":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            initialValue: _opts.initialValue || 0
                        }));
                        break;
                    case "text":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            initialValue: _opts.initialValue || ''
                        }));
                        break;
                    case "longtext":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            initialValue: _opts.initialValue || ''
                        }));
                        break;
                    case "check":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            initialValue: _opts.initialValue || false
                        }));
                        break;
                    case "font":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            initialValue: _opts.initialValue || 'Arial'
                        }));
                        break;
                    case "combo":
                        const items = _opts.items.map(item => item[0]);
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            items: items,
                            initialValue: _opts.initialValue || items[0]
                        }));
                        break;
                    case "color":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            initialValue: _opts.initialValue || [0, 0, 0]
                        }));
                        break;
                    case "object":
                        properties.push(new SDK.PluginProperty(_opts.type, _id, {
                            allowedPluginIds: _opts.allowedPluginIds || []
                        }));
                        break;
                    case "group":
                        properties.push(new SDK.PluginProperty(_opts.type, _id));
                        break;
                    case "info":
                        const infoFunc = _lostMethods[_id];
                        if (infoFunc) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                infoCallback: (inst) => {
                                    return infoFunc(inst);
                                }
                            }));
                        }
                        break;
                    case "link":
                        const linkFunc = _lostMethods[_id];
                        if (linkFunc) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                callbackType: _opts.callbackType,
                                linkCallback: (instOrType) => {
                                    linkFunc(instOrType);
                                }
                            }));
                        }
                        break;
                }
            });
        }
        this._info.SetProperties(properties);
    }
};
PLUGIN_CLASS.Register(config.addonId, PLUGIN_CLASS);
export {};

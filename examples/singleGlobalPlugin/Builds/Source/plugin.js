const _lostData = {"icon":{"path":"icon.svg","iconType":"image/svg+xml"},"config":{"type":"plugin","pluginType":"object","isSingleGlobal":true,"objectName":"LostPlugin","addonId":"LostPluginId","category":"general","addonName":"Lost plugin for Construct 3","addonDescription":"My awesome addon was made with Lost","version":"1.0.0.0","author":"lostinmind.","docsUrl":"https://myaddon.com/docs","helpUrl":{"EN":"https://myaddon.com/help/en"},"websiteUrl":"https://myaddon.com"},"remoteScripts":[],"files":[{"type":"file","path":"other/info.txt","dependencyType":"copy-to-output","mimeType":"text/plain"},{"type":"file","path":"styles.css","dependencyType":"external-css"},{"type":"script","path":"index.js","dependencyType":"external-dom-script"},{"type":"module","path":"index.js"}],"pluginProperties":[]};

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
        this._info.SetIsDeprecated(config.deprecated || false);
        this._info.SetCanBeBundled(config.canBeBundled || true);
        this._info.SetPluginType(config.pluginType);
        if (config.pluginType === 'object') {
            this._info.SetIsSingleGlobal(config.isSingleGlobal || false);
        }
        if (config.pluginType === 'world') {
            this._info.SetHasImage(true);
            this._info.SetIsResizable(config.isResizable || true);
            this._info.SetIsRotatable(config.isRotatable || true);
            this._info.SetIs3D(config.is3D || false);
            this._info.SetIsTiled(config.isTiled || false);
            this._info.SetHasAnimations(config.hasAnimations || false);
            this._info.SetSupportsZElevation(config.supportsZElevation || true);
            this._info.SetSupportsColor(config.supportsColor || true);
            this._info.SetSupportsEffects(config.supportsEffects || true);
            this._info.SetMustPreDraw(config.mustPreDraw || true);
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
                list.push(`c3runtime/domSide/${file.path}`);
            });
            this._info.SetDOMSideScripts(list);
        }
    }
    setupUserModules() {
        const modules = _lostData.files.filter(file => file.type === 'module');
        if (modules.length > 0) {
            modules.forEach(file => {
                this._info.AddC3RuntimeScript(`c3runtime/modules/${file.path}`);
            });
        }
    }
    addRemoteScripts() {
        _lostData.remoteScripts.forEach(url => {
            this._info.AddRemoteScriptDependency(url);
        });
    }
    addUserFiles() {
        const files = _lostData.files.filter(file => file.type === 'file');
        if (files.length > 0) {
            files.forEach(file => {
                if (file.dependencyType === 'copy-to-output') {
                    this._info.AddFileDependency({
                        filename: `files/${file.path}`,
                        type: file.dependencyType,
                        fileType: file.mimeType
                    });
                }
                else {
                    this._info.AddFileDependency({
                        filename: `files/${file.path}`,
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
                    filename: `scripts/${file.path}`,
                    type: file.dependencyType || 'external-dom-script'
                });
            });
        }
    }
    setupPluginProperties() {
        const properties = [];
        if (_lostData.pluginProperties.length > 0) {
            _lostData.pluginProperties.forEach(property => {
                const { _id, _opts, _funcString } = property;
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
                        const infoFunc = this.deserializeFunction(_funcString || '');
                        if (infoFunc) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                infoCallback: (i) => {
                                    return infoFunc(i);
                                }
                            }));
                        }
                        break;
                    case "link":
                        const func = this.deserializeFunction(_funcString || '');
                        if (func) {
                            properties.push(new SDK.PluginProperty(_opts.type, _id, {
                                callbackType: _opts.callbackType,
                                linkCallback: (p) => {
                                    func(p);
                                }
                            }));
                        }
                        break;
                }
            });
        }
        this._info.SetProperties(properties);
    }
    deserializeFunction(funcString) {
        try {
            const cleanedFuncString = funcString.trim();
            const arrowFunctionMatch = cleanedFuncString.match(/^\((.*)\)\s*=>\s*\{([\s\S]*)\}$/);
            const regularFunctionMatch = cleanedFuncString.match(/^function\s*\((.*)\)\s*\{([\s\S]*)\}$/);
            if (arrowFunctionMatch) {
                const args = arrowFunctionMatch[1].trim();
                const body = arrowFunctionMatch[2].trim();
                return new Function(args, body);
            }
            if (regularFunctionMatch) {
                const args = regularFunctionMatch[1].trim();
                const body = regularFunctionMatch[2].trim();
                return new Function(args, body);
            }
            return null;
        }
        catch (error) {
            // console.error("Failed to deserialize function:", error);
            return null;
        }
    }
};
PLUGIN_CLASS.Register(config.addonId, PLUGIN_CLASS);
export {};
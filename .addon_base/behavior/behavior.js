
const config = _lostData.config;
const { icon } = _lostData;
const BEHAVIOR_CLASS = SDK.Behaviors[config.addonId] = class LostBehavior extends SDK.IBehaviorBase {
    constructor() {
        super(config.addonId);
        SDK.Lang.PushContext("behaviors." + config.addonId.toLowerCase());
        this._info.SetName(globalThis.lang(".name"));
        this._info.SetDescription(globalThis.lang(".description"));
        this._info.SetCategory(config.category);
        this._info.SetAuthor(config.author);
        this._info.SetHelpUrl(globalThis.lang(".help-url"));
        this._info.SetIcon(icon.path, icon.iconType);
        this._info.SetIsDeprecated(config.deprecated || false);
        this._info.SetCanBeBundled(config.canBeBundled || true);
        this._info.SetIsOnlyOneAllowed(true);
        SDK.Lang.PushContext(".properties");
        this.setupUserModules();
        this.addRemoteScripts();
        this.addUserFiles();
        this.addUserScripts();
        this.setupPluginProperties();
        SDK.Lang.PopContext(); // .properties
        SDK.Lang.PopContext();
    }
    setupUserModules() {
        this._info.SetRuntimeModuleMainScript('c3runtime/main.js');
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
                    const _initialValue = (_opts.initialValue) ? _opts.initialValue : items[0];
                    properties.push(new SDK.PluginProperty(_opts.type, _id, {
                        items: items,
                        initialValue: _initialValue
                    }));
                    break;
                case "color":
                    // ignore, because link property is not available with behavior addon type
                    break;
                case "object":
                    // ignore, because link property is not available with behavior addon type
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
                    // ignore, because link property is not available with behavior addon type
                    break;
            }
        });
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
BEHAVIOR_CLASS.Register(config.addonId, BEHAVIOR_CLASS);
export {};

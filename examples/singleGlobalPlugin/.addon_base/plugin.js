const { config, icon } = _lostData;
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
        this._info.SetIcon(icon.fileName, icon.iconType);
        this._info.SetIsDeprecated(config.deprecated || false);
        this._info.SetCanBeBundled(config.canBeBundled || true);
        this._info.SetIsSingleGlobal(config.isSingleGlobal || false);
        SDK.Lang.PushContext(".properties");
        this.setupUserModules();
        this.addRemoteScripts();
        this.addUserFiles();
        this.addUserScripts();
        this.setupPluginProperties();
        SDK.Lang.PopContext();
        SDK.Lang.PopContext();
    }
    setupUserModules() {
        if (_lostData.userModules.length > 0) {
            this._info.SetRuntimeModuleMainScript('c3runtime/main.js');
            _lostData.userModules.forEach(file => {
                this._info.AddC3RuntimeScript(`c3runtime/modules/${file.relativePath}`);
            });
        }
    }
    addRemoteScripts() {
        _lostData.remoteScripts.forEach(url => {
            this._info.AddRemoteScriptDependency(url);
        });
    }
    addUserFiles() {
        _lostData.userFiles.forEach(file => {
            if (file.dependencyType === 'copy-to-output') {
                this._info.AddFileDependency({
                    filename: `files/${file.fileName}`,
                    type: file.dependencyType,
                    fileType: file.mimeType
                });
            }
            else {
                this._info.AddFileDependency({
                    filename: `files/${file.fileName}`,
                    type: file.dependencyType
                });
            }
        });
    }
    addUserScripts() {
        _lostData.userScripts.forEach(file => {
            if (file.scriptType) {
                this._info.AddFileDependency({
                    filename: `scripts/${file.relativePath}`,
                    type: file.dependencyType,
                    scriptType: file.scriptType
                });
            }
            else {
                this._info.AddFileDependency({
                    filename: `scripts/${file.relativePath}`,
                    type: file.dependencyType
                });
            }
        });
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
                    properties.push(new SDK.PluginProperty(_opts.type, _id, {
                        infoCallback: () => {
                            return _opts.info;
                        }
                    }));
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

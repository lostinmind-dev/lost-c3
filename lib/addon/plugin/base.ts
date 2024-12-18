// deno-lint-ignore-file
// deno-lint-ignore-file no-fallthrough no-case-declarations
import type { PluginConfig } from '../../lost-config.ts';
import { Property } from '../../entities/plugin-property.ts';

const config = _lostData.config as PluginConfig<any>;
const icon = _lostData.icon;
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
        this._info.SetIcon(icon.name, icon.iconType);

        if (config.deprecated) {
            this._info.SetIsDeprecated(config.deprecated);
        } else {
            this._info.SetIsDeprecated(false);
        }

        if (config.canBeBundled) {
            this._info.SetCanBeBundled(config.canBeBundled);
        } else {
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
            } else {
                this._info.SetIsResizable(true);
            }
            if (config.isRotatable) {
                this._info.SetIsRotatable(config.isRotatable);
            } else {
                this._info.SetIsRotatable(true);
            }
            if (config.is3D) {
                this._info.SetIs3D(config.is3D);
            } else {
                this._info.SetIs3D(false);
            }
            if (config.isTiled) {
                this._info.SetIsTiled(config.isTiled);
            } else {
                this._info.SetIsTiled(false);
            }
            if (_lostData.hasDefaultImage) {
                this._info.SetDefaultImageURL('default.png');
            };
            if (config.supportsZElevation) {
                this._info.SetSupportsZElevation(config.supportsZElevation);
            } else {
                this._info.SetSupportsZElevation(true);
            }
            if (config.supportsColor) {
                this._info.SetSupportsColor(config.supportsColor);
            } else {
                this._info.SetSupportsColor(true);
            }
            if (config.supportsEffects) {
                this._info.SetSupportsEffects(config.supportsEffects);
            } else {
                this._info.SetSupportsEffects(true);
            }
            if (config.mustPreDraw) {
                this._info.SetMustPreDraw(config.mustPreDraw);
            } else {
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
                })

            }
        }

        SDK.Lang.PushContext(".properties");

        this.setupUserModules();
        this.addRemoteScripts();
        this.addUserFiles();
        this.addUserScripts();
        this.setupPluginProperties();

        SDK.Lang.PopContext();
        SDK.Lang.PopContext();
    }

    private setupUserModules() {
        const modules = _lostData.files.filter(file => file.type === 'module-script');
        if (modules.length > 0) {
            this._info.SetRuntimeModuleMainScript('c3runtime/main.js');

            modules.forEach(file => {
                this._info.AddC3RuntimeScript(file.path);
            })
        }
    }

    private addRemoteScripts() {
        _lostData.remoteScripts.forEach(script => {
            if (script.type) {
                this._info.AddRemoteScriptDependency(script.url, script.type);
            } else {
                this._info.AddRemoteScriptDependency(script.url);
            }
        })
    }

    private addUserFiles() {
        const files = _lostData.files.filter(file => file.type === 'file');

        if (files.length > 0) {
            files.forEach(file => {
                if (file.dependencyType === 'copy-to-output') {
                    this._info.AddFileDependency({
                        filename: file.path,
                        type: file.dependencyType,
                        fileType: file.mimeType
                    })
                } else {
                    this._info.AddFileDependency({
                        filename: file.path,
                        type: file.dependencyType || 'copy-to-output'
                    })
                }
            })
        }
    }

    private addUserScripts() {
        const files = _lostData.files.filter(file => file.type === 'script');

        if (files.length > 0) {
            files.forEach(file => {
                this._info.AddFileDependency({
                    filename: file.path,
                    type: file.dependencyType || 'external-dom-script'
                })
            })
        }
    }

    private setupPluginProperties() {
        const properties: SDK.PluginProperty[] = [];

        if (_lostData.properties.length > 0) {
            _lostData.properties.forEach(property => {
                const { id, opts } = property;
                switch (opts.type) {
                    case Property.Integer:
                        if (opts.min && opts.max) {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0,
                                    minValue: opts.min,
                                    maxValue: opts.max
                                })
                            )
                        } else if (opts.min) {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0,
                                    minValue: opts.min,
                                })
                            )
                        } else if (opts.max) {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0,
                                    maxValue: opts.max
                                })
                            )
                        } else {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0
                                })
                            )
                        }
                        break;
                    case Property.Float:
                        if (opts.min && opts.max) {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0,
                                    minValue: opts.min,
                                    maxValue: opts.max
                                })
                            )
                        } else if (opts.min) {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0,
                                    minValue: opts.min,
                                })
                            )
                        } else if (opts.max) {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0,
                                    maxValue: opts.max
                                })
                            )
                        } else {
                            properties.push(
                                new SDK.PluginProperty(opts.type, id, {
                                    initialValue: opts.initialValue || 0
                                })
                            )
                        }
                        break;
                    case Property.Percent:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                initialValue: opts.initialValue || 0
                            }
                            )
                        )
                        break;
                    case Property.Text:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                initialValue: opts.initialValue || ''
                            }
                            )
                        )
                        break;
                    case Property.LongText:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                initialValue: opts.initialValue || ''
                            }
                            )
                        )
                        break;
                    case Property.Checkbox:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                initialValue: opts.initialValue || false
                            }
                            )
                        )
                        break;
                    case Property.Font:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                initialValue: opts.initialValue || 'Arial'
                            }
                            )
                        )
                        break;
                    case Property.Combo:
                        const items = opts.items.map(item => item[0]);
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                items: items,
                                initialValue: opts.initialValue || items[0]
                            }
                            )
                        )
                        break;
                    case Property.Color:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                initialValue: opts.initialValue || [0, 0, 0]
                            }
                            )
                        )
                        break;
                    case Property.Object:
                        properties.push(
                            new SDK.PluginProperty(
                                opts.type, id, {
                                allowedPluginIds: opts.allowedPluginIds || []
                            }
                            )
                        )
                        break;
                    case Property.Group:
                        properties.push(
                            new SDK.PluginProperty(opts.type, id)
                        )
                        break;
                    case Property.Info:
                        const infoFunc = _lostMethods[id];

                        if (infoFunc) {
                            properties.push(
                                new SDK.PluginProperty(
                                    opts.type, id, {
                                    infoCallback: (inst) => {
                                        return infoFunc(inst);
                                    }
                                })
                            )
                        }
                        break;
                    case Property.Link:
                        const linkFunc = _lostMethods[id];

                        if (linkFunc) {
                            properties.push(
                                new SDK.PluginProperty(
                                    opts.type, id, {
                                    callbackType: opts.callbackType,
                                    linkCallback: (instOrType) => {
                                        linkFunc(instOrType);
                                    }
                                }
                                )
                            )
                        }
                        break;
                }
            })
        }

        this._info.SetProperties(properties);
    }
};
PLUGIN_CLASS.Register(config.addonId, PLUGIN_CLASS);
export {};
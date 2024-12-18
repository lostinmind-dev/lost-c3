// deno-lint-ignore-file no-case-declarations
import type { BehaviorConfig } from '../../lost-config.ts';
import { Property } from '../../entities/plugin-property.ts';

const config = _lostData.config as BehaviorConfig;
const icon = _lostData.icon;
const SDK = globalThis.SDK;

const BEHAVIOR_CLASS = SDK.Behaviors[config.addonId] = class LostBehavior extends SDK.IBehaviorBase {
    constructor() {
        super(config.addonId);

        SDK.Lang.PushContext("behaviors." + config.addonId.toLowerCase());
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

        if (config.isOnlyOneAllowed) {
            this._info.SetIsOnlyOneAllowed(config.isOnlyOneAllowed);
        } else {
            this._info.SetIsOnlyOneAllowed(false);
        }

        SDK.Lang.PushContext(".properties");

        this.setupUserModules();
        this.addRemoteScripts();
        this.addUserFiles();
        this.addUserScripts();
        this.setupPluginProperties();

        SDK.Lang.PopContext();	// .properties

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
                        // ignore, because property type is not available with behavior addon type
                        break;
                    case Property.Object:
                        // ignore, because property type is not available with behavior addon type
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
                        // ignore, because link property type is not available with behavior addon type
                        break;
                }
            })
        }

        this._info.SetProperties(properties);
    }
};

BEHAVIOR_CLASS.Register(config.addonId, BEHAVIOR_CLASS);
export {};
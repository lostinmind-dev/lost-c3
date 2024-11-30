import type { BehaviorConfig } from "../../lib/config.ts";
import { Property } from '../../lib/entities/plugin-property.ts';
import type { LostAddonBehaviorData } from '../../shared/types.ts';

const _lostData: LostAddonBehaviorData = {} as LostAddonBehaviorData;
const config = _lostData.config as BehaviorConfig;
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
		this._info.SetIcon(icon.fileName, icon.iconType);
		this._info.SetIsDeprecated(config.deprecated || false);
		this._info.SetCanBeBundled(config.canBeBundled || true);
		this._info.SetIsOnlyOneAllowed(true);

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
		if (_lostData.userModules.length > 0) {
			this._info.SetRuntimeModuleMainScript('c3runtime/main.js');

			_lostData.userModules.forEach(file => {
				this._info.AddC3RuntimeScript(`c3runtime/modules/${file.relativePath}`);
			})
		}
	}

	private addRemoteScripts() {
		_lostData.remoteScripts.forEach(url => {
			this._info.AddRemoteScriptDependency(url);
		})
	}

	private addUserFiles() {
		_lostData.userFiles.forEach(file => {
			if (file.dependencyType === 'copy-to-output') {
				this._info.AddFileDependency({
					filename: `files/${file.relativePath}`,
					type: file.dependencyType,
					fileType: file.mimeType
				})
			} else {
				this._info.AddFileDependency({
					filename: `files/${file.relativePath}`,
					type: file.dependencyType
				})
			}
		})
	}

	private addUserScripts() {
		_lostData.userScripts.forEach(file => {
			if (file.scriptType) {
				this._info.AddFileDependency({
					filename: `scripts/${file.relativePath}`,
					type: file.dependencyType,
					scriptType: file.scriptType
				})
			} else {
				this._info.AddFileDependency({
					filename: `scripts/${file.relativePath}`,
					type: file.dependencyType
				})
			}
		})
	}

	private setupPluginProperties() {
		const properties: SDK.PluginProperty[] = [];

		_lostData.pluginProperties.forEach(property => {
			const { _id, _opts, _funcString } = property;
			switch (_opts.type) {
				case Property.Integer:
					if (_opts.min && _opts.max) {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0,
								minValue: _opts.min,
								maxValue: _opts.max
							})
						)
					} else if (_opts.min) {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0,
								minValue: _opts.min,
							})
						)
					} else if (_opts.max) {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0,
								maxValue: _opts.max
							})
						)
					} else {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0
							})
						)
					}
					break;
				case Property.Float:
					if (_opts.min && _opts.max) {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0,
								minValue: _opts.min,
								maxValue: _opts.max
							})
						)
					} else if (_opts.min) {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0,
								minValue: _opts.min,
							})
						)
					} else if (_opts.max) {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0,
								maxValue: _opts.max
							})
						)
					} else {
						properties.push(
							new SDK.PluginProperty(_opts.type, _id, {
								initialValue: _opts.initialValue || 0
							})
						)
					}
					break;
				case Property.Percent:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							initialValue: _opts.initialValue || 0
						}
						)
					)
					break;
				case Property.Text:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							initialValue: _opts.initialValue || ''
						}
						)
					)
					break;
				case Property.LongText:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							initialValue: _opts.initialValue || ''
						}
						)
					)
					break;
				case Property.Checkbox:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							initialValue: _opts.initialValue || false
						}
						)
					)
					break;
				case Property.Font:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							initialValue: _opts.initialValue || 'Arial'
						}
						)
					)
					break;
				case Property.Combo:
					const items = _opts.items.map(item => item[0]);
					const _initialValue = (_opts.initialValue) ? _opts.initialValue : items[0];
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							items: items,
							initialValue: _initialValue
						}
						)
					)
					break;
				case Property.Color:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							initialValue: _opts.initialValue || [0, 0, 0]
						}
						)
					)
					break;
				case Property.Object:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							allowedPluginIds: _opts.allowedPluginIds || []
						}
						)
					)
					break;
				case Property.Group:
					properties.push(
						new SDK.PluginProperty(_opts.type, _id)
					)
					break;
				case Property.Info:
					properties.push(
						new SDK.PluginProperty(
							_opts.type, _id, {
							infoCallback: (inst) => {
								return _opts.info;
							}
						})
					)
					break;
				case Property.Link:
					const func = this.deserializeFunction(_funcString || '');

					if (func) {
						properties.push(
							new SDK.PluginProperty(
								_opts.type, _id, {
								callbackType: _opts.callbackType,
								linkCallback: (p) => {
									func(p);
								}
							}
							)
						)
					}
					break;
			}
		})

		this._info.SetProperties(properties);
	}

	protected deserializeFunction(funcString: string): Function | null {
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
		} catch (error) {
			// console.error("Failed to deserialize function:", error);
			return null;
		}
	}
};

BEHAVIOR_CLASS.Register(config.addonId, BEHAVIOR_CLASS);

export { }
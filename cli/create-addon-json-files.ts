// deno-lint-ignore-file no-case-declarations
import { join } from '../deps.ts';
import type { Plugin } from "../lib/plugin.ts";
import { Param } from '../lib/entities/parameter.ts';
import { getRelativePath } from '../shared/misc.ts';
import type { 
    AcesJson, AddonJson, AceAction, AceCondition, AceExpression, AceParam, 
    LanguageJson, LanguagePluginProperty, LanguageAction, LanguageParam, LanguageCondition, LanguageExpression
} from "../shared/types.ts";
import { Property } from "../lib/entities/plugin-property.ts";
import { Paths } from "../shared/paths.ts";

export default async function createAddonJsonFiles(plugin: Plugin) {

    await createLanguageJson();
    await createAcesJson();
    await createAddonJson();

    async function createAddonJson() {
        const addonJson: AddonJson = {
            "supports-worker-mode": (plugin._config.supportWorkerMode) ? plugin._config.supportWorkerMode : true,
            "min-construct-version": (plugin._config.minConstructVersion) ? plugin._config.minConstructVersion : undefined,
            "is-c3-addon": true,
            "sdk-version": 2,
            "type": 'plugin',
            "name": plugin._config.addonName,
            "id": plugin._config.addonId,
            "version": plugin._config.version,
            "author": plugin._config.author,
            "website": plugin._config.websiteUrl,
            "documentation": plugin._config.docsUrl,
            "description": plugin._config.addonDescription,
            "editor-scripts": [
                "plugin.js",
                "type.js",
                "instance.js"
            ],
            "file-list": []
        }

        const readDir = async (path: string) => {
            for await (const entry of Deno.readDir(path)) {
                if (entry.isDirectory) {
                    await readDir(join(path, entry.name));
                } else if (entry.isFile){
                    //
                    const filePath = getRelativePath(path, Paths.Build, entry.name).replace(/\\/g, '/');
                    addonJson['file-list'].push(filePath);
                }
            }
        }

        await readDir(Paths.Build);

        addonJson['file-list'].push('addon.json');
        addonJson['file-list'].sort((a, b) => { return b.length - a.length });

        await Deno.writeTextFile(join(Paths.Build, 'addon.json'), JSON.stringify(addonJson, null, 4));
    }

    async function createAcesJson() {
        const AcesJSON: AcesJson = {} as AcesJson;
    
        plugin._categories.forEach(category => {
            AcesJSON[category._id] = {
                'actions': [],
                'conditions': [],
                'expressions': []
            }
    
            category._actions.forEach(action => {
                const {_id, _opts, _params, _func, _isDeprecated} = action;
                const AceAction = {} as AceAction;

                AceAction['id'] = _id;
                AceAction['scriptName'] = _func.name;
                AceAction['highlight'] = _opts?.highlight || false;
                AceAction['isDeprecated'] = _isDeprecated;
                AceAction['isAsync'] = _opts?.isAsync || false;
                AceAction['params'] = [];
    
                _params.forEach(param => {
                    const {_id, _opts} = param;
                    const AceParam = {} as AceParam;
                    AceParam['id'] = _id;
                    AceParam['type'] = _opts.type;
                    switch (_opts.type) {
                        case Param.String:
                            AceParam['initialValue'] = (_opts.initialValue) ? `"${String(_opts.initialValue)}"` : "";
                            AceParam['autocompleteId'] = _opts.autocompleteId || '';
                            break;
                        case Param.Combo:
                            const items = _opts.items.map(item => item[0]);
                            const _initialValue = (_opts.initialValue) ? _opts.initialValue : items[0];
                            AceParam['items'] = items;
                            AceParam['initialValue'] = _initialValue;
                            break;
                        case Param.Object:
                            AceParam['allowedPluginIds'] = _opts.allowedPluginIds || [];
                            break;
                        case Param.Number:
                            AceParam['initialValue'] = String(_opts.initialValue || 0);
                            break;
                        case Param.Any:
                            AceParam['initialValue'] = String(_opts.initialValue || '');
                            break;
                        case Param.Boolean:
                            if (typeof _opts.initialValue === 'boolean') {
                                switch (_opts.initialValue) {
                                    case true:
                                        AceParam['initialValue'] = 'true';
                                        break;
                                    case false:
                                        AceParam['initialValue'] = 'false';
                                        break;
                                }
                            } else {
                                AceParam['initialValue'] = 'false';
                            }
                            break;
                    }

                    AceAction['params'].push(AceParam);
                })
                if (category._isDeprecated) AceAction['isDeprecated'] = true;
                AcesJSON[category._id]['actions'].push(AceAction);
            })
    
            category._conditions.forEach(condition => {
                const {_id, _opts, _params, _func, _isDeprecated} = condition;
                const AceCondition = {} as AceCondition;

                AceCondition['id'] = _id;
                AceCondition['scriptName'] = _func.name;
                AceCondition['highlight'] = _opts?.highlight || false;
                AceCondition['isDeprecated'] = _isDeprecated || false;
                AceCondition['isTrigger'] = _opts?.isTrigger || true;
                AceCondition['isFakeTrigger'] = _opts?.isFakeTrigger || false;
                AceCondition['isStatic'] = _opts?.isStatic || false;
                AceCondition['isLooping'] = _opts?.isLooping || false;
                AceCondition['isInvertible'] = _opts?.isInvertible || true;
                AceCondition['isCompatibleWithTriggers'] = _opts?.isCompatibleWithTriggers || true;
                AceCondition['params'] = [];
    

                _params.forEach(param => {
                    const {_id, _opts} = param;
                    const AceParam = {} as AceParam;
                    AceParam['id'] = _id;
                    AceParam['type'] = _opts.type;
                    switch (_opts.type) {
                        case Param.String:
                            AceParam['initialValue'] = (_opts.initialValue) ? `"${String(_opts.initialValue)}"` : "";
                            AceParam['autocompleteId'] = _opts.autocompleteId || '';
                            break;
                        case Param.Combo:
                            const items = _opts.items.map(item => item[0]);
                            const _initialValue = (_opts.initialValue) ? _opts.initialValue : items[0];
                            AceParam['items'] = items;
                            AceParam['initialValue'] = _initialValue;
                            break;
                        case Param.Object:
                            AceParam['allowedPluginIds'] = _opts.allowedPluginIds || [];
                            break;
                        case Param.Number:
                            AceParam['initialValue'] = String(_opts.initialValue);
                            break;
                        case Param.Any:
                            AceParam['initialValue'] = String(_opts.initialValue);
                            break;
                        case Param.Boolean:
                            if (typeof _opts.initialValue === 'boolean') {
                                switch (_opts.initialValue) {
                                    case true:
                                        AceParam['initialValue'] = 'true';
                                        break;
                                    case false:
                                        AceParam['initialValue'] = 'false';
                                        break;
                                }
                            } else {
                                AceParam['initialValue'] = 'false';
                            }
                            break;
                    }

                    AceCondition['params'].push(AceParam);
                })
                if (category._isDeprecated) AceCondition['isDeprecated'] = true;
                AcesJSON[category._id]['conditions'].push(AceCondition);
            })
    
            category._expressions.forEach(expression => {
                const {_id, _opts, _params, _func, _isDeprecated} = expression;
                const AceExpression = {} as AceExpression;

                AceExpression['id'] = _id;
                AceExpression['expressionName'] = _func.name;
                AceExpression['highlight'] = _opts?.highlight || false;
                AceExpression['isDeprecated'] = _isDeprecated;
                AceExpression['returnType'] = _opts?.returnType || 'any';
                AceExpression['isVariadicParameters'] = _opts?.isVariadicParameters || false;
                AceExpression['params'] = [];

                _params.forEach(param => {
                    const {_id, _opts} = param;
                    const AceParam = {} as AceParam;
                    AceParam['id'] = _id;
                    AceParam['type'] = _opts.type;

                    switch (_opts.type) {
                        case Param.String:
                            AceParam['initialValue'] = (_opts.initialValue) ? `"${String(_opts.initialValue)}"` : "";
                            AceParam['autocompleteId'] = _opts.autocompleteId || '';
                            break;
                        default:
                            AceParam['initialValue'] = (_opts.initialValue) ? `"${String(_opts.initialValue)}"` : "";
                            break;
                        
                    }
                    AceExpression['params'].push(AceParam);
                })
                if (category._isDeprecated) AceExpression['isDeprecated'] = true;
                AcesJSON[category._id]['expressions'].push(AceExpression);
            })
        })
    
        await Deno.writeTextFile(join(Paths.Build, 'aces.json'), JSON.stringify(AcesJSON, null, 4));
    }

    async function createLanguageJson() {
        // const _translate = async (text: string) => {
        //     return await translate(text, getISO639_1(languageTag));
        // }

        const LanguageJSON: LanguageJson = {
            "languageTag": 'en-US',
            "fileDescription": `Strings for ${plugin._config.addonName} addon.`,
            "text": {
                "plugins": {
                    [plugin._config.addonId.toLowerCase()]: {
                        "name": plugin._config.objectName,
                        "description": plugin._config.addonDescription,
                        "help-url": plugin._config.helpUrl.EN,
                        "properties": {},
                        "aceCategories": {},
                        "conditions": {},
                        "actions": {},
                        "expressions": {}
                    }
                }
            }
        };
    
        const DeepJSON = LanguageJSON['text']['plugins'][plugin._config.addonId.toLowerCase()];
    
        plugin._pluginProperties.forEach(property => {
            const {_id, _name, _description, _opts} = property;
            const LangPP = {} as LanguagePluginProperty;
            LangPP['name'] = _name;
            LangPP['desc'] = _description;
            switch (_opts.type) {
                case Property.Combo:
                    
                    LangPP['items'] = {};
                    _opts.items.forEach(item => {
                        (LangPP['items'] as {[itemsId: string]: string})[item[0]] = item[1];
                    })
                    break;
            }
            DeepJSON['properties'][_id] = LangPP;
        })


        plugin._categories.forEach(category => {
            DeepJSON['aceCategories'][category._id] = category._name;        
    
            category._actions.forEach(action => {
                const {_id, _name, _displayText, _description, _params} = action;
                const LanguageAction = {} as LanguageAction;
                LanguageAction['list-name'] = _name;
                LanguageAction['display-text'] = _displayText;
                LanguageAction['description'] = _description;
                LanguageAction['params'] = {};
                _params.forEach(param => {
                    const {_id, _name, _description, _opts} = param;
                    const LanguageParam = {} as LanguageParam;
                    LanguageParam['name'] = _name;
                    LanguageParam['desc'] = _description;
                    switch (_opts.type) {
                        case Param.Combo:
                            LanguageParam['items'] = {};
                            _opts.items.forEach(item => {
                                (LanguageParam['items'] as {[itemsId: string]: string})[item[0]] = item[1];
                            })
                            break;
                    }
                    LanguageAction['params'][_id] = LanguageParam;
                })
                DeepJSON['actions'][_id] = LanguageAction;
            })
    
            category._conditions.forEach(condition => {
                const {_id, _name, _displayText, _description, _params} = condition;
                const LanguageCondition = {} as LanguageCondition;
                LanguageCondition['list-name'] = _name;
                LanguageCondition['display-text'] = _displayText;
                LanguageCondition['description'] = _description;
                LanguageCondition['params'] = {};
    
                _params.forEach(param => {
                    const {_id, _name, _description, _opts} = param;
                    const LanguageParam = {} as LanguageParam;
                    LanguageParam['name'] = _name;
                    LanguageParam['desc'] = _description;
                    switch (_opts.type) {
                        case Param.Combo:
                            LanguageParam['items'] = {};
                            _opts.items.forEach(item => {
                                (LanguageParam['items'] as {[itemsId: string]: string})[item[0]] = item[1];
                            })
                            break;
                    }
                    LanguageCondition['params'][_id] = LanguageParam;
                })
                DeepJSON['conditions'][_id] = LanguageCondition;
            })
    
            category._expressions.forEach(expression => {
                const {_id, _name, _description, _params} = expression;
                const LanguageExpression = {} as LanguageExpression;
                LanguageExpression['translated-name'] = _name;
                LanguageExpression['description'] = _description;
                LanguageExpression['params'] = {};
    
                _params.forEach(param => {
                    const {_id, _name, _description, _opts} = param;
                    const LanguageParam = {} as LanguageParam;
                    LanguageParam['name'] = _name;
                    LanguageParam['desc'] = _description;
                    LanguageExpression['params'][_id] = LanguageParam;
                })
                DeepJSON['expressions'][_id] = LanguageExpression;
            })
        })
    
        await Deno.writeTextFile(join(Paths.Build, 'lang', 'en-US.json'), JSON.stringify(LanguageJSON, null, 4));
    }
}
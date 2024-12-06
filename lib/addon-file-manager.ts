// deno-lint-ignore-file no-case-declarations

import { join } from "../deps.ts";
import { dedent, findClassesInheritingFrom, getRelativePath, serializeObjectWithFunctions } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";
import { transpileTs } from "../shared/transpile-ts.ts";
import type {
    AcesJson, AddonJson, AceAction, AceCondition, AceExpression, AceParam,
    LanguageJson, LanguagePluginProperty, LanguageAction, LanguageParam,
    LanguageCondition, LanguageExpression, EntityCollection
} from "../shared/types.ts";
import type { AddonType, LostConfig } from "./config.ts";
import type { CategoryClassType } from "./entities/category.ts";
import { Param } from "./entities/parameter.ts";
import { Property, type PluginProperty } from "./entities/plugin-property.ts";
import type { LostAddonData } from "./lost-addon-data.ts";

export enum RuntimeScript {
    Module = 'main.js',
    Actions = 'actions.js',
    Conditions = 'conditions.js',
    Expressions = 'expressions.js',
    Instance = 'instance.js',
    Plugin = 'plugin.js',
    Behavior = 'behavior.js',
    Type = 'type.js'
}

export enum EditorScript {
    Plugin = 'plugin.js',
    Instance = 'instance.js',
    Behavior = 'behavior.js',
    Type = 'type.js'
}

export enum JsonFile {
    AddonMetadata = 'addon.json',
    Aces = 'aces.json',
    Language = 'en-US.json'
}

export abstract class AddonFileManager {

    static async #getDirectoryFiles(directoryPath: string): Promise<string[]> {
        const files: string[] = [];

        const readDir = async (path: string) => {
            for await (const entry of Deno.readDir(path)) {
                if (entry.isDirectory) {
                    await readDir(join(path, entry.name));
                } else if (entry.isFile) {
                    //
                    const filePath = getRelativePath(path, directoryPath, entry.name).replace(/\\/g, '/');
                    files.push(filePath);
                }
            }
        }

        await readDir(directoryPath);
        return files;
    }

    static #initModuleFile(addonType: AddonType) {
        const scripts: string[] = [];

        for (const [type, scriptName] of Object.entries(RuntimeScript)) {
            if (scriptName !== RuntimeScript.Module) {
                if (
                    addonType === 'plugin' &&
                    scriptName !== RuntimeScript.Behavior
                ) {
                    scripts.push(
                        `import './${scriptName}';\n`
                    );
                } else if (
                    addonType === 'behavior' &&
                    scriptName !== RuntimeScript.Plugin
                ) {
                    scripts.push(
                        `import './${scriptName}';\n`
                    );
                }
            }
        }

        let fileContent: string = '';

        scripts.forEach(script => {
            fileContent = fileContent + script;
        })

        return fileContent;
    }

    public static async createRuntimeScript(scriptType: RuntimeScript, config: LostConfig<AddonType>): Promise<void>
    public static async createRuntimeScript(scriptType: RuntimeScript, config: LostConfig<AddonType>, categories: CategoryClassType[]): Promise<void>
    public static async createRuntimeScript(scriptType: RuntimeScript, config: LostConfig<AddonType>, categories?: CategoryClassType[]): Promise<void> {
        let script: string;
        let assign: string;
        let className: string;
        let fileContent: string = '';

        let entities: EntityCollection = {};
        switch (scriptType) {
            case RuntimeScript.Module:
                fileContent = this.#initModuleFile(config.type);
                break;
            case RuntimeScript.Actions:
                if (categories) {
                    categories.forEach(category => category._actions.forEach(enitity => {
                        entities[enitity._func.name] = enitity._func;
                    }))
                }

                switch (config.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${config.addonId}"].Acts = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${config.addonId}"].Acts = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScript.Conditions:
                if (categories) {
                    categories.forEach(category => category._conditions.forEach(enitity => {
                        entities[enitity._func.name] = enitity._func;
                    }))
                }

                switch (config.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${config.addonId}"].Cnds = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${config.addonId}"].Cnds = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScript.Expressions:
                if (categories) {
                    categories.forEach(category => category._expressions.forEach(enitity => {
                        entities[enitity._func.name] = enitity._func;
                    }))
                }

                switch (config.type) {
                    case "plugin":
fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${config.addonId}"].Exps = ${serializeObjectWithFunctions(entities)}
`       
                        break;
                    case "behavior":
fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${config.addonId}"].Exps = ${serializeObjectWithFunctions(entities)}
`      
                        break;
                }

                break;
            case RuntimeScript.Instance:
                script = await transpileTs(
                    join(Paths.Main, 'Addon', 'Instance.ts')
                ) || '';
                
                switch (config.type) {
                    case "plugin":
                        switch (config.pluginType) {
                            case "object":
                                className = findClassesInheritingFrom(script, 'globalThis.ISDKInstanceBase');
                                break;
                            case "world":
                                className = findClassesInheritingFrom(script, 'globalThis.ISDKWorldInstanceBase');
                                break;
                        }
                        assign = `globalThis.C3.Plugins["${config.addonId}"].Instance = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorInstanceBase');
                        assign = `globalThis.C3.Behaviors["${config.addonId}"].Instance = ${className};`;
                        break;
                }

fileContent = dedent`
${script}
${assign}
`
                break;
            case RuntimeScript.Plugin:
                script = await transpileTs(
                    join(Paths.Main, 'Addon', 'Plugin.ts')
                ) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKPluginBase');
                assign = `globalThis.C3.Plugins["${config.addonId}"] = ${className};`;

fileContent = dedent`
${script}
${assign}
`
                break;
            case RuntimeScript.Behavior:
                script = await transpileTs(
                    join(Paths.Main, 'Addon', 'Behavior.ts')
                ) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorBase');
                assign = `globalThis.C3.Behaviors["${config.addonId}"] = ${className};`;

fileContent = dedent`
${script}
${assign}
`
                break;
            case RuntimeScript.Type:
                script = await transpileTs(
                    join(Paths.Main, 'Addon', 'Type.ts')
                ) || '';

                switch (config.type) {
                    case "plugin":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKObjectTypeBase');
                        assign = `globalThis.C3.Plugins["${config.addonId}"].Type = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorTypeBase');
                        assign = `globalThis.C3.Behaviors["${config.addonId}"].Type = ${className};`;
                        break;
                }

fileContent = dedent`
${script}
${assign}
`

                break;
        }

        await this.#saveScript(fileContent, join(Paths.Build, 'c3runtime', scriptType));
    }

    public static async createEditorScript(scriptType: EditorScript, config: LostConfig<AddonType>): Promise<void>;
    public static async createEditorScript(scriptType: EditorScript, config: LostConfig<AddonType>, lostData: LostAddonData): Promise<void>;
    public static async createEditorScript(scriptType: EditorScript, config: LostConfig<AddonType>, lostData?: LostAddonData): Promise<void> {
        let script: string;
        let assign: string;
        let className: string;
        let fileContent: string = '';

        switch (scriptType) {
            case EditorScript.Plugin:
                fileContent = await Deno.readTextFile(Paths.LocalAddonBase[config.type]);

fileContent = dedent`
const _lostData = ${JSON.stringify(lostData)};
${fileContent}
`

                break;
            case EditorScript.Behavior:
                fileContent = await Deno.readTextFile(Paths.LocalAddonBase[config.type]);

fileContent = dedent`
const _lostData = ${JSON.stringify(lostData)};
${fileContent}
`

                break;
            case EditorScript.Instance:
                script = await transpileTs(
                    join(Paths.Main, 'Editor', 'Instance.ts')
                ) || '';

                switch (config.type) {
                    case "plugin":
                        switch (config.pluginType) {
                            case "object":
                                className = findClassesInheritingFrom(script, 'SDK.IInstanceBase');
                                break;
                            case "world":
                                className = findClassesInheritingFrom(script, 'SDK.IWorldInstanceBase');
                                break;
                            }
                        assign = `globalThis.SDK.Plugins["${config.addonId}"].Instance = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'SDK.IBehaviorInstanceBase');
                        assign = `globalThis.SDK.Behaviors["${config.addonId}"].Instance = ${className};`;
                        break;
                }

fileContent = dedent`
${script}
${assign}
`
                break;
            case EditorScript.Type:
                script = await transpileTs(
                    join(Paths.Main, 'Editor', 'Type.ts')
                ) || '';

                switch (config.type) {
                    case "plugin":
                        className = findClassesInheritingFrom(script, 'SDK.ITypeBase');
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'SDK.IBehaviorTypeBase');
                        break;
                }

                switch (config.type) {
                    case "plugin":
                        assign = `globalThis.SDK.Plugins["${config.addonId}"].Type = ${className};`;
                        break;
                    case "behavior":
                        assign = `globalThis.SDK.Behaviors["${config.addonId}"].Type = ${className};`;
                        break;
                }

fileContent = dedent`
${script}
${assign}
`
                break;
        }

        await this.#saveScript(fileContent, join(Paths.Build, scriptType));
    }

    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>): Promise<void>
    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>, categories: CategoryClassType[]): Promise<void>
    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>, categories: CategoryClassType[], pluginProperties: PluginProperty<any, any, any>[]): Promise<void>
    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>, categories?: CategoryClassType[], pluginProperties?: PluginProperty<any, any, any>[]): Promise<void> {

        switch (jsonType) {
            case JsonFile.AddonMetadata:
                const addonJson: AddonJson = {
                    "supports-worker-mode": (config.supportWorkerMode) ? config.supportWorkerMode : true,
                    "min-construct-version": (config.minConstructVersion) ? config.minConstructVersion : undefined,
                    "is-c3-addon": true,
                    "sdk-version": 2,
                    "type": config.type,
                    "name": config.addonName,
                    "id": config.addonId,
                    "version": config.version,
                    "author": config.author,
                    "website": config.websiteUrl,
                    "documentation": config.docsUrl,
                    "description": config.addonDescription,
                    "editor-scripts": [
                        "type.js",
                        "instance.js"
                    ],
                    "file-list": await this.#getDirectoryFiles(Paths.Build)
                }

                switch (config.type) {
                    case "plugin":
                        addonJson['editor-scripts'].push('plugin.js');
                        break;
                    case "behavior":
                        addonJson['editor-scripts'].push('behavior.js');
                        break;
                }

                await Deno.writeTextFile(join(Paths.Build, jsonType), JSON.stringify(addonJson, null, 4));
                break;
            case JsonFile.Aces:
                const AcesJSON: AcesJson = {} as AcesJson;

                if (categories) {
                    categories.forEach(category => {
                        AcesJSON[category._id] = {
                            'actions': [],
                            'conditions': [],
                            'expressions': []
                        }
    
                        category._actions.forEach(action => {
                            const { _id, _opts, _params, _func, _isDeprecated } = action;
                            const AceAction = {} as AceAction;
    
                            AceAction['id'] = _id;
                            AceAction['scriptName'] = _func.name;
                            AceAction['highlight'] = _opts?.highlight || false;
                            AceAction['isDeprecated'] = _isDeprecated;
                            AceAction['isAsync'] = _opts?.isAsync || false;
                            AceAction['params'] = [];
    
                            _params.forEach(param => {
                                const { _id, _opts } = param;
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
                            const { _id, _opts, _params, _func, _isDeprecated } = condition;
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
                                const { _id, _opts } = param;
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
                            const { _id, _opts, _params, _func, _isDeprecated } = expression;
                            const AceExpression = {} as AceExpression;
    
                            AceExpression['id'] = _id;
                            AceExpression['expressionName'] = _func.name;
                            AceExpression['highlight'] = _opts?.highlight || false;
                            AceExpression['isDeprecated'] = _isDeprecated;
                            AceExpression['returnType'] = _opts?.returnType || 'any';
                            AceExpression['isVariadicParameters'] = _opts?.isVariadicParameters || false;
                            AceExpression['params'] = [];
    
                            _params.forEach(param => {
                                const { _id, _opts } = param;
                                const AceParam = {} as AceParam;
                                AceParam['id'] = _id;
                                AceParam['type'] = _opts.type;
    
                                switch (_opts.type) {
                                    case Param.String:
                                        AceParam['initialValue'] = (_opts.initialValue) ? `"${String(_opts.initialValue)}"` : "";
                                        AceParam['autocompleteId'] = _opts.autocompleteId || '';
                                        break;
                                    default:
                                        break;
    
                                }
                                AceExpression['params'].push(AceParam);
                            })
                            if (category._isDeprecated) AceExpression['isDeprecated'] = true;
                            AcesJSON[category._id]['expressions'].push(AceExpression);
                        })
                    })
                }


                await Deno.writeTextFile(join(Paths.Build, jsonType), JSON.stringify(AcesJSON, null, 4));
                break;
            case JsonFile.Language:
                let pluralAddonType: 'plugins' | 'behaviors';
                const lowerCasedAddonId = config.addonId.toLowerCase();
                const LanguageJSON: LanguageJson = {
                    "languageTag": 'en-US',
                    "fileDescription": `Strings for ${config.addonName} addon.`,
                    "text": {
                        "plugins": {},
                        "behaviors": {}
                    }
                }

                switch (config.type) {
                    case "plugin":
                        pluralAddonType = 'plugins';
                        LanguageJSON['text']['plugins'] = {
                            [lowerCasedAddonId]: {
                                "name": config.objectName,
                                "description": config.addonDescription,
                                "help-url": config.helpUrl.EN,
                                "properties": {},
                                "aceCategories": {},
                                "conditions": {},
                                "actions": {},
                                "expressions": {}
                            }
                        }
                        break;
                    case "behavior":
                        pluralAddonType = 'behaviors';
                        LanguageJSON['text']['behaviors'] = {
                            [lowerCasedAddonId]: {
                                "name": config.objectName,
                                "description": config.addonDescription,
                                "help-url": config.helpUrl.EN,
                                "properties": {},
                                "aceCategories": {},
                                "conditions": {},
                                "actions": {},
                                "expressions": {}
                            }
                        }
                        break;
                }

                const DeepJSON = LanguageJSON['text'][pluralAddonType][lowerCasedAddonId];

                if (pluginProperties) {
                    pluginProperties.forEach(property => {
                        const { _id, _name, _description, _opts } = property;
                        const LangPP = {} as LanguagePluginProperty;
                        LangPP['name'] = _name;
                        LangPP['desc'] = _description;
                        switch (_opts.type) {
                            case Property.Combo:
    
                                LangPP['items'] = {};
                                _opts.items.forEach(item => {
                                    (LangPP['items'] as { [itemsId: string]: string })[item[0]] = item[1];
                                })
                                break;
                        }
                        DeepJSON['properties'][_id] = LangPP;
                    })
                }

                if (categories) {
                    categories.forEach(category => {
                        DeepJSON['aceCategories'][category._id] = category._name;
    
                        category._actions.forEach(action => {
                            const { _id, _name, _displayText, _description, _params } = action;
                            const LanguageAction = {} as LanguageAction;
                            LanguageAction['list-name'] = _name;
                            LanguageAction['display-text'] = _displayText;
                            LanguageAction['description'] = _description;
                            LanguageAction['params'] = {};
                            _params.forEach(param => {
                                const { _id, _name, _description, _opts } = param;
                                const LanguageParam = {} as LanguageParam;
                                LanguageParam['name'] = _name;
                                LanguageParam['desc'] = _description;
                                switch (_opts.type) {
                                    case Param.Combo:
                                        LanguageParam['items'] = {};
                                        _opts.items.forEach(item => {
                                            (LanguageParam['items'] as { [itemsId: string]: string })[item[0]] = item[1];
                                        })
                                        break;
                                }
                                LanguageAction['params'][_id] = LanguageParam;
                            })
                            DeepJSON['actions'][_id] = LanguageAction;
                        })
    
                        category._conditions.forEach(condition => {
                            const { _id, _name, _displayText, _description, _params } = condition;
                            const LanguageCondition = {} as LanguageCondition;
                            LanguageCondition['list-name'] = _name;
                            LanguageCondition['display-text'] = _displayText;
                            LanguageCondition['description'] = _description;
                            LanguageCondition['params'] = {};
    
                            _params.forEach(param => {
                                const { _id, _name, _description, _opts } = param;
                                const LanguageParam = {} as LanguageParam;
                                LanguageParam['name'] = _name;
                                LanguageParam['desc'] = _description;
                                switch (_opts.type) {
                                    case Param.Combo:
                                        LanguageParam['items'] = {};
                                        _opts.items.forEach(item => {
                                            (LanguageParam['items'] as { [itemsId: string]: string })[item[0]] = item[1];
                                        })
                                        break;
                                }
                                LanguageCondition['params'][_id] = LanguageParam;
                            })
                            DeepJSON['conditions'][_id] = LanguageCondition;
                        })
    
                        category._expressions.forEach(expression => {
                            const { _id, _name, _description, _params } = expression;
                            const LanguageExpression = {} as LanguageExpression;
                            LanguageExpression['translated-name'] = _name;
                            LanguageExpression['description'] = _description;
                            LanguageExpression['params'] = {};
    
                            _params.forEach(param => {
                                const { _id, _name, _description, _opts } = param;
                                const LanguageParam = {} as LanguageParam;
                                LanguageParam['name'] = _name;
                                LanguageParam['desc'] = _description;
                                LanguageExpression['params'][_id] = LanguageParam;
                            })
                            DeepJSON['expressions'][_id] = LanguageExpression;
                        })
                    })
                }

                await Deno.writeTextFile(join(Paths.Build, 'lang', jsonType), JSON.stringify(LanguageJSON, null, 4));
                break;
        }
    }

    static async #saveScript(content: string, path: string) {
        await Deno.writeTextFile(join(path), content);
    }

}
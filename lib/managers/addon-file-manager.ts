// deno-lint-ignore-file no-case-declarations

import { join, UglifyJS } from "../../deps.ts";
import { dedent, findClassesInheritingFrom, getRelativePath, serializeObjectWithFunctions } from "../../shared/misc.ts";
import { Paths } from "../../shared/paths.ts";
import { transpileTs } from "../../shared/transpile-ts.ts";
import type { EntityCollection } from "../../shared/types.ts";
import { AcesManager } from "./aces-manager.ts";
import { AddonMetadataManager } from "./addon-metadata-manager.ts";

import type { AddonType, LostConfig } from "../config.ts";
import { getDefaultLost } from "../defaults/lost.ts";
import type { CategoryClassType } from "../entities/category.ts";
import { Property, type PluginProperty } from "../entities/plugin-property.ts";
import { LanguageManager } from "./language-manager.ts";
import type { LostAddonData } from "../lost-addon-data.ts";

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
    static minify: boolean = false;

    static async getDirectoryFiles(directoryPath: string): Promise<string[]> {
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

    /** @deprecated */
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
${getDefaultLost(config).value}
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
${getDefaultLost(config).value}
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
${getDefaultLost(config).value}
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
${getDefaultLost(config).value}
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

        const methods: { [key: string]: Function } = {};
        let methodsAsString: string
        switch (scriptType) {
            case EditorScript.Plugin:
                if (
                    lostData &&
                    lostData.pluginProperties.length > 0
                ) {
                    lostData.pluginProperties.forEach(p => {
                        if (
                            p._opts.type === Property.Info ||
                            p._opts.type === Property.Link
                        ) {
                            methods[p._id] = p._opts.callback;
                        }
                    })
                }

                methodsAsString = Object.entries(methods)
                    .map(([key, value]) => dedent`  ${key}: ${value.toString()}`)
                    .join(',\n');
                fileContent = await Deno.readTextFile(Paths.LocalAddonBase[config.type]);

                fileContent = dedent`
const _lostMethods = {
    ${methodsAsString}
};
const _lostData = ${JSON.stringify(lostData)};
${fileContent}
`

                break;
            case EditorScript.Behavior:
                if (
                    lostData &&
                    lostData.pluginProperties.length > 0
                ) {
                    lostData.pluginProperties.forEach(p => {
                        if (
                            p._opts.type === Property.Info ||
                            p._opts.type === Property.Link
                        ) {
                            methods[p._id] = p._opts.callback;
                        }
                    })
                }

                methodsAsString = Object.entries(methods)
                    .map(([key, value]) => dedent`  ${key}: ${value.toString()}`)
                    .join(',\n');
                fileContent = await Deno.readTextFile(Paths.LocalAddonBase[config.type]);

                fileContent = dedent`
const _lostMethods = {
    ${methodsAsString}
};
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
${getDefaultLost(config).value}
${script}
setTimeout(() => {
    ${assign}
})
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
${getDefaultLost(config).value}
${script}
setTimeout(() => {
    ${assign}
})
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
                const AddonJSON = await AddonMetadataManager.create(config);

                if (AddonFileManager.minify) {
                    await Deno.writeTextFile(join(Paths.Build, jsonType), JSON.stringify(AddonJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.Build, jsonType), JSON.stringify(AddonJSON, null, 4));
                }

                break;
            case JsonFile.Aces:
                const AcesJSON = AcesManager.create(categories || []);

                if (AddonFileManager.minify) {
                    await Deno.writeTextFile(join(Paths.Build, jsonType), JSON.stringify(AcesJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.Build, jsonType), JSON.stringify(AcesJSON, null, 4));
                }

                break;
            case JsonFile.Language:
                const LanguageJSON = LanguageManager.create(categories || [], pluginProperties || [], config);

                if (AddonFileManager.minify) {
                    await Deno.writeTextFile(join(Paths.Build, 'lang', jsonType), JSON.stringify(LanguageJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.Build, 'lang', jsonType), JSON.stringify(LanguageJSON, null, 4));
                }
                break;
        }
    }

    static async #saveScript(content: string, path: string) {
        if (AddonFileManager.minify) {
            const options = {
                mangle: {
                    toplevel: true,
                },
                nameCache: {}
            };
            content = UglifyJS.minify(content, options).code
        }

        await Deno.writeTextFile(join(path), content);
    }

}
// deno-lint-ignore-file no-case-declarations

import { join, UglifyJS } from "../../deps.ts";
import { dedent, findClassesInheritingFrom, serializeObjectWithFunctions } from "../../shared/misc.ts";
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
import { EditorScript, JsonFile, RuntimeScript } from "../../shared/paths/addon-files.ts";
import { ProjectFolders } from "../../shared/paths/project-folders.ts";

export abstract class AddonFileManager {
    static minify: boolean = false;

    static getLocalFilePath(path: string, folderName: 'Modules',) {
        const normalizedPath = path.replace(/\\/g, '/'); // Приводим к универсальному виду
        const regex = new RegExp(`/${folderName}/`);
        const match = normalizedPath.match(regex);

        if (!match) {
            // Если папка не найдена, возвращаем исходный путь
            return path;
        }

        // Индекс конца первого вхождения папки
        const endIndex = normalizedPath.indexOf(match[0]) + match[0].length;

        // Отрезаем путь до и включая первую папку
        return normalizedPath.slice(endIndex);
    }

    static async getFilesList(): Promise<string[]> {
        const files: string[] = [];

        const readDir = async (path: string) => {
            for await (const entry of Deno.readDir(path)) {
                if (entry.isDirectory) {
                    await readDir(join(path, entry.name));
                } else if (entry.isFile) {
                    
                    const filePath = join(...Paths.getFoldersAfterFolder(path, ProjectFolders.Source), entry.name).replace(/\\/g, '/');

                    files.push(filePath);
                }
            }
        }

        await readDir(Paths.ProjectFolders.Build);
        return files;
    }

    /** @deprecated */
    static #initModuleFile(addonType: AddonType) {

        let fileContent: string = dedent`
import "./plugin.js"
import "./type.js"
import "./instance.js"
import "./actions.js"
import "./conditions.js"
import "./expressions.js"
`;

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
                script = await transpileTs(Paths.ProjectFiles.RuntimeInstance) || '';

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
                script = await transpileTs(Paths.ProjectFiles.RuntimePlugin) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKPluginBase');
                assign = `globalThis.C3.Plugins["${config.addonId}"] = ${className};`;

                fileContent = dedent`
${getDefaultLost(config).value}
${script}
${assign}
`
                break;
            case RuntimeScript.Behavior:
                script = await transpileTs(Paths.ProjectFiles.RuntimeBehavior) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorBase');
                assign = `globalThis.C3.Behaviors["${config.addonId}"] = ${className};`;

                fileContent = dedent`
${getDefaultLost(config).value}
${script}
${assign}
`
                break;
            case RuntimeScript.Type:
                script = await transpileTs(Paths.ProjectFiles.RuntimeType) || '';

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

        await this.#saveScript(fileContent, join(Paths.AddonFolders.Runtime, scriptType));
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
                fileContent = await Deno.readTextFile(Paths.ProjectFiles.AddonBase[config.type]);

                fileContent = dedent`
const _lostMethods = {
    ${methodsAsString}
};
const _lostData = ${JSON.stringify(lostData, null, 4)};
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
                fileContent = await Deno.readTextFile(Paths.ProjectFiles.AddonBase[config.type]);

                fileContent = dedent`
const _lostMethods = {
    ${methodsAsString}
};
const _lostData = ${JSON.stringify(lostData)};
${fileContent}
`

                break;
            case EditorScript.Instance:
                script = await transpileTs(Paths.ProjectFiles.EditorInstance) || '';

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
                script = await transpileTs(Paths.ProjectFiles.EditorType) || '';

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

        await this.#saveScript(fileContent, join(Paths.ProjectFolders.Build, scriptType));
    }

    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>): Promise<void>
    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>, categories: CategoryClassType[]): Promise<void>
    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>, categories: CategoryClassType[], pluginProperties: PluginProperty<any, any, any>[]): Promise<void>
    public static async createJson(jsonType: JsonFile, config: LostConfig<AddonType>, categories?: CategoryClassType[], pluginProperties?: PluginProperty<any, any, any>[]): Promise<void> {

        switch (jsonType) {
            case JsonFile.AddonMetadata:
                const AddonJSON = await AddonMetadataManager.create(config);

                if (AddonFileManager.minify) {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, jsonType), JSON.stringify(AddonJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, jsonType), JSON.stringify(AddonJSON, null, 4));
                }

                break;
            case JsonFile.Aces:
                const AcesJSON = AcesManager.create(categories || []);

                if (AddonFileManager.minify) {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, jsonType), JSON.stringify(AcesJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, jsonType), JSON.stringify(AcesJSON, null, 4));
                }

                break;
            case JsonFile.Language:
                const LanguageJSON = LanguageManager.create(categories || [], pluginProperties || [], config);

                if (AddonFileManager.minify) {
                    await Deno.writeTextFile(join(Paths.AddonFolders.Lang, jsonType), JSON.stringify(LanguageJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.AddonFolders.Lang, jsonType), JSON.stringify(LanguageJSON, null, 4));
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
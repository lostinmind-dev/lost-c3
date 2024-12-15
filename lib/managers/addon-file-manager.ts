// deno-lint-ignore-file no-case-declarations

import { join, UglifyJS } from "../../deps.ts";
import { dedent, findClassesInheritingFrom, serializeObjectWithFunctions } from "../../shared/misc.ts";
import { Paths } from "../../shared/paths.ts";
import { transpileTs } from "../../shared/transpile-ts.ts";
import type { EntityCollection } from "../../shared/types.ts";
import { AcesManager } from "./aces-manager.ts";
import { AddonMetadataManager } from "./addon-metadata-manager.ts";
import { getDefaultLost } from "../defaults/lost.ts";
import { Property } from "../entities/plugin-property.ts";
import { LanguageManager } from "./language-manager.ts";
import { EditorScriptType, JsonFileType, RuntimeScriptType } from "../../shared/paths/addon-files.ts";
import { ProjectFolders } from "../../shared/paths/project-folders.ts";
import { LostAddonProject } from "../lost.ts";

export abstract class AddonFileManager {
    static #addonConfig = LostAddonProject.addon._config;
    static #categories = LostAddonProject.addon._categories;
    static #properties = LostAddonProject.addon._properties;

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

    static #initModuleFile() {

        let fileContent: string = dedent`
import "./${this.#addonConfig.type}.js"
import "./type.js"
import "./instance.js"
import "./actions.js"
import "./conditions.js"
import "./expressions.js"
`;

        return fileContent;
    }

    static async createRuntimeScript(type: RuntimeScriptType): Promise<void> {
        let script: string;
        let assign: string;
        let className: string;
        let fileContent: string = '';

        let entities: EntityCollection = {};
        switch (type) {
            case RuntimeScriptType.Module:
                fileContent = this.#initModuleFile();
                break;
            case RuntimeScriptType.Actions:
                this.#categories.forEach(category => category._actions.forEach(enitity => {
                    entities[enitity._func.name] = enitity._func;
                }))

                switch (this.#addonConfig.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${this.#addonConfig.addonId}"].Acts = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${this.#addonConfig.addonId}"].Acts = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScriptType.Conditions:
                this.#categories.forEach(category => category._conditions.forEach(enitity => {
                    entities[enitity._func.name] = enitity._func;
                }))

                switch (this.#addonConfig.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${this.#addonConfig.addonId}"].Cnds = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${this.#addonConfig.addonId}"].Cnds = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScriptType.Expressions:
                this.#categories.forEach(category => category._expressions.forEach(enitity => {
                    entities[enitity._func.name] = enitity._func;
                }))

                switch (this.#addonConfig.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${this.#addonConfig.addonId}"].Exps = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${this.#addonConfig.addonId}"].Exps = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScriptType.Instance:
                script = await transpileTs(Paths.ProjectFiles.RuntimeInstance) || '';

                switch (this.#addonConfig.type) {
                    case "plugin":
                        switch (this.#addonConfig.pluginType) {
                            case "object":
                                className = findClassesInheritingFrom(script, 'globalThis.ISDKInstanceBase');
                                break;
                            case "world":
                                className = findClassesInheritingFrom(script, 'globalThis.ISDKWorldInstanceBase');
                                break;
                        }
                        assign = `globalThis.C3.Plugins["${this.#addonConfig.addonId}"].Instance = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorInstanceBase');
                        assign = `globalThis.C3.Behaviors["${this.#addonConfig.addonId}"].Instance = ${className};`;
                        break;
                }

                fileContent = dedent`
${getDefaultLost(this.#addonConfig).value}
${script}
${assign}
`
                break;
            case RuntimeScriptType.Plugin:
                script = await transpileTs(Paths.ProjectFiles.RuntimePlugin) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKPluginBase');
                assign = `globalThis.C3.Plugins["${this.#addonConfig.addonId}"] = ${className};`;

                fileContent = dedent`
${getDefaultLost(this.#addonConfig).value}
${script}
${assign}
`
                break;
            case RuntimeScriptType.Behavior:
                script = await transpileTs(Paths.ProjectFiles.RuntimeBehavior) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorBase');
                assign = `globalThis.C3.Behaviors["${this.#addonConfig.addonId}"] = ${className};`;

                fileContent = dedent`
${getDefaultLost(this.#addonConfig).value}
${script}
${assign}
`
                break;
            case RuntimeScriptType.Type:
                script = await transpileTs(Paths.ProjectFiles.RuntimeType) || '';

                switch (this.#addonConfig.type) {
                    case "plugin":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKObjectTypeBase');
                        assign = `globalThis.C3.Plugins["${this.#addonConfig.addonId}"].Type = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorTypeBase');
                        assign = `globalThis.C3.Behaviors["${this.#addonConfig.addonId}"].Type = ${className};`;
                        break;
                }

                fileContent = dedent`
${getDefaultLost(this.#addonConfig).value}
${script}
${assign}
`

                break;
        }

        await this.#saveScript(fileContent, join(Paths.AddonFolders.Runtime, type));
    }

    static async createEditorScript(type: EditorScriptType): Promise<void> {
        let script: string;
        let assign: string;
        let className: string;
        let fileContent: string = '';

        const methods: { [key: string]: Function } = {};
        let methodsAsString: string

        if (
            type === EditorScriptType.Plugin ||
            type === EditorScriptType.Behavior
        ) {
            this.#properties.forEach(p => {
                if (
                    p._opts.type === Property.Info ||
                    p._opts.type === Property.Link
                ) {
                    methods[p._id] = p._opts.callback;
                }
            })

            methodsAsString = Object.entries(methods)
                .map(([key, value]) => dedent`  ${key}: ${value.toString()}`)
                .join(',\n');
            fileContent = await Deno.readTextFile(Paths.ProjectFiles.AddonBase[this.#addonConfig.type]);

            fileContent = dedent`
const _lostMethods = {
    ${methodsAsString}
};
const _lostData = ${JSON.stringify(lostData, null, 4)};
${fileContent}
`;

        }

        if (type === EditorScriptType.Instance) {
            script = await transpileTs(Paths.ProjectFiles.EditorInstance) || '';

            switch (this.#addonConfig.type) {
                case "plugin":
                    switch (this.#addonConfig.pluginType) {
                        case "object":
                            className = findClassesInheritingFrom(script, 'SDK.IInstanceBase');
                            break;
                        case "world":
                            className = findClassesInheritingFrom(script, 'SDK.IWorldInstanceBase');
                            break;
                    }
                    assign = `globalThis.SDK.Plugins["${this.#addonConfig.addonId}"].Instance = ${className};`;
                    break;
                case "behavior":
                    className = findClassesInheritingFrom(script, 'SDK.IBehaviorInstanceBase');
                    assign = `globalThis.SDK.Behaviors["${this.#addonConfig.addonId}"].Instance = ${className};`;
                    break;
            }

            fileContent = dedent`
${getDefaultLost(this.#addonConfig).value}
${script}
setTimeout(() => {
    ${assign}
})
`
        }

        if (type === EditorScriptType.Type) {
            script = await transpileTs(Paths.ProjectFiles.EditorType) || '';

            switch (this.#addonConfig.type) {
                case "plugin":
                    className = findClassesInheritingFrom(script, 'SDK.ITypeBase');
                    break;
                case "behavior":
                    className = findClassesInheritingFrom(script, 'SDK.IBehaviorTypeBase');
                    break;
            }

            switch (this.#addonConfig.type) {
                case "plugin":
                    assign = `globalThis.SDK.Plugins["${this.#addonConfig.addonId}"].Type = ${className};`;
                    break;
                case "behavior":
                    assign = `globalThis.SDK.Behaviors["${this.#addonConfig.addonId}"].Type = ${className};`;
                    break;
            }

            fileContent = dedent`
${getDefaultLost(this.#addonConfig).value}
${script}
setTimeout(() => {
    ${assign}
})
`
        }

        await this.#saveScript(fileContent, join(Paths.ProjectFolders.Build, type));
    }

    static async createJson(type: JsonFileType): Promise<void> {

        switch (type) {
            case JsonFileType.AddonMetadata:
                const AddonJSON = await AddonMetadataManager.create();

                if (LostAddonProject.buildOptions.minify) {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, type), JSON.stringify(AddonJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, type), JSON.stringify(AddonJSON, null, 4));
                }

                break;
            case JsonFileType.Aces:
                const AcesJSON = AcesManager.create();

                if (LostAddonProject.buildOptions.minify) {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, type), JSON.stringify(AcesJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.ProjectFolders.Build, type), JSON.stringify(AcesJSON, null, 4));
                }

                break;
            case JsonFileType.Language:
                const LanguageJSON = LanguageManager.create();

                if (LostAddonProject.buildOptions.minify) {
                    await Deno.writeTextFile(join(Paths.AddonFolders.Lang, type), JSON.stringify(LanguageJSON));
                } else {
                    await Deno.writeTextFile(join(Paths.AddonFolders.Lang, type), JSON.stringify(LanguageJSON, null, 4));
                }
                break;
        }
    }

    static async #saveScript(content: string, path: string) {
        if (LostAddonProject.buildOptions.minify) {
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
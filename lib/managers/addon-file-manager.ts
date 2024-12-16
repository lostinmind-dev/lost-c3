// deno-lint-ignore-file no-case-declarations
import { Colors, join, Logger, UglifyJS, walk, BlobWriter, ZipWriter, TextReader } from "../../deps.ts";
import { dedent, findClassesInheritingFrom, isDirectoryExists, serializeObjectWithFunctions } from "../../shared/misc.ts";
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
import { AddonFileType } from "../../shared/types/addon-file.ts";
import { AddonFolders } from "../../shared/paths/addon-folders.ts";

export abstract class AddonFileManager {

    static async clear() {
        if (await isDirectoryExists(Paths.ProjectFolders.Build)) {
            await Deno.remove(Paths.ProjectFolders.Build, { recursive: true });
        }
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

    static #initModuleFile() {

        const fileContent: string = dedent`
import "./${LostAddonProject.addon._config.type}.js"
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
        let assign: string = '';
        let className: string = '';
        let fileContent: string = '';

        const entities: EntityCollection = {};
        switch (type) {
            case RuntimeScriptType.Module:
                fileContent = this.#initModuleFile();
                break;
            case RuntimeScriptType.Actions:
                LostAddonProject.addon._categories.forEach(category => category._actions.forEach(enitity => {
                    entities[enitity._func.name] = enitity._func;
                }))

                switch (LostAddonProject.addon._config.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${LostAddonProject.addon._config.addonId}"].Acts = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${LostAddonProject.addon._config.addonId}"].Acts = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScriptType.Conditions:
                LostAddonProject.addon._categories.forEach(category => category._conditions.forEach(enitity => {
                    entities[enitity._func.name] = enitity._func;
                }))

                switch (LostAddonProject.addon._config.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${LostAddonProject.addon._config.addonId}"].Cnds = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${LostAddonProject.addon._config.addonId}"].Cnds = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScriptType.Expressions:
                LostAddonProject.addon._categories.forEach(category => category._expressions.forEach(enitity => {
                    entities[enitity._func.name] = enitity._func;
                }))

                switch (LostAddonProject.addon._config.type) {
                    case "plugin":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Plugins["${LostAddonProject.addon._config.addonId}"].Exps = ${serializeObjectWithFunctions(entities)}
`
                        break;
                    case "behavior":
                        fileContent = dedent`
const C3 = globalThis.C3;

C3.Behaviors["${LostAddonProject.addon._config.addonId}"].Exps = ${serializeObjectWithFunctions(entities)}
`
                        break;
                }

                break;
            case RuntimeScriptType.Instance:
                script = await transpileTs(Paths.ProjectFiles.RuntimeInstance) || '';

                switch (LostAddonProject.addon._config.type) {
                    case "plugin":
                        switch (LostAddonProject.addon._config.pluginType) {
                            case "object":
                                className = findClassesInheritingFrom(script, 'globalThis.ISDKInstanceBase');
                                break;
                            case "world":
                                className = findClassesInheritingFrom(script, 'globalThis.ISDKWorldInstanceBase');
                                break;
                        }
                        assign = `globalThis.C3.Plugins["${LostAddonProject.addon._config.addonId}"].Instance = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorInstanceBase');
                        assign = `globalThis.C3.Behaviors["${LostAddonProject.addon._config.addonId}"].Instance = ${className};`;
                        break;
                }

                fileContent = dedent`
${getDefaultLost(LostAddonProject.addon._config).value}
${script}
${assign}
`
                break;
            case RuntimeScriptType.Plugin:
                script = await transpileTs(Paths.ProjectFiles.RuntimePlugin) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKPluginBase');
                assign = `globalThis.C3.Plugins["${LostAddonProject.addon._config.addonId}"] = ${className};`;

                fileContent = dedent`
${getDefaultLost(LostAddonProject.addon._config).value}
${script}
${assign}
`
                break;
            case RuntimeScriptType.Behavior:
                script = await transpileTs(Paths.ProjectFiles.RuntimeBehavior) || '';

                className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorBase');
                assign = `globalThis.C3.Behaviors["${LostAddonProject.addon._config.addonId}"] = ${className};`;

                fileContent = dedent`
${getDefaultLost(LostAddonProject.addon._config).value}
${script}
${assign}
`
                break;
            case RuntimeScriptType.Type:
                script = await transpileTs(Paths.ProjectFiles.RuntimeType) || '';

                switch (LostAddonProject.addon._config.type) {
                    case "plugin":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKObjectTypeBase');
                        assign = `globalThis.C3.Plugins["${LostAddonProject.addon._config.addonId}"].Type = ${className};`;
                        break;
                    case "behavior":
                        className = findClassesInheritingFrom(script, 'globalThis.ISDKBehaviorTypeBase');
                        assign = `globalThis.C3.Behaviors["${LostAddonProject.addon._config.addonId}"].Type = ${className};`;
                        break;
                }

                fileContent = dedent`
${getDefaultLost(LostAddonProject.addon._config).value}
${script}
${assign}
`

                break;
        }

        await this.#saveScript(fileContent, join(Paths.AddonFolders.Runtime, type));
    }

    static async createEditorScript(type: EditorScriptType): Promise<void> {
        let script: string;
        let assign: string = '';
        let className: string = '';
        let fileContent: string = '';

        const methods: { [key: string]: Function } = {};
        let methodsAsString: string

        if (
            type === EditorScriptType.Plugin ||
            type === EditorScriptType.Behavior
        ) {
            LostAddonProject.addon._properties.forEach(p => {
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
            fileContent = await Deno.readTextFile(Paths.ProjectFiles.getAddonBasePath(LostAddonProject.addon._config.type));

            fileContent = dedent`
const _lostMethods = {
    ${methodsAsString}
};
const _lostData = ${LostAddonProject.getLostAddonData()};
${fileContent}
`;

        }

        if (type === EditorScriptType.Instance) {
            script = await transpileTs(Paths.ProjectFiles.EditorInstance) || '';

            switch (LostAddonProject.addon._config.type) {
                case "plugin":
                    switch (LostAddonProject.addon._config.pluginType) {
                        case "object":
                            className = findClassesInheritingFrom(script, 'SDK.IInstanceBase');
                            break;
                        case "world":
                            className = findClassesInheritingFrom(script, 'SDK.IWorldInstanceBase');
                            break;
                    }
                    assign = `globalThis.SDK.Plugins["${LostAddonProject.addon._config.addonId}"].Instance = ${className};`;
                    break;
                case "behavior":
                    className = findClassesInheritingFrom(script, 'SDK.IBehaviorInstanceBase');
                    assign = `globalThis.SDK.Behaviors["${LostAddonProject.addon._config.addonId}"].Instance = ${className};`;
                    break;
            }

            fileContent = dedent`
${getDefaultLost(LostAddonProject.addon._config).value}
${script}
setTimeout(() => {
    ${assign}
})
`
        }

        if (type === EditorScriptType.Type) {
            script = await transpileTs(Paths.ProjectFiles.EditorType) || '';

            switch (LostAddonProject.addon._config.type) {
                case "plugin":
                    className = findClassesInheritingFrom(script, 'SDK.ITypeBase');
                    break;
                case "behavior":
                    className = findClassesInheritingFrom(script, 'SDK.IBehaviorTypeBase');
                    break;
            }

            switch (LostAddonProject.addon._config.type) {
                case "plugin":
                    assign = `globalThis.SDK.Plugins["${LostAddonProject.addon._config.addonId}"].Type = ${className};`;
                    break;
                case "behavior":
                    assign = `globalThis.SDK.Behaviors["${LostAddonProject.addon._config.addonId}"].Type = ${className};`;
                    break;
            }

            fileContent = dedent`
${getDefaultLost(LostAddonProject.addon._config).value}
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

    static async createZip() {
        Logger.LogBetweenLines(Colors.bgMagenta('Bundling addon...'));

        const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
        const addonFilePath = join(Paths.ProjectFolders.Builds, `${LostAddonProject.addon._config.addonId}_${LostAddonProject.addon._config.version}`)

        for await (const entry of walk(Paths.ProjectFolders.Build)) {
            const { isFile, path } = entry;
            if (isFile) {
                const data = await Deno.readTextFile(path);
                const relativePath = path.substring(Paths.ProjectFolders.Build.length + 1).replace(/\\/g, "/");;

                zipWriter.add(relativePath, new TextReader(data))
            }
        }
        const blob = await zipWriter.close();

        await Deno.writeFile(`${addonFilePath}.zip`, new Uint8Array(await blob.arrayBuffer()))
        await Deno.rename(`${addonFilePath}.zip`, `${addonFilePath}.c3addon`);
    }

    static getFilePath(fileType: AddonFileType, filePath: string, fileName: string): string {
        let folders: string[] = [];
        let path: string;

        switch (fileType) {
            case 'icon':
                return LostAddonProject.iconName;
            case 'image':
                return LostAddonProject.defaultImageName;
            case 'file':
                folders = Paths.getFoldersAfterFolder(filePath, ProjectFolders.Files);
                
                if (folders.length > 0) {
                    path = `${AddonFolders.Files}/${folders.join('/')}/${fileName}`
                } else {
                    path = `${AddonFolders.Files}/${fileName}`
                }

                return path;
            case 'script':
                folders = Paths.getFoldersAfterFolder(filePath, ProjectFolders.Scripts);

                if (folders.length > 0) {
                    path = `${AddonFolders.Scripts}/${folders.join('/')}/${fileName}`
                } else {
                    path = `${AddonFolders.Scripts}/${fileName}`
                }

                return path;
            case 'module-script':
                folders = Paths.getFoldersAfterFolder(filePath, ProjectFolders.Modules);

                if (folders.length > 0) {
                    path = `${AddonFolders.Runtime}/${AddonFolders.Modules}/${folders.join('/')}/${fileName}`
                } else {
                    path = `${AddonFolders.Runtime}/${AddonFolders.Modules}/${fileName}`
                }

                return path;
            case 'domside-script':
                folders = Paths.getFoldersAfterFolder(filePath, ProjectFolders.DomSide);

                if (folders.length > 0) {
                    path = `${AddonFolders.Runtime}/${AddonFolders.DomSide}/${folders.join('/')}/${fileName}`
                } else {
                    path = `${AddonFolders.Runtime}/${AddonFolders.DomSide}/${fileName}`
                }

                return path;
        }
    }

}
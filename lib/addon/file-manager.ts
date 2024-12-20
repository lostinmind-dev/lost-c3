import { BlobWriter, Colors, join, TextReader, UglifyJS, walk, ZipWriter } from "../../deps.ts";
import { dedent, findClassesInheritingFrom, isDirectoryExists } from "../../shared/misc.ts";
import { BuildFolders, Paths, ProjectFolders } from "../../shared/paths.ts";
import { Addon } from "./index.ts";
import Icon from "../defaults/addon-icon.ts";
import { LostCompiler } from "../lost-compiler.ts";
import type { AddonPluginType, FunctionsCollection } from "../types/index.ts";
import { Property } from "../entities/plugin-property.ts";
import { AcesManager, AddonMetadataManager, LanguageManager } from "./json-manager.ts";
import { Logger } from "../../shared/logger.ts";
import { LostProject } from "../lost-project.ts";

export type AddonRuntimeScriptName =
    | 'main.js'
    | 'plugin.js'
    | 'behavior.js'
    | 'type.js'
    | 'instance.js'
    | 'conditions.js'
    | 'actions.js'
    | 'expressions.js'
    ;

export type AddonEditorScriptName =
    | 'plugin.js'
    | 'behavior.js'
    | 'type.js'
    | 'instance.js'
    ;

export type AddonJsonFileName =
    | 'aces.json'
    | 'addon.json'
    | 'en-US.json'
    ;

export abstract class AddonFileManager {

    static async clear() {
        if (await isDirectoryExists(Paths.Build)) {
            await Deno.remove(Paths.Build, { recursive: true });
        }
    }


    static getEditorScriptsList(): string[] {
        const config = Addon.getConfig();
        const scripts = Addon.filesCollection.scripts;
        const modules = Addon.filesCollection.modules;

        const files: string[] = [
            `${config.type}.js`,
            'type.js',
            'instance.js'
        ];

        scripts.forEach(script => {
            if (
                script.isEditorScript && script.addonPath &&
                !files.includes(script.addonPath)
            ) {
                files.push(script.addonPath);
            }
        })

        modules.forEach(module => {
            if (
                module.isEditorScript && module.addonPath &&
                !files.includes(module.addonPath)
            ) {
                files.push(module.addonPath);
            }
        })

        return files;
    }

    static getAddonFilePath(addonFolder: BuildFolders, localPath: string, localName: string) {
        const pathFolders = Paths.getFoldersAfterFolder(localPath, addonFolder);

        if (pathFolders.length > 0) {
            return `${addonFolder}/${pathFolders.join('/')}/${localName}`;
        } else {
            return `${addonFolder}/${localName}`;
        }
    }

    static async getFilesList(): Promise<string[]> {
        const config = Addon.getConfig();
        const requiredFiles: string[] = [
            `c3runtime/${config.type}.js`,
            'c3runtime/type.js',
            'c3runtime/instance.js',
            'c3runtime/conditions.js',
            'c3runtime/actions.js',
            'c3runtime/expressions.js',
            'lang/en-US.json',
            'aces.json',
            'addon.json',
            'instance.js',
            `${config.type}.js`,
            'type.js'
        ];

        if (Addon.filesCollection.modules.length > 0) {
            requiredFiles.unshift('c3runtime/main.js');
        }

        const files: string[] = [...requiredFiles];

        const readDir = async (path: string) => {
            for await (const entry of Deno.readDir(path)) {
                if (entry.isDirectory) {
                    await readDir(join(path, entry.name));
                } else if (entry.isFile) {
                    /** Only one *source* folder */
                    const filePath = join(...Paths.getFoldersAfterFolder(path, Paths.getBuildFolderName()), entry.name).replace(/\\/g, '/');

                    if (!files.includes(filePath)) {
                        files.push(filePath);
                    }
                }
            }
        }

        await readDir(Paths.Build);

        return files;
    }

    static async createFolders() {
        await Deno.mkdir(Paths.Build);
        await Deno.mkdir(Paths.BuildAddonC3Runtime);
        await Deno.mkdir(Paths.BuildAddonLanguages);

        const files = Addon.filesCollection.files;
        const modules = Addon.filesCollection.modules;
        const scripts = Addon.filesCollection.scripts;

        if (files.length > 0) {
            await Deno.mkdir(Paths.BuildAddonFiles);

            files.forEach(async file => {
                const folderPath = join(BuildFolders.Files, ...Paths.getFoldersAfterFolder(file.path, ProjectFolders.Files));
                const localPath = join(Paths.Build, folderPath);
                const localName = file.name;

                file.localPath = localPath;
                file.localName = localName;
                file.addonPath = this.getAddonFilePath(BuildFolders.Files, localPath, localName);

                await Deno.mkdir(localPath, { recursive: true });
            });
        }

        if (modules.length > 0) {
            await Deno.mkdir(Paths.BuildAddonModules);

            modules.forEach(async module => {
                const folderPath = join(BuildFolders.Modules, ...Paths.getFoldersAfterFolder(module.path, ProjectFolders.Modules));
                const localPath = join(Paths.Build, folderPath);
                const localName = module.name.replace('.ts', '.js');

                module.localPath = localPath;
                module.localName = localName;
                module.addonPath = this.getAddonFilePath(BuildFolders.Modules, localPath, localName)

                await Deno.mkdir(localPath, { recursive: true });
            });
        }

        if (scripts.length > 0) {
            await Deno.mkdir(Paths.BuildAddonScripts);

            scripts.forEach(async script => {
                const folderPath = join(BuildFolders.Scripts, ...Paths.getFoldersAfterFolder(script.path, ProjectFolders.Scripts));
                const localPath = join(Paths.Build, folderPath);
                const localName = script.name.replace('.ts', '.js');

                script.localPath = localPath;
                script.localName = localName;
                script.addonPath = this.getAddonFilePath(BuildFolders.Scripts, localPath, localName);

                await Deno.mkdir(localPath, { recursive: true });
            });
        }
    }

    static async createIcon() {
        const isDefault = Addon.filesCollection.icon.isDefault;

        if (!isDefault) {
            await Deno.copyFile(
                join(Addon.filesCollection.icon.path, Addon.filesCollection.icon.name),
                join(Paths.Build, Addon.filesCollection.icon.name)
            )
        } else {
            await this.createFile(join(Paths.Build, Addon.filesCollection.icon.name), Icon());
        }
    }

    static async createRuntimeScript(fileName: AddonRuntimeScriptName) {
        switch (fileName) {
            case "main.js":
                await RuntimeFilesManager.createMain();
                break;
            case "plugin.js":
                await RuntimeFilesManager.createPlugin();
                break;
            case "behavior.js":
                await RuntimeFilesManager.createBehavior();
                break;
            case "type.js":
                await RuntimeFilesManager.createType();
                break;
            case "instance.js":
                await RuntimeFilesManager.createInstance();
                break;
            case "conditions.js":
                await RuntimeFilesManager.createConditions();
                break;
            case "actions.js":
                await RuntimeFilesManager.createActions();
                break;
            case "expressions.js":
                await RuntimeFilesManager.createExpressions();
                break;
        }
    }

    static async createEditorScript(fileName: AddonEditorScriptName) {
        switch (fileName) {
            case "plugin.js":
                await EditorFilesManager.createPlugin();
                break;
            case "behavior.js":
                await EditorFilesManager.createBehavior();
                break;
            case "type.js":
                await EditorFilesManager.createType();
                break;
            case "instance.js":
                await EditorFilesManager.createInstance();
                break;
        }
    }

    static async createJsonFile(fileName: AddonJsonFileName) {
        switch (fileName) {
            case "aces.json":
                await JsonFilesManager.createAces();
                break;
            case "addon.json":
                await JsonFilesManager.createAddon();
                break;
            case "en-US.json":
                await JsonFilesManager.createLanguage();
                break;
        }
    }

    static async createFile(path: string, content: string) {
        if (
            LostProject.buildOptions.minify &&
            path.endsWith('.js')
        ) {
            content = UglifyJS.minify(content, LostProject.minifyOptions).code;
        }
        await Deno.writeTextFile(path, content);
    }

    static async createZip() {
        const config = Addon.getConfig();
        Logger.LogBetweenLines(Colors.bgMagenta('Bundling addon...'));

        const zipWriter = new ZipWriter(new BlobWriter('application/zip'));
        const addonFilePath = join(Paths.Builds, `${config.addonId}_${config.version}`)

        for await (const entry of walk(Paths.Build)) {
            const { isFile, path } = entry;
            if (isFile) {
                const data = await Deno.readTextFile(path);
                const relativePath = path.substring(Paths.Build.length + 1).replace(/\\/g, "/");;

                zipWriter.add(relativePath, new TextReader(data))
            }
        }
        const blob = await zipWriter.close();

        await Deno.writeFile(`${addonFilePath}.zip`, new Uint8Array(await blob.arrayBuffer()))
        await Deno.rename(`${addonFilePath}.zip`, `${addonFilePath}.c3addon`);
    }

}

enum EditorInheritedClass {
    BehaviorInstance = 'SDK.IBehaviorInstanceBase',
    BehaviorType = 'SDK.IBehaviorTypeBase',

    PluginObjectInstance = 'SDK.IInstanceBase',
    PluginWorldInstance = 'SDK.IWorldInstanceBase',
    PluginType = 'SDK.ITypeBase',
}

enum RuntimeInheritedClass {
    Behavior = 'globalThis.ISDKBehaviorBase',
    BehaviorType = 'globalThis.ISDKBehaviorTypeBase',
    BehaviorInstance = 'globalThis.ISDKBehaviorInstanceBase',

    PluginObjectInstance = 'globalThis.ISDKInstanceBase',
    PluginWorldInstance = 'globalThis.ISDKWorldInstanceBase',
    Plugin = 'globalThis.ISDKPluginBase',
    PluginType = 'globalThis.ISDKObjectTypeBase',
}

abstract class EditorFilesManager {

    static async createPlugin() {
        const properties = Addon.getProperties();
        const initialContent = await Deno.readTextFile(Paths.AddonBaseFile);
        const methods: FunctionsCollection = {} as FunctionsCollection;

        properties.forEach(p => {
            if (
                p.opts.type === Property.Link ||
                p.opts.type === Property.Info
            ) {
                methods[p.id] = p.opts.callback;
            }
        })

        const methodsAsString = Object.entries(methods)
            .map(([key, value]) => `    ${key}: ${value.toString()}`)
            .join(',\n')
            ;

        const content = dedent`
            const _lostMethods = {` + '\n' +
            methodsAsString + '\n' +
            '};' + '\n' +
            dedent`
            const _lostData = ${JSON.stringify(Addon.getData())};
        ` + '\n' + initialContent
            ;


        await AddonFileManager.createFile(join(Paths.Build, 'plugin.js'), content);
    }

    static async createBehavior() {
        const properties = Addon.getProperties();
        const initialContent = await Deno.readTextFile(Paths.AddonBaseFile);
        const methods: FunctionsCollection = {} as FunctionsCollection;

        properties.forEach(p => {
            if (
                p.opts.type === Property.Link ||
                p.opts.type === Property.Info
            ) {
                methods[p.id] = p.opts.callback;
            }
        })

        const methodsAsString = Object.entries(methods)
            .map(([key, value]) => `    ${key}: ${value.toString()}`)
            .join(',\n')
            ;

        const content = dedent`
            const _lostMethods = {` + '\n' +
            methodsAsString + '\n' +
            '};' + '\n' +
            dedent`
            const _lostData = ${JSON.stringify(Addon.getData())};
        ` + '\n' + initialContent
            ;

        await AddonFileManager.createFile(join(Paths.Build, 'behavior.js'), content);
    }

    static async createInstance() {
        const config = Addon.getConfig();

        const type = config.type;
        let pluginType: AddonPluginType = 'object';
        if (type === 'plugin') {
            pluginType = config.pluginType;
        }

        const intialContent = LostCompiler.compile(Paths.EditorIntanceFile, 'editor') || '';
        const className = findClassesInheritingFrom(intialContent,
            (type === 'plugin' && pluginType === 'object') ? EditorInheritedClass.PluginObjectInstance :
                (type === 'plugin' && pluginType === 'world') ? EditorInheritedClass.PluginWorldInstance :
                    (type === 'behavior') ? EditorInheritedClass.BehaviorInstance : ''
        );

        const content = dedent`
            const Lost = ${JSON.stringify({
            addonId: config.addonId
        })};` + '\n' +
            intialContent +
            `globalThis.SDK.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Instance = ${className};
        `;

        await AddonFileManager.createFile(join(Paths.Build, 'instance.js'), content);
    }

    static async createType() {
        const config = Addon.getConfig();

        const type = config.type;
        const intialContent = LostCompiler.compile(Paths.EditorTypeFile, 'editor') || '';
        const className = findClassesInheritingFrom(intialContent,
            (type === 'plugin') ? EditorInheritedClass.PluginType :
                (type === 'behavior') ? EditorInheritedClass.BehaviorType : ''
        );

        const content = dedent`
            const Lost = ${JSON.stringify({
            addonId: config.addonId
        })};` + '\n' +
            intialContent +
            `globalThis.SDK.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Type = ${className};
        `;

        await AddonFileManager.createFile(join(Paths.Build, 'type.js'), content);
    }

}

abstract class RuntimeFilesManager {

    static async createMain() {
        const config = Addon.getConfig();
        const content = dedent`
            import "./${config.type}.js"
            import "./type.js"
            import "./instance.js"
            import "./actions.js"
            import "./conditions.js"
            import "./expressions.js"
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'main.js'), content);
    }

    static async createPlugin() {
        const config = Addon.getConfig();
        const intialContent = LostCompiler.compile(Paths.RuntimePluginFile, 'runtime') || '';
        const className = findClassesInheritingFrom(intialContent, RuntimeInheritedClass.Plugin);

        const content = dedent`
            const Lost = ${JSON.stringify({
            addonId: config.addonId
        })};` + '\n' +
            intialContent +
            `globalThis.C3.Plugins["${config.addonId}"] = ${className};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'plugin.js'), content);
    }

    static async createBehavior() {
                const config = Addon.getConfig();
        const intialContent = LostCompiler.compile(Paths.RuntimeBehaviorFile, 'runtime') || '';
        const className = findClassesInheritingFrom(intialContent, RuntimeInheritedClass.Behavior);

        const content = dedent`
            const Lost = ${JSON.stringify({
            addonId: config.addonId
        })};` + '\n' +
            intialContent +
            `globalThis.C3.Behaviors["${config.addonId}"] = ${className};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'behavior.js'), content);
    }

    static async createInstance() {
                const config = Addon.getConfig();
        const type = config.type;
        let pluginType: AddonPluginType = 'object';
        if (type === 'plugin') {
            pluginType = config.pluginType;
        }

        const intialContent = LostCompiler.compile(Paths.RuntimeInstanceFile, 'runtime') || '';
        const className = findClassesInheritingFrom(intialContent,
            (type === 'plugin' && pluginType === 'object') ? RuntimeInheritedClass.PluginObjectInstance :
                (type === 'plugin' && pluginType === 'world') ? RuntimeInheritedClass.PluginWorldInstance :
                    (type === 'behavior') ? RuntimeInheritedClass.BehaviorInstance : ''
        );

        const content = dedent`
            const Lost = ${JSON.stringify({
            addonId: config.addonId
        })};` + '\n' +
            intialContent +
            `globalThis.C3.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Instance = ${className};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'instance.js'), content);
    }

    static async createType() {
                const config = Addon.getConfig();
        const type = config.type;
        const intialContent = LostCompiler.compile(Paths.RuntimeTypeFile, 'runtime') || '';
        const className = findClassesInheritingFrom(intialContent,
            (type === 'plugin') ? RuntimeInheritedClass.PluginType :
                (type === 'behavior') ? RuntimeInheritedClass.BehaviorType : ''
        );

        const content = dedent`
            const Lost = ${JSON.stringify({
            addonId: config.addonId
        })};` + '\n' +
            intialContent +
            `globalThis.C3.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Type = ${className};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'type.js'), content);
    }

    static async createConditions() {
        const config = Addon.getConfig();
        const type = config.type;
        const entities: FunctionsCollection = {} as FunctionsCollection;
        const conditions = Addon.categories.map(c => c._conditions).flat();

        conditions.forEach(e => {
            entities[e._func.name] = e._func;
        });

        const content = dedent`
            globalThis.C3.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Cnds = ${serializeEntities(entities)};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'conditions.js'), content);
    }

    static async createActions() {
        const config = Addon.getConfig();
        const type = config.type;
        const entities: FunctionsCollection = {} as FunctionsCollection;
        const actions = Addon.categories.map(c => c._actions).flat();

        actions.forEach(e => {
            entities[e._func.name] = e._func;
        });

        const content = dedent`
            globalThis.C3.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Acts = ${serializeEntities(entities)};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'actions.js'), content);
    }

    static async createExpressions() {
        const config = Addon.getConfig();
        const type = config.type;
        const entities: FunctionsCollection = {} as FunctionsCollection;
        const expressions = Addon.categories.map(c => c._expressions).flat();

        expressions.forEach(e => {
            entities[e._func.name] = e._func;
        });

        const content = dedent`
            globalThis.C3.${(type === 'plugin') ? 'Plugins' : 'Behaviors'}["${config.addonId}"].Exps = ${serializeEntities(entities)};
        `;

        await AddonFileManager.createFile(join(Paths.BuildAddonC3Runtime, 'expressions.js'), content);
    }

}

abstract class JsonFilesManager {
    static async createAddon() {
        const content = await AddonMetadataManager.create();
        await AddonFileManager.createFile(join(Paths.Build, 'addon.json'), content);
    }

    static async createAces() {
        const content = AcesManager.create();
        await AddonFileManager.createFile(join(Paths.Build, 'aces.json'), content);
    }

    static async createLanguage() {
        const content = LanguageManager.create();
        await AddonFileManager.createFile(join(Paths.BuildAddonLanguages, 'en-US.json'), content);
    }
}

function serializeEntities(entities: FunctionsCollection): string {
    let str = '{\n';
    for (const key in entities) {
        if (entities.hasOwnProperty(key)) {
            const value = entities[key];
            if (typeof value === 'function') {
                /** Convert function to string */
                str += `  ${key}: function ${value.toString().replace(/^function\s*\w*\s*/, '')},\n`;
            } else {
                str += `  ${key}: ${JSON.stringify(value, null, 2)},\n`;
            }
        }
    }
    str = str.replace(/,\n$/, '\n'); /** Delete last comma */
    str += '}';
    return str;
}
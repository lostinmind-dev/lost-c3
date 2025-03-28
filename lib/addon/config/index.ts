import type { PluginInfo } from "./plugin.ts";
import type { BehaviorInfo } from "./behavior.ts";
import type { Properties } from "./property.ts";
import {
    type Category,
    type CategoryConstructor,
    IDENTIFIER
} from "../../helpers/category.ts";
import {
    isDirectoryExists,
    isFileExists
} from "../../misc.ts";
import { join } from "../../deps.ts";
import { fileManager } from "../builder.ts";

/** Properties */
import { Numeric, } from "./properties/numeric.ts";
import { Percent } from "./properties/percent.ts";
import { Text } from "./properties/text.ts";
import { Check } from "./properties/check.ts";
import { Font } from "./properties/font.ts";
import { Combo } from "./properties/combo.ts";
import { Color } from "./properties/color.ts";
import { Object as ObjectProperty } from "./properties/object.ts";
import { Group } from "./properties/group.ts";
import { Info } from "./properties/info.ts";
import { Link } from "./properties/link.ts";

type AddonInfo = {
    /**
     * *Optional*. Default is ***False***. Set a boolean of whether the addon is deprecated or not. 
     * @description If you wish to replace your addon with another one, the old one can be deprecated with true. 
     * This makes it invisible in the editor so it cannot be used in new projects; however old projects with the addon already added can continue to load and work as they did before. 
     * This discourages use of the deprecated addon without breaking existing projects that use it.
     */
    readonly deprecated?: boolean;
    /**
     * The unique ID of the addon.
     * @description This is not displayed and is only used internally.
     * This must not be used by any other addon ever published for Construct 3, and must never change after you first publish your addon. 
     * (The name is the only visible identifier of the addon in the Construct 3 editor, so that can be changed any time, but the ID must always be the same.) 
     * To ensure it is unique, it is recommended to use a vendor-specific prefix, 
     * @example 'MyCompany_MyAddon'.
     */
    readonly id: string;
    /**
     * The displayed name of the addon, in **English**.
     * @example 'Addon for Construct 3'
     */
    readonly name: string;
    /**
     * A string specifying the addon version in four parts (major, minor, patch, revision)
     * @example '1.0.0.0'
     */
    readonly version: `${number}.${number}.${number}.${number}`;
    /**
     * A string identifying the author of the addon.
     * @example 'lostinmind.'
     */
    readonly author: string;
    /**
     * A string of a brief description of what the addon does, displayed when prompting the user to install the addon.
     * @example 'My awesome addon was made with Lost for...'
     */
    readonly description?: string;
    /**
     * A string of a URL to the author's website. 
     * @description It is recommended to provide updates to the addon at this URL if any become available. 
     * The website should use HTTPS.
     * @example 'https://addon.com'
     */
    readonly websiteUrl?: `https://${string}`;
    /**
     * A string of a URL to the online documentation for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     * @example 'https://docs.addon.com'
     */
    readonly docsUrl?: `https://${string}`;
    /**
     * A string of a URL to the help resource for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     * @example 'https://addon.com/help'
     */
    readonly helpUrl?: `https://${string}`;
    /**
      * An object name that will applied after plugin was installed/added to project.
      * @example 'MyPlugin'
      */
    readonly objectName: string;
    /**
     * *Optional*. Default is ***True***.
     * A boolean indicating whether the addon supports Construct's worker mode, where the entire runtime is hosted in a Web Worker instead of the main thread.
     * @description Providing the addon only uses APIs available in a Web Worker, then it is compatible; where access to the DOM is necessary, then a DOM script can be used to still access those features in worker mode - see Runtime scripts for more details. 
     * Therefore it should be possible for every addon to support worker mode, and supporting it is strongly recommended as worker mode can bring performance benefits.
     * This can be set to false to indicate that the addon does not yet support worker mode, which may be useful to expedite addon development or if the addon makes use of extremely complex DOM operations.
     * This will cause worker mode "auto" to switch to DOM mode which may degrade the performance of the project.
     * If the user attempts to switch worker mode to "Yes" in project using the addon, then Construct will show an error message highlighting the addon that does not support the mode, and prevent changing the setting.
     */
    readonly supportWorkerMode?: boolean;
    /**
     * *Optional*. Default is ***undefined***. The minimum Construct version required to load your addon, e.g. "r399".
     * @description If not specified, the addon will be allowed to be installed with any version of Construct. 
     * If specified and the user attempts to install the addon with a version lower than the minimum, then Construct will prevent installation and show a message indicating that a newer version of Construct must be used. 
     * If the user installs the addon with a newer version of Construct and then rolls back to an older version of Construct lower than the minimum, then Construct will refuse to load the addon (a message will be logged to the console) and the editor will act as if the addon is not installed.
     * @example "r399"
     */
    readonly minConstructVersion?: `r${number}${number}${number}`;
    /**
     * *Optional*. Default is ***True***.
     * @description Pass false to prevent the addon from being bundled via the Bundle addons project property. 
     * By default all addons may be bundled with a project, and it is recommended to leave this enabled for best user convenience. 
     * However if you publish a commercial addon and want to prevent it being distributed by project-bundling, you may wish to disable this.
     */
    readonly canBeBundled?: boolean;
}

export type Addons = {
    'plugin': PluginInfo & AddonInfo;
    'behavior': BehaviorInfo & AddonInfo;
}

export type RemoteScript = {
    /** A cross-origin URL
     * @example https://example.com/api.js.
     */
    readonly url: `https://${string}`;
    /** *Optional*. Set to 'module' to load the script as a module */
    readonly module?: true
}

export type BaseConfig = {
    readonly info: Addon<'plugin'>['info'];
    readonly properties: Addon['properties'];
    readonly remoteScripts: RemoteScript[];
    readonly scripts: { path: string }[];
    readonly modules: { path: string }[];
}

type EditorScriptSetting =
    | EditorScriptFile
    | EditorScriptsDirectory
    ;

type EditorScriptsDirectory = {
    readonly target: 'directory';
    /** 
     * Path to a directory except 'scripts/' folder
     * @example 'src'
     */
    readonly path: string;
}

type EditorScriptFile = {
    readonly target: 'file';
    /** 
     * Path to a script file except 'scripts/' folder
     * @example 'src/index.js'
     */
    readonly path: `${string}.js` | `${string}.ts`;
}

// type AddonScript = {
//     readonly path: string;
//     // dependencyType: 'external-dom-script' | 'external-runtime-script';
//     // /** If *true* - script is .ts Typescript file */
//     // editor: boolean;
// }

class AddonScript {
    editor: boolean = false;
    readonly ts: boolean;
    readonly path: string;
    readonly name: string;

    get c3Path() {
        const match = this.path.match(/scripts[/\\](.*)$/);
        let folders: string[] = [];

        if (match) {
            folders = match[1].split("\\");
        }

        let path: string = this.name;

        if (folders.length > 0) {
            path = `${folders.join('/')}/${this.name}`;
        }
        
        return `scripts/${path.replace('.ts', '.js')}`;
    }

    constructor(path: string, name: string) {
        this.path = path;
        this.name = name;

        if (name.endsWith('.ts') && !name.endsWith('.d.ts')) {
            this.ts = true;
        } else if (name.endsWith('.js')) {
            this.ts = false;
        } else {
            console.error('Unknown addon script type', name);
            Deno.exit(1);
        }
    }
}

class AddonModule {
    readonly ts: boolean;
    readonly path: string;
    readonly name: string;

    get c3Path() {
        const match = this.path.match(/modules[/\\](.*)$/);
        let folders: string[] = [];

        if (match) {
            folders = match[1].split("\\");
        }

        let path: string = this.name;

        if (folders.length > 0) {
            path = `${folders.join('/')}/${this.name}`;
        }

        return `c3runtime/modules/${path.replace('.ts', '.js')}`;
    }

    constructor(path: string, name: string) {
        this.path = path;
        this.name = name;

        if (name.endsWith('.ts') && !name.endsWith('.d.ts')) {
            this.ts = true;
        } else if (name.endsWith('.js')) {
            this.ts = false;
        } else {
            console.error('Unknown addon script type', name);
            Deno.exit(1);
        }

    }

    // async getContent() {
    //     const data = await Deno.readTextFile(join(this.path, this.name));

    //     return data;
    // }
}

export class Addon<Type extends keyof Addons = keyof Addons> {
    readonly type: Type;
    readonly info: Addons[Type];
    readonly properties: Array<Properties[keyof Properties]['klass']> = [];

    readonly categories = new Set<Category>();
    readonly remoteScripts = new Set<RemoteScript>();
    readonly editorScripts = new Set<string>();

    /** Set of files to all scripts */
    readonly scripts = new Set<AddonScript>();
    readonly modules = new Set<AddonModule>();

    allCategories() {
        return Array.from(this.categories);
    }

    getEditorScriptsList() {
        const scripts: string[] = [];

        for (const script of Array.from(this.scripts)) {
            if (!script.editor) continue;

            scripts.push(script.c3Path);
        }
        
        return scripts;
    }

    getFilesList() {
        return [
            ...Array.from(this.scripts).map(script => script.c3Path),
            ...Array.from(this.modules).map(module => module.c3Path)
        ];;
    }

    constructor(type: Type, info: Addons[Type]) {
        this.type = type;
        this.info = info;
    }

    async loadScripts() {
        const scriptsPath = ['addon', 'scripts'];

        if (!await isDirectoryExists(join(Deno.cwd(), ...scriptsPath))) return;

        await fileManager.createFolders(['scripts']);

        try {
            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {

                    if (entry.isDirectory) {
                        await fileManager.createFolders(['scripts', entry.name]);
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {

                        if (entry.name.endsWith('.js')) {
                            const script = new AddonScript(path, entry.name);
                            script.editor = this.editorScripts.has(script.c3Path);

                            this.scripts.add(script);
                        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                            const script = new AddonScript(path, entry.name);
                            script.editor = this.editorScripts.has(script.c3Path);

                            this.scripts.add(script);
                        }
                    }
                }
            }

            await readDir(join(Deno.cwd(), ...scriptsPath));
        } catch (e) {
            console.error(
                `Error while loading addon scripts`, e
            );
            Deno.exit(1);
        }
    }

    async loadModules() {
        const modulesPath = ['addon', 'runtime', 'modules'];

        if (!await isDirectoryExists(join(Deno.cwd(), ...modulesPath))) return;

        await fileManager.createFolders(['c3runtime', 'modules']);

        try {
            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {

                    if (entry.isDirectory) {
                        await fileManager.createFolders(['c3runtime', 'modules', entry.name]);
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {

                        if (entry.name.endsWith('.js')) {
                            this.modules.add(new AddonModule(path, entry.name));
                        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
                            this.modules.add(new AddonModule(path, entry.name));
                        }
                    }
                }
            }

            await readDir(join(Deno.cwd(), ...modulesPath));
        } catch (e) {
            console.error(
                `Error while loading addon modules`, e
            );
            Deno.exit(1);
        }
    }

    async loadCategories() {
        try {
            const categoriesPath = ['addon', 'categories'];
            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    }

                    if (!entry.isFile || !entry.name.endsWith('.ts')) continue;

                    const modulePath = `file://${join(path, entry.name)}`;

                    const module = await import(`${modulePath}?t=${Date.now()}`);

                    for (const part of Object.values(module)) {
                        if (typeof (part as any)[IDENTIFIER] === 'undefined') continue;

                        const UserCategory = part as CategoryConstructor;
                        const category = new UserCategory();

                        if (category.aces.length > 0) {
                            this.categories.add(category);
                        }
                    }
                }
            }

            await readDir(join(Deno.cwd(), ...categoriesPath));
        } catch (e) {
            console.error(
                `Error while importing categories`, e
            );
            Deno.exit(1);
        }
    }

    /**
     * Adds editor scripts to *addon.json* file
     * @param target Folder where the script exists
     * @param scripts *Optional* editor scripts collection
     * @returns 
     */
    async addEditorScripts(...scripts: EditorScriptSetting[]) {
        for (const script of scripts) {
            if (script.target === 'file') {
                const path = join(Deno.cwd(), 'addon', 'scripts', ...script.path.split('/'));

                if (await isFileExists(path)) {
                    this.editorScripts.add(`scripts/${script.path.replace('.ts', '.js')}`)
                }
            } else if (script.target === 'directory') {
                const dirPath = join(Deno.cwd(), 'addon', 'scripts', ...script.path.split('/'));

                const readDir = async (path: string) => {
                    for await (const entry of Deno.readDir(path)) {
                        if (entry.isDirectory) {
                            await readDir(join(path, entry.name));
                        } else if (
                            entry.isFile &&
                            entry.name.endsWith('.js') ||
                            (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
                        ) {
                            this.editorScripts.add(`${script.path}/${entry.name}`);
                        }
                    }
                }
                await readDir(dirPath);
            }
        }
    }

    /**
     * Adds a remote URL to load a script from.
     * - - -
     * @param scripts The scripts collection with URL (or URL's), must not use http: in its URL.
     * @description On the modern web this will often be blocked from secure sites as mixed content.
     * ***You must either use secure HTTPS, or a same-protocol URL.***
     */
    addRemoteScripts(...scripts: RemoteScript[]) {
        for (const remoteScript of scripts) {
            this.remoteScripts.add(remoteScript);
        }
    }

    /**
     * Creates plugin property.
     * @param type Plugin property type
     * @param opts Plugin property options
     */
    addProperty<Type extends keyof Properties>(type: Type, opts: Partial<Properties[Type]['opts']>) {
        if (
            type === 'integer' ||
            type === 'float'
        ) {
            // @ts-ignore opts type
            this.properties.push(new Numeric(type, opts));
        } else if (
            type === 'text' ||
            type === 'longtext'
        ) {
            //@ts-ignore opts type
            this.properties.push(new Text(type, opts));
        } else if (type === 'percent') {
            //@ts-ignore opts type
            this.properties.push(new Percent(opts));
        } else if (type === 'check') {
            this.properties.push(new Check(opts));
        } else if (type === 'font') {
            this.properties.push(new Font(opts));
        } else if (type === 'combo') {
            //@ts-ignore opts type
            this.properties.push(new Combo(opts));
        } else if (type === 'color') {
            //@ts-ignore opts type
            this.properties.push(new Color(opts));
        } else if (type === 'object') {
            this.properties.push(new ObjectProperty(opts));
        } else if (type === 'group') {
            this.properties.push(new Group(opts));
        } else if (type === 'info') {
            //@ts-ignore opts type
            this.properties.push(new Info(opts));
        } else if (type === 'link') {
            this.properties.push(new Link(opts));
        }
    }

    toJson(): BaseConfig {
        return {
            //@ts-ignore
            info: this.info,
            properties: this.properties.map((property) => {
                //@ts-ignore
                property.name = undefined;
                return property;
            }),
            remoteScripts: Array.from(this.remoteScripts),
            scripts: Array.from(this.scripts).map(script => { return { path: script.c3Path } }),
            modules: Array.from(this.modules).map(module => { return { path: module.c3Path } })
        };
    }
}

type InitMethods = {
    addProperty: Addon['addProperty'];
    addRemoteScripts: Addon['addRemoteScripts'];
    addEditorScripts: Addon['addEditorScripts'];
}

type Config = {
    init?: (addon: InitMethods) => void | Promise<void>;
}

export async function config<Type extends keyof Addons>(type: Type, info: Addons[Type], opts?: Config) {
    const addon = new Addon(type, info);

    await opts?.init?.({
        addProperty: addon.addProperty.bind(addon),
        addRemoteScripts: addon.addRemoteScripts.bind(addon),
        addEditorScripts: addon.addEditorScripts.bind(addon)
    });

    return addon;
}
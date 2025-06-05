import type { PluginInfo } from "./config/plugin.ts";
import type { Property } from "./config/property.ts";

type PropertiesCollection = {
    readonly common?: Record<string, Property>,
    /**
     * Puts properties into groups
     * @example {
     *  'main-group': ['propertyId', 'otherPropertyId']
     * }
     */
    readonly groups?: Record<string, Array<string>>
}

type ConfigOptions<
    AddonInfo extends PluginInfo,
    Properties extends PropertiesCollection
> = {
    readonly info: AddonInfo;
    /**
     * An object collection of groups with properties
     */
    readonly properties?: Properties
}

export function config(opts: ConfigOptions<any, any>) {
    return opts;
}


export type RemoteScript = {
    /** A cross-origin URL
     * @example https://example.com/api.js.
     */
    readonly url: `https://${string}`;
    /** *Optional*. Set to 'module' to load the script as a module */
    readonly module?: true
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
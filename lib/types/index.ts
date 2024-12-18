import type { MimeType } from "../../shared/mime.ts";
import type { PluginProperty } from "../entities/plugin-property.ts";
import type { LostConfig } from "../lost-config.ts";
import type { AddonFileDependencyType, AddonFileType } from "./addon-file.ts";

export type LostDataFile = {
    readonly type: AddonFileType;
    readonly path: string;
    readonly dependencyType?: AddonFileDependencyType;
    readonly mimeType?: MimeType;
}

export type LostData = {
    readonly hasDefaultImage: boolean;
    readonly icon: {
        readonly name: string;
        readonly iconType: MimeType.PNG | MimeType.SVG;
    };
    readonly config: LostConfig;
    readonly remoteScripts: RemoteScript[];
    readonly properties: PluginProperty[];
    readonly files: LostDataFile[];
}

export type FunctionsCollection = {
    [key: string]: Function | ((...args: any[]) => void);
}
export type AddonBareBonesType =
    | 'plugin'
    | 'drawing-plugin'
    | AddonType
;

export type AddonType =
    | 'plugin'
    | 'behavior'
;

export type AddonPluginType =
    | 'object'
    | 'world'
;

export type EditorScript = {
    /**
     * Path to a target file/directory.
     */
    readonly path: string; 
}

export type RuntimeScript = {
    /**
     * Use 'file' to mark only one file as 'external-runtime-script'.
     * - - -
     * @description ***The file path must not contain the name of the main directory in which the file is located (Scripts/myscript.ts).***
     * - - -
     * Use 'directory' to mark the entire directory of files as 'external-runtime-script' 
    * @description ***The directiry path must not contain the name of the main directory in which the file is located (Scripts/myscript.ts).***
     */
    readonly type: 'file' | 'directory';
    /**
     * Path to a target file/directory.
     */
    readonly path: string;
}

export type RemoteScript = {
    /** A cross-origin URL
     * @example https://example.com/api.js.
     */
    readonly url: string;
    /** *Optional*. Set to 'module' to load the script as a module */
    readonly type?: 'module'
}
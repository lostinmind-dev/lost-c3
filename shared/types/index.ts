export type AddonBareBonesType =
    | 'plugin'
    | 'drawing-plugin'
    | 'behavior'
;

export type AddonBaseMetadata = {
    readonly download_url: string;
    readonly addon_type: string;
    readonly version: string;
    readonly timestamp: number;
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
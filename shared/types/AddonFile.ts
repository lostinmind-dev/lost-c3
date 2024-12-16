export enum MimeType {
    HTML = 'text/html',
    JS = 'application/javascript',
    JSON = 'application/json',
    CSS = 'text/css',
    WASM = 'application/wasm',
    PNG = 'image/png',
    JPEG = 'image/jpeg',
    WEBP = 'image/webp',
    AVIF = 'image/avif',
    WEBM = 'video/webm',
    AUDIO_MP4 = 'audio/mp4',
    MPEG = 'audio/mpeg',
    OGG = 'audio/ogg',
    VIDEO_MP4 = 'video/mp4',
    FONT_WOFF = 'application/font-woff',
    WOFF2 = 'font/woff2',
    TXT = 'text/plain',
    CSV = 'text/csv',
    XML = 'text/xml',
    SVG = 'image/svg+xml',
    ZIP = 'application/zip'
}

export type AddonFile =
    | ICopyToOutputAddonFile
    | IExternalCSSAddonFile
    | IAddonIconFile
    | IAddonImageFile
    | IAddonScriptFile
    | IAddonModuleScriptFile
    | IAddonDomSideScriptFile
    ;

export type AddonFileType =
    | 'icon'
    | 'image'
    | 'file'
    | AddonScriptFileType
    ;

type AddonScriptFileType =
    | 'script'
    | 'module-script'
    | 'domside-script'
    ;

type AddonFileBase = {
    /** Type of file */
    readonly type: AddonFileType;
    /** File name */
    readonly name: string;
    /** File path */
    readonly path: string;
}

export enum AddonFileDependencyType {
    CopyToOutput = 'copy-to-output',
    ExternalCSS = 'external-css',
    ExternalDomScript ='external-dom-script',
    ExternalRuntimeScript = 'external-runtime-script'
}

/**
 * File
 */

export interface ICopyToOutputAddonFile extends AddonFileBase {
    readonly type: 'file';
    readonly mimeType: MimeType;
    readonly dependencyType: AddonFileDependencyType.CopyToOutput;
}

export interface IExternalCSSAddonFile extends AddonFileBase {
    readonly type: 'file';
    readonly dependencyType: AddonFileDependencyType.ExternalCSS;
}

/**
 * All Scripts
 */
interface IAddonScriptFileBase extends AddonFileBase {
    readonly type: AddonScriptFileType;
    readonly isTypescript: boolean;

};

/** Script */


export interface IAddonScriptFile extends IAddonScriptFileBase {
    readonly type: 'script';
    readonly dependencyType: AddonFileDependencyType;
    readonly scriptType?: 'module';
}

/** Module Script */
export interface IAddonModuleScriptFile extends IAddonScriptFileBase {
    readonly type: 'module-script';
}

/** Dom Side Script */
interface IAddonDomSideScriptFile extends IAddonScriptFileBase {
    readonly type: 'domside-script';
}


/**
 * Icon
 */
export type AddonIconFileName =
    | 'icon.svg'
    | 'icon.png'

export interface IAddonIconFile extends AddonFileBase {
    readonly type: 'icon';
    readonly name: AddonIconFileName;
    readonly iconType: MimeType.PNG | MimeType.SVG;
}

/**
 * Image
 */
export type AddonImageFileName = 'default.png';

export interface IAddonImageFile extends AddonFileBase {
    readonly type: 'image';
    readonly name: AddonImageFileName;
}
import type { MimeType } from "../../shared/mime.ts";

export type AddonFile<T = 'all'> =
    T extends 'all' ? AllAddonFileTypes :
    T extends 'file' ? (IAddonCopyToOutputFile | IAddonExternalCSSFile) :
    T extends 'icon' ? AddonIconFile :
    T extends 'image' ? IAddonImageFile :
    T extends 'script' ? IAddonScriptFile :
    T extends 'module-script' ? IAddonModuleScriptFile : never
;

type AllAddonFileTypes =
    | IAddonCopyToOutputFile
    | IAddonExternalCSSFile
    | AddonIconFile
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
    /** File name for final addon build */
    localName?: string;
    /** File path for final addon build */
    localPath?: string;
    /** Full path for final addon build */
    addonPath?: string;
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

export interface IAddonCopyToOutputFile extends AddonFileBase {
    readonly type: 'file';
    readonly mimeType: MimeType;
    readonly dependencyType: AddonFileDependencyType.CopyToOutput;
}

export interface IAddonExternalCSSFile extends AddonFileBase {
    readonly type: 'file';
    readonly dependencyType: AddonFileDependencyType.ExternalCSS;
}

/**
 * All Scripts
 */
interface IAddonScriptFileBase extends AddonFileBase {
    readonly type: AddonScriptFileType;
    readonly isTypescript: boolean;
    isEditorScript?: boolean

};

/** Script */


export interface IAddonScriptFile extends IAddonScriptFileBase {
    readonly type: 'script';
    readonly dependencyType: AddonFileDependencyType.ExternalDomScript | AddonFileDependencyType.ExternalRuntimeScript;
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
;

export type AddonIconFile = 
    | IAddonUserIconFile
    | IAddonDefaultIconFile
;

interface IAddonUserIconFile extends AddonFileBase {
    readonly isDefault: false;
    readonly type: 'icon';
    readonly iconType: MimeType.PNG | MimeType.SVG;
}

interface IAddonDefaultIconFile extends AddonFileBase {
    readonly isDefault: true;
    readonly type: 'icon';
    readonly name: 'icon.svg';
    readonly path: '',
    readonly iconType: MimeType.SVG;
}

/**
 * Image
 */
export interface IAddonImageFile extends AddonFileBase {
    readonly type: 'image';
    readonly name: 'default.png';
}
interface ILost {
    readonly addonId: string;
}

declare const Lost: ILost;

declare type AddonFileType = 'icon' | 'file' | 'script' | 'module';

declare type AddonFileBase = {
    readonly type: AddonFileType;
    readonly fileName: string;
    readonly path: string;
    readonly relativePath: string;
}

declare type AddonUserFile = AddonFileCopyToOutput | AddonFileExternalCss;

declare interface AddonFileExternalCss extends AddonFileBase {
    readonly type: 'file';
    readonly dependencyType: 'external-css';
}

declare interface AddonFileCopyToOutput extends AddonFileBase {
    readonly type: 'file';
    readonly mimeType: MIMEFileType;
    readonly dependencyType: 'copy-to-output';
}

declare interface AddonScriptFile extends AddonFileBase {
    readonly type: 'script';
    readonly scriptType?: 'module';
    readonly dependencyType: 'external-dom-script' | 'external-runtime-script';
    readonly isTypescript: boolean;
}

declare interface AddonModuleFile extends AddonFileBase {
    readonly type: 'module',
    readonly isTypescript: boolean;
}

declare type MIMEFileType = 
    | 'unknown'
    | 'application/json'
    | 'application/javascript'
    | 'application/pdf'
    | 'application/xml'
    | 'application/zip'
    | 'application/x-www-form-urlencoded'
    | 'application/vnd.ms-excel'
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/vnd.ms-powerpoint'
    | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    | 'application/msword'
    | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    | 'audio/mpeg'
    | 'audio/wav'
    | 'audio/ogg'
    | 'audio/webm'
    | 'image/jpeg'
    | 'image/png'
    | 'image/gif'
    | 'image/bmp'
    | 'image/webp'
    | 'image/svg+xml'
    | 'text/plain'
    | 'text/html'
    | 'text/css'
    | 'text/javascript'
    | 'text/csv'
    | 'text/xml'
    | 'video/mp4'
    | 'video/mpeg'
    | 'video/ogg'
    | 'video/webm'
    | 'video/quicktime'
    | 'application/wasm'
;

declare interface AddonIconFile extends AddonFileBase {
    readonly type: 'icon';
    readonly iconType: 'image/png' | 'image/svg+xml' ;
}
declare interface IAddonBaseMetadata {
    readonly download_url: string;
    readonly addon_type: string;
    readonly version: string;
    readonly timestamp: number;
}

declare type AddonFileType =
    | 'icon'
    | 'file'
    | 'script'
    | 'module'
    | 'dom-side-script'
;

declare type AddonFileBase = {
    readonly type: AddonFileType;
    readonly fileName: string;
    readonly path: string;
    readonly relativePath: string;
}

declare interface AddonUserDomSideScriptFile extends AddonFileBase {
    readonly type: 'dom-side-script';
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

declare interface AddonUserScriptFile extends AddonFileBase {
    readonly type: 'script';
    readonly scriptType?: 'module';
    readonly dependencyType: 'external-dom-script' | 'external-runtime-script';
    readonly isTypescript: boolean;
}

declare interface AddonUserModuleFile extends AddonFileBase {
    readonly type: 'module',
    readonly isTypescript: boolean;
}

declare type MIMEFileType = 
    | 'text/html'
    | 'application/javascript'
    | 'application/json'
    | 'text/css'
    | 'application/wasm'
    | 'image/png'
    | 'image/jpeg'
    | 'image/webp'
    | 'image/avif'
    | 'video/webm'
    | 'audio/mp4'
    | 'audio/mpeg'
    | 'audio/ogg'
    | 'video/mp4'
    | 'application/font-woff'
    | 'font/woff2'
    | 'text/plain'
    | 'text/csv'
    | 'text/xml'
    | 'image/svg+xml'
    | 'application/zip'
;

declare type AddonIconMimeType = 
    | 'image/png'
    | 'image/svg+xml'
;

declare interface AddonIconFile extends AddonFileBase {
    readonly isDefault: boolean;
    readonly type: 'icon';
    readonly iconType: AddonIconMimeType;
}
import type { AddonType, LostConfig } from "./config.ts";
import type { PluginProperty } from "./entities/plugin-property.ts";

type LostAddonDataFile = {
    readonly type: AddonFileType;
    readonly path: string;
    readonly dependencyType?: 'external-css' | 'copy-to-output' | 'external-dom-script' | 'external-runtime-script';
    readonly mimeType?: MIMEFileType
}

type AddonIconData = {
    readonly iconType: AddonIconMimeType;
    readonly path: string;
}

export class LostAddonData {
    readonly icon: AddonIconData;
    readonly config: LostConfig<AddonType>;
    readonly remoteScripts: string[] = [];
    readonly files: LostAddonDataFile[] = [];
    readonly pluginProperties: PluginProperty<any, any, any>[];

    constructor(
        icon: AddonIconData,
        config: LostConfig<AddonType>,
        pluginProperties: PluginProperty<any, any, any>[],
        remoteScripts: string[],
        userFiles: AddonUserFile[],
        userScripts: AddonUserScriptFile[],
        userModules: AddonUserModuleFile[],
        userDomSideScripts: AddonUserDomSideScriptFile[]
    ) {
        this.icon = icon;
        this.config = config;
        this.pluginProperties = pluginProperties;
        this.remoteScripts = remoteScripts;

        for (const file of userFiles) {
            this.files.push({
                type: 'file',
                path: file.relativePath,
                dependencyType: file.dependencyType,
                mimeType: (file as AddonFileCopyToOutput).mimeType
            })
        }

        for (const file of userScripts) {
            this.files.push({
                type: 'script',
                path: file.relativePath,
                dependencyType: file.dependencyType
            })
        }

        for (const file of userModules) {
            this.files.push({
                type: 'module',
                path: file.relativePath
            })
        }

        for (const file of userDomSideScripts) {
            this.files.push({
                type: 'dom-side-script',
                path: file.relativePath
            })
        }
    }
}
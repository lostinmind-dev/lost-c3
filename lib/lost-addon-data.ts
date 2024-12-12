import { Paths } from "../shared/paths.ts";
import { AddonFolders } from "../shared/paths/addon-folders.ts";
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
    readonly hasDefaultImage: boolean;
    readonly icon: AddonIconData;
    readonly config: LostConfig<AddonType>;
    readonly remoteScripts: string[] = [];
    readonly files: LostAddonDataFile[] = [];
    readonly pluginProperties: PluginProperty<any, any, any>[];

    constructor(
        hasDefaultImage: boolean,
        icon: AddonIconData,
        config: LostConfig<AddonType>,
        pluginProperties: PluginProperty<any, any, any>[],
        remoteScripts: string[],
        userFiles: AddonUserFile[],
        userScripts: AddonUserScriptFile[],
        userModules: AddonUserModuleFile[],
        userDomSideScripts: AddonUserDomSideScriptFile[]
    ) {
        this.hasDefaultImage = hasDefaultImage;
        this.icon = icon;
        this.config = config;
        this.pluginProperties = pluginProperties;
        this.remoteScripts = remoteScripts;

        for (const file of userFiles) {
            let path: string;
            const folders = Paths.getFoldersAfterFolder(file.localPath, AddonFolders.Files);

            if (folders.length > 0) {
                path = `${file.finalPath}/${folders.join('/')}/${file.localName}`
            } else {
                path = `${file.finalPath}/${file.localName}`
            }

            this.files.push({
                type: 'file',
                path,
                dependencyType: file.dependencyType,
                mimeType: (file as AddonFileCopyToOutput).mimeType
            })
        }

        for (const file of userScripts) {
            let path: string;
            const folders = Paths.getFoldersAfterFolder(file.localPath, AddonFolders.Scripts);

            if (folders.length > 0) {
                path = `${file.finalPath}/${folders.join('/')}/${file.localName}`
            } else {
                path = `${file.finalPath}/${file.localName}`
            }

            this.files.push({
                type: 'script',
                path,
                dependencyType: file.dependencyType
            })
        }

        for (const file of userModules) {
            let path: string;
            const folders = Paths.getFoldersAfterFolder(file.localPath, AddonFolders.Modules);

            if (folders.length > 0) {
                path = `${file.finalPath}/${folders.join('/')}/${file.localName}`
            } else {
                path = `${file.finalPath}/${file.localName}`
            }

            this.files.push({
                type: 'module',
                path
            })
        }

        for (const file of userDomSideScripts) {
            let path: string;
            const folders = Paths.getFoldersAfterFolder(file.localPath, AddonFolders.DomSide);

            if (folders.length > 0) {
                path = `${file.finalPath}/${folders.join('/')}/${file.localName}`
            } else {
                path = `${file.finalPath}/${file.localName}`
            }

            this.files.push({
                type: 'dom-side-script',
                path
            })
        }
    }
}
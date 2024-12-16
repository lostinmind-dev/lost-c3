
import { PluginProperty } from "./entities/plugin-property.ts";
import { LostAddonProject } from "./lost.ts";
import { AddonFileManager } from "./managers/addon-file-manager.ts";
import type { RemoteScript } from "../shared/types.ts";
import { AddonFileDependencyType, type AddonFileType, type MimeType} from "../shared/types/AddonFile.ts";

type LostAddonDataFile = {
    readonly type: AddonFileType;
    readonly path: string;
    readonly dependencyType?: AddonFileDependencyType;
    readonly mimeType?: MimeType;
}


export class LostAddonData {
    readonly config = LostAddonProject.addon._config;
    readonly files: LostAddonDataFile[];
    readonly remoteScripts: RemoteScript[];
    readonly properties: PluginProperty<any, any, any, any>[] = [];

    constructor() {
        this.files = [];
        this.remoteScripts = [];
        this.properties = [];
        this.#addRemoteScripts();
        this.#addFiles();
        this.#addProperties();
    }

    #addRemoteScripts() {
        this.remoteScripts.push(...LostAddonProject.addon._remoteScripts);
    }

    #addFiles() {
        LostAddonProject.addon._files.forEach(file => {
            this.files.push({
                type: file.type,
                path: AddonFileManager.getFilePath(file.type, file.path, file.name),
                dependencyType: (
                    file.type === 'file' || file.type === 'script'
                ) ? file.dependencyType : undefined,
                mimeType: (
                    file.type === 'file' &&
                    file.dependencyType === AddonFileDependencyType.CopyToOutput
                ) ? file.mimeType : undefined
            })
        })
    }

    #addProperties() {
        this.properties.push(...LostAddonProject.addon._properties)
    }
}
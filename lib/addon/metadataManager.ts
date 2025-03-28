import type {
    Addons,
    Addon,
} from "./config/index.ts";


type MetadataJson = {
    "supports-worker-mode"?: boolean;
    "min-construct-version"?: Addon['info']['minConstructVersion'];
    "is-c3-addon": true;
    "sdk-version": 2;
    "type": keyof Addons;
    "name": string;
    "id": string;
    "version": Addon['info']['version'];
    "author": string;
    "website": Addon['info']['websiteUrl'];
    "documentation": Addon['info']['docsUrl'];
    "description": string;
    "editor-scripts": string[];
    "file-list": string[];
}

export class MetadataManager {
    createJson<Type extends keyof Addons>(config: Addon<Type>): MetadataJson {
        const data: MetadataJson = {
            "supports-worker-mode": config.info.supportWorkerMode,
            "min-construct-version": config.info.minConstructVersion,
            "is-c3-addon": true,
            "sdk-version": 2,
            "type": config.type,
            "name": config.info.name,
            "id": config.info.id,
            "version": config.info.version,
            "author": config.info.author,
            "website": config.info.websiteUrl || 'https://lostinmind.com',
            "documentation": config.info.docsUrl || 'https://lostinmind.com',
            "description": config.info.description || '-',
            "editor-scripts": [
                `${config.type}.js`,
                'type.js',
                'instance.js',
                ...config.getEditorScriptsList()
            ],
            "file-list": [
                'c3runtime/main.js',
                `c3runtime/${config.type}.js`,
                'c3runtime/type.js',
                'c3runtime/instance.js',
                'c3runtime/categories.js',
                'c3runtime/actions.js',
                'c3runtime/conditions.js',
                'c3runtime/expressions.js',
                'lang/en-US.json',
                'aces.json',
                'addon.json',
                'instance.js',
                `${config.type}.js`,
                'type.js',
                'icon.svg',
                ...config.getFilesList()
            ]
        };

        return data;
    }
}
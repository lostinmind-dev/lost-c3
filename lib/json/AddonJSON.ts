import type { AddonType } from "../config/Config.ts";

type EditorScript = "plugin.js" | "type.js" | "instance.js" | "behavior.js";

export interface AddonJSON {
    "supports-worker-mode"?: boolean;
    "min-construct-version"?: string;
    "is-c3-addon": true;
    "sdk-version": 2;
    "type": AddonType;
    "name": string;
    "id": string;
    "version": string;
    "author": string;
    "website": string;
    "documentation": string;
    "description": string;
    "editor-scripts": EditorScript[];
    "file-list": string[];
} 
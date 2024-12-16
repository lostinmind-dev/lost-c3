import type { AddonType } from "../../../lib/config.ts";

export type AddonJSON = {
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
    "editor-scripts": string[];
    "file-list": string[];
};


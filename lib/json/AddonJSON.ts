// deno-lint-ignore-file no-namespace

import type { EffectCategory, EffectRendererType } from '../config/Config.ts';
import type { EffectParameterType } from '../params/EffectParameters.ts';

type EditorScript = "plugin.js" | "type.js" | "instance.js" | "behavior.js";

interface EffectParameter {
    "id": string;
    "type": EffectParameterType;
    "initial-value": number | [number, number, number];
    "uniform": string;
}

export namespace AddonJSON {
    export interface PluginOrBehavior {
        "supports-worker-mode"?: boolean;
        "min-construct-version"?: string;
        "is-c3-addon": true;
        "sdk-version": 2;
        "type": 'plugin' | 'behavior';
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

    export interface Theme {
        "is-c3-addon": true;
        "type": 'theme';
        "name": string;
        "id": string;
        "version": string;
        "author": string;
        "website": string;
        "documentation": string;
        "description": string;
        "stylesheets": string[];
        "file-list": string[];
    }

    export interface Effect {
        "is-deprecated": boolean;

        "is-c3-addon": true;
        "type": 'effect';
        "name": string;
        "id": string;
        "version": string;
        "author": string;
        "website": string;
        "documentation": string;
        "description": string;
        "file-list": string[];
        "category": EffectCategory;

        "supported-renderers": EffectRendererType[];
        "uses-depth": boolean;
        "cross-sampling": boolean;
        "preserves-opaqueness": boolean;
        "animated": boolean;
        "must-predraw": boolean;
        "supports-3d-direct-rendering": boolean;
        "extend-box": {
            "horizontal": number;
            "vertical": number;
        }
        "blends-background": boolean;
        "parameters": EffectParameter[];
    }
}
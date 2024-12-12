import type { AddonType } from "../../lib/config.ts";

type AddonBaseCollection = {
    readonly [key in AddonType]: string;
}

type BareBonesCollection = {
    readonly [key in AddonBareBonesType]: string;
}

export abstract class Links {
    static readonly ConstructTypes = 'https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/types/construct.d.ts';

    static readonly BareBones: BareBonesCollection = {
        "plugin": 'https://github.com/lostinmind-dev/lostc3-plugin-bare-bones.git',
        "behavior": 'https://github.com/lostinmind-dev/lostc3-behavior-bare-bones.git',
        "drawing-plugin": 'https://github.com/lostinmind-dev/lostc3-drawing-plugin-bare-bones.git'
    };

    static readonly AddonBase: AddonBaseCollection = {
        plugin: `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/.addon_base/plugin/plugin.js`,
        behavior: `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/.addon_base/behavior/behavior.js`,
    }
}
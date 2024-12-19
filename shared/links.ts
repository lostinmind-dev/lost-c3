import type { AddonBareBonesType, AddonType } from "../lib/types/index.ts";

type AddonBaseLinks = {
    readonly [key in AddonType]: string;
}

type BareBonesLinks = {
    readonly [key in AddonBareBonesType]: string;
}

type TreeName =
    | 'master'
    | '4.0.0'



export abstract class Links {
    static readonly #tree: TreeName = '4.0.0'
    static readonly PayPal = 'https://www.paypal.com/paypalme/daklnn';
    static readonly Boosty = ''
    static readonly GitHub = 'https://github.com/lostinmind-dev/lost-c3';
    static readonly JSR = 'https://jsr.io/@lost-c3/lib';
    static readonly ConstructTypes = `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/${this.#tree}/construct.d.ts`;

    static readonly BareBones: BareBonesLinks = {
        "plugin": 'https://github.com/lostinmind-dev/lostc3-plugin-bare-bones.git',
        "behavior": 'https://github.com/lostinmind-dev/lostc3-behavior-bare-bones.git',
        "drawing-plugin": 'https://github.com/lostinmind-dev/lostc3-drawing-plugin-bare-bones.git'
    }

    static readonly AddonBase: AddonBaseLinks = {
        "plugin": `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/${this.#tree}/lib/addon/bases/plugin.js`,
        "behavior": `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/${this.#tree}/lib/addon/bases/behavior.js`,
    }
}
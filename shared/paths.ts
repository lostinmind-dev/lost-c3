import { join } from "../deps.ts";
import type { AddonType } from "../lib/config.ts";

type BareBonesCollection = {
    readonly [key in AddonType]: string;
}

export abstract class Paths {
    static readonly ConstructTypes = 'https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/types/construct.d.ts';
    static readonly BareBones: BareBonesCollection = {
        plugin: 'https://github.com/lostinmind-dev/lostc3-plugin-bare-bones.git'
    };
    static readonly AddonBase = 'https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/.addon_base';
    static readonly Main = Deno.cwd();
    static readonly Build = join(this.Main, 'Builds', 'Source');

    /** Addon */
    static readonly Categories = join(this.Main, 'Addon', 'Categories');
    static readonly Files = join(this.Main, 'Addon', 'Files');
    static readonly Scripts = join(this.Main, 'Addon', 'Scripts');
    static readonly Modules = join(this.Main, 'Addon', 'Modules');
}
import { join } from "../deps.ts";

export abstract class Paths {
    static readonly AddonBase = 'https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/addon_base';
    static readonly Main = Deno.cwd();
    static readonly Build = join(this.Main, 'Builds', 'Source');

    /** Addon */
    static readonly Categories = join(this.Main, 'Addon', 'Categories');
    static readonly Files = join(this.Main, 'Addon', 'Files');
    static readonly Scripts = join(this.Main, 'Addon', 'Scripts');
    static readonly Modules = join(this.Main, 'Addon', 'Modules');
}
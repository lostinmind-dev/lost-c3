import { join } from "../deps.ts";
import type { AddonType } from "../lib/config.ts";

type BareBonesCollection = {
    readonly [key in AddonBareBonesType]: string;
}

type AddonBaseCollection = {
    readonly [key in AddonType]: string;
}

export abstract class Paths {
    static readonly Main = Deno.cwd();
    static readonly AddonModulePath = import.meta.resolve(`file://${join(this.Main, 'addon.ts')}`);
    static readonly ConstructTypes = 'https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/types/construct.d.ts';
    static readonly BareBones: BareBonesCollection = {
        plugin: 'https://github.com/lostinmind-dev/lostc3-plugin-bare-bones.git',
        behavior: 'https://github.com/lostinmind-dev/lostc3-behavior-bare-bones.git',
        'drawing-plugin': 'https://github.com/lostinmind-dev/lostc3-drawing-plugin-bare-bones.git'
    };
    static readonly AddonBaseFolderName = '.addon_base';

    static readonly AddonBaseUrl: AddonBaseCollection = {
        plugin: `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/${this.AddonBaseFolderName}/plugin/plugin.js`,
        behavior: `https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/${this.AddonBaseFolderName}/behavior/behavior.js`,
    };
    static readonly LocalAddonBase: AddonBaseCollection = {
        plugin: join(this.Main, this.AddonBaseFolderName, 'plugin.js'),
        behavior: join(this.Main, this.AddonBaseFolderName, 'behavior.js'),
    };
    static readonly Build = join(this.Main, 'Builds', 'Source');

    /** Addon */
    static readonly UserAddonFolderName = 'Addon';
    static readonly UserCategories = join(this.Main, this.UserAddonFolderName, 'Categories');
    static readonly UserFiles = join(this.Main, this.UserAddonFolderName, 'Files');
    static readonly UserScripts = join(this.Main, this.UserAddonFolderName, 'Scripts');
    static readonly UserModules = join(this.Main, this.UserAddonFolderName, 'Modules');
    static readonly UserDomSideScripts = join(this.Main, this.UserAddonFolderName, 'DomSide');
}
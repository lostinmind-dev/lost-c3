import { join } from "../../deps.ts";

export abstract class ProjectFolders {
    static readonly AddonBase = '.addon_base';

    static readonly Addon = 'Addon';
    static readonly Categories = 'Categories';
    static readonly Files = 'Files';
    static readonly Scripts = 'Scripts';
    static readonly Modules = 'Modules';
    static readonly DomSide = 'DomSide';
    static readonly Types = 'Types'
        ;

    static readonly Editor = 'Editor';

    static readonly Builds = 'Builds';
    static readonly Source = 'Source'
        ;
}

export abstract class ProjectFoldersPaths {
    static readonly AddonBase = join(Deno.cwd(), ProjectFolders.AddonBase);
    static readonly Addon = join(Deno.cwd(), ProjectFolders.Addon);
    static readonly Builds = join(Deno.cwd(), ProjectFolders.Builds);
    static readonly Build = join(Deno.cwd(), ProjectFolders.Builds, ProjectFolders.Source);
    static readonly Editor = join(Deno.cwd(), ProjectFolders.Editor);

    static readonly Categories = join(this.Addon, ProjectFolders.Categories);
    static readonly Files = join(this.Addon, ProjectFolders.Files);
    static readonly Scripts = join(this.Addon, ProjectFolders.Scripts);
    static readonly Modules = join(this.Addon, ProjectFolders.Modules);
    static readonly DomSide = join(this.Addon, ProjectFolders.DomSide);
    static readonly Types = join(this.Addon, ProjectFolders.Types);
}
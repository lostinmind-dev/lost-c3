import { join } from "../../deps.ts";
import { ProjectFoldersPaths } from "./project-folders.ts";

export abstract class AddonFolders {
    static readonly Runtime = 'c3runtime';
    static readonly DomSide = 'domSide';
    static readonly Files = 'files';
    static readonly Modules = 'modules';
    static readonly Scripts = 'scripts';
    static readonly Lang = 'lang';
}

export abstract class AddonFoldersPaths {
    static readonly Root = ProjectFoldersPaths.Build;
    static readonly Runtime = join(ProjectFoldersPaths.Build, AddonFolders.Runtime);
    static readonly DomSide = join(ProjectFoldersPaths.Build, AddonFolders.Runtime, AddonFolders.DomSide);
    static readonly Modules = join(ProjectFoldersPaths.Build, AddonFolders.Runtime, AddonFolders.Modules);
    static readonly Files = join(ProjectFoldersPaths.Build, AddonFolders.Files);
    static readonly Scripts = join(ProjectFoldersPaths.Build, AddonFolders.Scripts);
    static readonly Lang = join(ProjectFoldersPaths.Build, AddonFolders.Lang);
}
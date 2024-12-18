import { join } from "../deps.ts";

export enum BuildFolders {
    C3Runtime = 'c3runtime',
    Scripts = 'scripts',
    Files = 'files',
    Languages = 'lang',
    Modules = 'modules'
}

export enum ProjectFolders {
    Source = 'Source',
    Scripts = 'Scripts',
    Modules = 'Modules',
    Files = 'Files',
}

export enum ProjectPaths {
    DenoJsonFile = 'deno.json',
    LostConfigFile = 'lost.config.ts',
    AddonModuleFile = 'addon.ts',
    AddonBase = '.addon_base',
    AddonBaseFile = `${ProjectPaths.AddonBase}/base.js`,
    AddonBaseMetadataFile = `${ProjectPaths.AddonBase}/metadata.json`,
    Addon = 'Addon',
    Categories = `${ProjectPaths.Addon}/Categories`,
    Runtime = `${ProjectPaths.Addon}/Runtime`,
    Editor = `${ProjectPaths.Addon}/Editor`,
    Files = `${ProjectPaths.Addon}/${ProjectFolders.Files}`,
    Scripts = `${ProjectPaths.Addon}/${ProjectFolders.Scripts}`,
    Modules = `${ProjectPaths.Addon}/${ProjectFolders.Modules}`,
    Types = 'Types',
    Builds = 'Builds',
    Source = `${ProjectPaths.Builds}/${ProjectFolders.Source}`,

    /**
     * Runtime scripts 
     */
    RuntimeInstanceFile = `${ProjectPaths.Runtime}/Instance.ts`,
    RuntimePluginFile = `${ProjectPaths.Runtime}/Plugin.ts`,
    RuntimeBehaviorFile = `${ProjectPaths.Runtime}/Behavior.ts`,
    RuntimeTypeFile = `${ProjectPaths.Runtime}/Type.ts`,

    /**
     * Editor scripts 
     */
    EditorIntanceFile = `${ProjectPaths.Editor}/Instance.ts`,
    EditorTypeFile = `${ProjectPaths.Editor}/Type.ts`,

    ConstructTypesFile = `${ProjectPaths.Types}/construct.d.ts`,
    PluginPropertiesTypesFile = `${ProjectPaths.Types}/properties.d.ts`
}

export abstract class Paths {
    /** Root folder */
    static readonly Root = Deno.cwd();
    static readonly DenoJsonFile = join(this.Root, ProjectPaths.DenoJsonFile);
    static readonly LostConfigFile = `file://${join(this.Root, ProjectPaths.LostConfigFile)}`;
    /** Addon base bolder */
    static readonly AddonBase = join(this.Root, ProjectPaths.AddonBase);
    static readonly AddonBaseFile = join(this.Root, ProjectPaths.AddonBaseFile);
    static readonly AddonBaseMetadataFile = join(this.Root, ProjectPaths.AddonBaseMetadataFile);

    /** Main addon module file */
    static readonly AddonModuleFile = import.meta.resolve(`file://${join(this.Root, ProjectPaths.AddonModuleFile)}`);

    /** Lost folders */
    static readonly Addon = join(this.Root, ProjectPaths.Addon);
    static readonly AddonCategories = join(this.Root, ProjectPaths.Categories);
    static readonly AddonFiles = join(this.Root, ProjectPaths.Files);
    static readonly AddonScripts = join(this.Root, ProjectPaths.Scripts);
    static readonly AddonModules = join(this.Root, ProjectPaths.Modules);
    static readonly AddonTypes = join(this.Root, ProjectPaths.Types);
    static readonly ConstructTypesFile = join(this.Root, ProjectPaths.ConstructTypesFile);
    static readonly PluginPropertiesTypesFile = join(this.Root, ProjectPaths.PluginPropertiesTypesFile);

    /** Main addon runtime scripts folder */
    static readonly RuntimeScripts = join(this.Root, ProjectPaths.Addon);

    /** Addon runtime scripts */
    static readonly RuntimeInstanceFile = join(this.Root, ProjectPaths.RuntimeInstanceFile);
    static readonly RuntimePluginFile = join(this.Root, ProjectPaths.RuntimePluginFile);
    static readonly RuntimeBehaviorFile = join(this.Root, ProjectPaths.RuntimeBehaviorFile);
    static readonly RuntimeTypeFile = join(this.Root, ProjectPaths.RuntimeTypeFile);

    /** Main addon editor scripts folder */
    static readonly EditorScripts = join(this.Root, ProjectPaths.Editor);

    /** Addon editor scripts */
    static readonly EditorIntanceFile = join(this.Root, ProjectPaths.EditorIntanceFile);
    static readonly EditorTypeFile = join(this.Root, ProjectPaths.EditorTypeFile);
    
    /** Addon builds folders */
    static readonly Builds = join(this.Root, ProjectPaths.Builds);

    /** Final addon folder */
    static readonly Build = join(this.Root, ProjectPaths.Source);

    static readonly BuildAddonC3Runtime = join(this.Build, BuildFolders.C3Runtime);
    static readonly BuildAddonLanguages = join(this.Build, BuildFolders.Languages)
    static readonly BuildAddonFiles = join(this.Build, BuildFolders.Files);
    static readonly BuildAddonScripts = join(this.Build, BuildFolders.Scripts);
    static readonly BuildAddonModules = join(this.Build, BuildFolders.Modules);

    static getFoldersAfterFolder(path: string, folderName: string): string[] {
        const normalizedPath = path.replace(/\\/g, '/');
        const regex = new RegExp(`/${folderName}/`);
        const match = normalizedPath.match(regex);

        if (!match) {
            return [];
        }

        const endIndex = normalizedPath.indexOf(match[0]) + match[0].length;

        const remainingPath = normalizedPath.slice(endIndex);

        return remainingPath.split('/').filter(Boolean);
    }
}
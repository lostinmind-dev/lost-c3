import { join } from "../deps.ts";

export enum BuildFolders {
    C3Runtime = 'c3runtime',
    Scripts = 'scripts',
    Files = 'files',
    Languages = 'lang',
    Modules = 'modules'
}

enum ProjectFiles {
    DenoJSON = 'deno.json',
    LostConfig = 'lost.config.ts',
    AddonModule = 'addon.ts',
    AddonBase = 'base.js',
    AddonBaseMetadata = 'metadata.json',
}

export enum ProjectFolders {
    AddonBase = '.addon_base',
    Source = 'source',
    Scripts = 'scripts',
    Modules = 'modules',
    Files = 'files',
    Categories = 'categories',
    Runtime = 'runtime',
    Editor = 'editor',
    Addon = 'addon',
    Types = 'types',
    Builds = 'builds',
}

export enum ProjectPaths {
    DenoJsonFile = `${ProjectFiles.DenoJSON}`,
    LostConfigFile = `${ProjectFiles.LostConfig}`,
    AddonModuleFile = `${ProjectFiles.AddonModule}`,
    AddonBase = `${ProjectFolders.AddonBase}`,
    AddonBaseFile = `${ProjectPaths.AddonBase}/${ProjectFiles.AddonBase}`,
    AddonBaseMetadataFile = `${ProjectPaths.AddonBase}/${ProjectFiles.AddonBaseMetadata}`,
    Addon = `${ProjectFolders.Addon}`,
    Categories = `${ProjectPaths.Addon}/${ProjectFolders.Categories}`,
    Runtime = `${ProjectPaths.Addon}/${ProjectFolders.Runtime}`,
    Editor = `${ProjectPaths.Addon}/${ProjectFolders.Editor}`,
    Files = `${ProjectPaths.Addon}/${ProjectFolders.Files}`,
    Scripts = `${ProjectPaths.Addon}/${ProjectFolders.Scripts}`,
    Modules = `${ProjectPaths.Addon}/${ProjectFolders.Modules}`,
    Types = `${ProjectFolders.Types}`,
    Builds = `${ProjectFolders.Builds}`,
    Source = `${ProjectPaths.Builds}/${ProjectFolders.Source}`,

    /**
     * Runtime scripts 
     */
    RuntimeInstanceFile = `${ProjectPaths.Runtime}/instance.ts`,
    RuntimePluginFile = `${ProjectPaths.Runtime}/plugin.ts`,
    RuntimeBehaviorFile = `${ProjectPaths.Runtime}/behavior.ts`,
    RuntimeTypeFile = `${ProjectPaths.Runtime}/type.ts`,

    /**
     * Editor scripts 
     */
    EditorIntanceFile = `${ProjectPaths.Editor}/instance.ts`,
    EditorTypeFile = `${ProjectPaths.Editor}/type.ts`,

    ConstructTypesFile = `${ProjectPaths.Types}/construct.d.ts`,
    PluginPropertiesTypesFile = `${ProjectPaths.Types}/properties.d.ts`
}

export abstract class Paths {
    /** Root folder */
    static readonly Root = Deno.cwd();
    static readonly DenoJsonFile = join(this.Root, ProjectPaths.DenoJsonFile);
    static readonly LostConfigFile = import.meta.resolve(`file://${join(this.Root, ProjectPaths.LostConfigFile)}`);
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
    static #buildFolderName: string = ProjectFolders.Source;
    static Build = join(this.Root, ProjectPaths.Source);

    static BuildAddonC3Runtime = join(this.Build, BuildFolders.C3Runtime);
    static BuildAddonLanguages = join(this.Build, BuildFolders.Languages)
    static BuildAddonFiles = join(this.Build, BuildFolders.Files);
    static BuildAddonScripts = join(this.Build, BuildFolders.Scripts);
    static BuildAddonModules = join(this.Build, BuildFolders.Modules);

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

    static getBuildFolderName(): string {
        return this.#buildFolderName;
    }

    static updateBuildPath(folderName: string) {
        this.#buildFolderName = folderName;
        this.Build = join(this.Builds, folderName);
        this.BuildAddonC3Runtime = join(this.Build, BuildFolders.C3Runtime);
        this.BuildAddonLanguages = join(this.Build, BuildFolders.Languages)
        this.BuildAddonFiles = join(this.Build, BuildFolders.Files);
        this.BuildAddonScripts = join(this.Build, BuildFolders.Scripts);
        this.BuildAddonModules = join(this.Build, BuildFolders.Modules);
    }
}
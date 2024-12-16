import { join } from "../../deps.ts";
import type { AddonType } from "../../lib/config.ts";
import { ProjectFolders } from "./project-folders.ts";

export abstract class ProjectFilesPaths {
    static readonly RuntimeInstance = join(Deno.cwd(), ProjectFolders.Addon, 'Instance.ts');
    static readonly RuntimePlugin = join(Deno.cwd(), ProjectFolders.Addon, 'Plugin.ts');
    static readonly RuntimeBehavior = join(Deno.cwd(), ProjectFolders.Addon, 'Behavior.ts');
    static readonly RuntimeType = join(Deno.cwd(), ProjectFolders.Addon, 'Type.ts');

    static readonly EditorInstance = join(Deno.cwd(), ProjectFolders.Editor, 'Instance.ts');
    static readonly EditorType = join(Deno.cwd(), ProjectFolders.Editor, 'Type.ts');

    static readonly AddonModule = import.meta.resolve(`file://${join(Deno.cwd(), 'addon.ts')}`);

    static getAddonBasePath(addonType: AddonType): string {
        return join(Deno.cwd(), ProjectFolders.AddonBase, `${addonType}.js`);
    }

    static readonly Config = join(Deno.cwd(), 'lost.config.ts')
}
import DenoJson from '../deno.json' with { type: "json" };
import { Colors, join, Logger } from "../deps.ts";
import type { AddonType } from "../lib/config.ts";
import { LostAddonProject } from "../lib/lost.ts";
import { Paths } from "../shared/paths.ts";

export async function downloadAddonBase(addonType: AddonType) {
    Logger.Log(`🌐 Downloading addon base ...`);

    await Deno.mkdir(join(Paths.Root, '.addon_base'), { recursive: true });

    const response = await fetch(Paths.Links.AddonBase[addonType]);

    if (!response.ok) {
        Logger.Error('build', 'Error while getting addon base', `Status: ${response.statusText}`);
        Deno.exit(1);
    }

    const fileContent = await response.text();

    const metadata: IAddonBaseMetadata = {
        download_url: Paths.Links.AddonBase[addonType],
        addon_type: addonType,
        version: DenoJson.version,
        timestamp: Date.now()
    }

    await Deno.writeTextFile(join(Paths.ProjectFolders.AddonBase, 'metadata.json'), JSON.stringify(metadata, null, 4));
    await Deno.writeTextFile(Paths.ProjectFiles.AddonBase[addonType], fileContent);
    Logger.Success(Colors.bold(`${Colors.green('Successfully')} installed addon base!`));
}
    

export default async function checkAddonBaseExists() {
    const addonType = LostAddonProject.addon._config.type;
    
    try {
        const dirStat = await Deno.stat(Paths.ProjectFiles.AddonBase[addonType]);

        if (dirStat) {
            const fileContent = await Deno.readTextFile(join(Paths.ProjectFolders.AddonBase, 'metadata.json'));
            const metadata: IAddonBaseMetadata = JSON.parse(fileContent);

            if (metadata.version !== DenoJson.version) {
                await downloadAddonBase(addonType);
            }
        }

    } catch (_e) {
        await downloadAddonBase(addonType);
    }
    
}

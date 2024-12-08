import DenoJson from '../deno.json' with { type: "json" };
import { join, Logger } from "../deps.ts";
import type { AddonType } from "../lib/config.ts";
import { Paths } from "../shared/paths.ts";

export async function downloadAddonBase(addonType: AddonType) {
    Logger.Log(`🌐 Downloading addon base ...`);

    await Deno.mkdir(join(Paths.Main, '.addon_base'), { recursive: true });

    const response = await fetch(Paths.AddonBaseUrl[addonType]);

    if (!response.ok) {
        Logger.Error('build', 'Error while getting addon base', `Status: ${response.statusText}`);
        Deno.exit(1);
    }

    const fileContent = await response.text();

    const metadata: IAddonBaseMetadata = {
        download_url: Paths.AddonBaseUrl[addonType],
        addon_type: addonType,
        version: DenoJson.version,
        timestamp: Date.now()
    }

    await Deno.writeTextFile(join(Paths.Main, Paths.AddonBaseFolderName, 'metadata.json'), JSON.stringify(metadata, null, 4));
    await Deno.writeTextFile(Paths.LocalAddonBase[addonType], fileContent);
}
    

export default async function checkAddonBaseExists(addonType: AddonType) {
    
    try {
        const dirStat = await Deno.stat(Paths.LocalAddonBase[addonType]);

        if (dirStat) {
            const fileContent = await Deno.readTextFile(join(Paths.Main, Paths.AddonBaseFolderName, 'metadata.json'));
            const metadata: IAddonBaseMetadata = JSON.parse(fileContent);

            if (metadata.version !== DenoJson.version) {
                await downloadAddonBase(addonType);
            }
        }

    } catch (_e) {
        await downloadAddonBase(addonType);
    }
    
}

import { Colors, join, Logger } from "../../deps.ts";
import { Paths } from "../../shared/paths.ts";
import type { LostAddonData } from "../../shared/types.ts";

export default async function getDefaultAddonPluginFile(lostData: LostAddonData) {

    try {
        const url = join(Paths.AddonBase, 'plugin', 'plugin.js');
        Logger.Log(`🌐 Fetching "plugin.js" file from ${Colors.dim(url)}`)
        const response = await fetch(url);

        if (!response.ok) {
            Logger.Error('build', 'Error while getting "plugin.js" file', `Status: ${response.statusText}`);
            Deno.exit(1);
        }

        let fileContent = await response.text();

        fileContent = `const _lostData = ${JSON.stringify(lostData)};\n` + fileContent;

        return fileContent;
    } catch (e) {
        Logger.Error('build', 'Error while getting "plugin.js" file', `Error: ${e}`);
        Deno.exit(1);
    }
}
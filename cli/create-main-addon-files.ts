import { join } from "../deps.ts";
import type { Plugin } from "../lib/plugin.ts";
import PluginFile from "./defaults/plugin-file.ts";
import InstanceFile from './defaults/instance-file.ts';
import TypeFile from './defaults/type-file.ts';
import { Paths } from "../shared/paths.ts";

export default async function createMainAddonFiles(plugin: Plugin) {
    await createPluginFile();
    await createTypeFile();
    await createInstanceFile();
    
    async function createPluginFile() {
        const fileContent = await PluginFile({
            icon: plugin._icon,
            config: plugin._config,
            remoteScripts: plugin._remoteScripts,
            userFiles: plugin._userFiles,
            userScripts: plugin._userScripts,
            userModules: plugin._userModules,
            pluginProperties: plugin._pluginProperties
        });
        await Deno.writeTextFile(join(Paths.Build, 'plugin.js'), fileContent);
    }

    async function createTypeFile() {
        const fileContent = TypeFile(plugin._config.addonId);
        await Deno.writeTextFile(join(Paths.Build, 'type.js'), fileContent);
    }

    async function createInstanceFile() {
        const fileContent = InstanceFile(plugin._config.addonId);
        await Deno.writeTextFile(join(Paths.Build, 'instance.js'), fileContent);
    }
}
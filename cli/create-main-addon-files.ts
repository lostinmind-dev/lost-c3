import type { Plugin } from "../lib/plugin.ts";
import type { Behavior } from "../lib/behavior.ts";

import { Paths } from "../shared/paths.ts";
import { join } from "../deps.ts";

import BehaviorFile from "./defaults/behavior-file.ts";
import PluginFile from "./defaults/plugin-file.ts";
import InstanceFile from './defaults/instance-file.ts';
import TypeFile from './defaults/type-file.ts';

export default async function createMainAddonFiles(addon: Plugin | Behavior) {

    switch (addon._type) {
        case "plugin":
            await createPluginFile();
            break;
        case "behavior":
            await createBehaviorFile();
            break;
    }
    
    await createTypeFile();
    await createInstanceFile();
    
    async function createBehaviorFile() {
        const fileContent = await BehaviorFile({
            icon: addon._icon,
            config: addon._config,
            remoteScripts: addon._remoteScripts,
            userFiles: addon._userFiles,
            userScripts: addon._userScripts,
            userModules: addon._userModules,
            pluginProperties: addon._pluginProperties
        });
        await Deno.writeTextFile(join(Paths.Build, 'behavior.js'), fileContent);
    }

    async function createPluginFile() {
        if (addon._type === 'plugin') {
            const fileContent = await PluginFile({
                icon: addon._icon,
                config: addon._config,
                remoteScripts: addon._remoteScripts,
                userFiles: addon._userFiles,
                userScripts: addon._userScripts,
                userDomSideScripts: addon._userDomSideScripts,
                userModules: addon._userModules,
                pluginProperties: addon._pluginProperties
            });
            await Deno.writeTextFile(join(Paths.Build, 'plugin.js'), fileContent);
        }
    }

    async function createTypeFile() {
        const fileContent = TypeFile(addon._config);
        await Deno.writeTextFile(join(Paths.Build, 'type.js'), fileContent);
    }

    async function createInstanceFile() {
        const fileContent = InstanceFile(addon._config);
        await Deno.writeTextFile(join(Paths.Build, 'instance.js'), fileContent);
    }
}
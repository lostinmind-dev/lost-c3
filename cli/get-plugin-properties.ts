import { getModule } from "./misc.ts";
import type { PluginProperty } from "../lib/plugin-props.ts";
import { PLUGIN_PROPERTIES_FILE_PATH } from "./paths.ts";

interface PluginPropertiesModule {
    PluginProperties: PluginProperty[];
}

export async function getPluginProperties() {
    const module = await getModule<PluginPropertiesModule>(PLUGIN_PROPERTIES_FILE_PATH);
    return module.PluginProperties;
};
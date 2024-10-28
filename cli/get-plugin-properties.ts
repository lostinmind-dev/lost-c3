import { getModule } from "./misc.ts";
import type { Property } from "../lib/plugin-props.ts";
import { PLUGIN_PROPERTIES_FILE_PATH } from "./paths.ts";

interface PluginPropertiesModule {
    default: Property[];
}

export async function getPluginProperties() {
    const module = await getModule<PluginPropertiesModule>(PLUGIN_PROPERTIES_FILE_PATH);
    return module.default;
};
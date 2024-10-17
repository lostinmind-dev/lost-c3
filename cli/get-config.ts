import { getModule } from "./misc.ts";
import type { LostConfig } from "../lib/common.ts";
import { CONFIG_FILE_PATH } from "./paths.ts";

interface ConfigModule {
    default: LostConfig<'plugin' | 'behavior'>;
}

export async function getConfig() {
    const module = await getModule<ConfigModule>(CONFIG_FILE_PATH);
    return module.default;   
};
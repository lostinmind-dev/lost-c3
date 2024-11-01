import { getModule } from "./misc.ts";
import type { AddonType, LostConfig } from "../lib/common.ts";
import { CONFIG_FILE_PATH } from "./paths.ts";

interface ConfigModule {
    default: LostConfig<AddonType>;
}

export async function getConfig() {
    const module = await getModule<ConfigModule>(CONFIG_FILE_PATH);
    return module.default;   
};
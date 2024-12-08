import type { AddonType, LostConfig } from "../config.ts";

type DefaultLost = {
    varName: string;
    value: string;
}

export function getDefaultLost(config: LostConfig<AddonType>): DefaultLost {
    const varName = 'Lost';

    return {
        varName,
        value: `const ${varName} = ${JSON.stringify({
            addonId: config.addonId
        })};`
    }
}
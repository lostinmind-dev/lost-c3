

import type { LostConfig } from "../../mod.ts";

const config: LostConfig<'plugin'> = {
    type: 'plugin',
    pluginType: 'object',
    // deprecated?: boolean;
    // minConstructVersion?: string;
    // canBeBundled?: boolean;
    objectName: 'LostPlugin',

    addonId: 'LostPluginId',
    category: 'general',
    addonName: 'Lost plugin for Construct 3',
    addonDescription: 'My awesome addon was made with Lost',
    version: '1.0.0.0',
    author: 'lostinmind.',
    docsUrl: 'https://myaddon.com/docs',
    helpUrl: {
        EN: 'https://myaddon.com/help/en'
    },
    websiteUrl: 'https://myaddon.com'
}

export default config;
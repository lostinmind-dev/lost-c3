

import { defineConfig } from "../../mod.ts";

export default defineConfig<'behavior'>({
    type: 'behavior',
    // deprecated?: boolean;
    // minConstructVersion?: string;
    // canBeBundled?: boolean;
    isOnlyOneAllowed: true,
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
})
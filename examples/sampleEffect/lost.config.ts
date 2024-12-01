import type { LostConfig } from "../../mod.ts";

const config: LostConfig<'effect'> = {
    type: 'effect',
    
    addonId: 'LostPluginId',
    category: 'color',
    addonName: 'Lost plugin for Construct 3',
    addonDescription: 'My awesome addon was made with Lost',
    version: '1.0.0.0',
    author: 'lostinmind.',
    docsUrl: 'https://myaddon.com/docs',
    helpUrl: {
        EN: 'https://myaddon.com/help/en'
    },
    websiteUrl: 'https://myaddon.com',

    // supportedRenderers?: {
    //     webgl2: true,
    //     webgpu: false
    // }

    blendsBackground: true,
    usesDepth: false,
    crossSampling: false,
    preservesOpaqueness: false,
    animated: false,
    mustPreDraw: false,

    // supports3DDirectRendering?: true,

    extendBox: {
        horizontal: 30,
        vertical: 30
    }
}
export default config;
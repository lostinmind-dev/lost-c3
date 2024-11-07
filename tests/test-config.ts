import { type LostConfig, EffectParameter } from '../mod.ts';

const Config: LostConfig<'effect'> = {
    Type: 'effect',

    Category: 'color',
    Deprecated: false,

    AddonId: '',

    AddonName: '',

    AddonDescription: '',

    Version: '',

    Author: '',

    WebsiteURL: '',

    DocsURL: '',

    SupportedRenderers: ['webgl', 'webgl2', 'webgpu'],
    BlendsBackground: false,
    UsesDepth: false,
    CrossSampling: false,
    PreservesOpaqueness: true,
    Animated: false,
    MustPredraw: true,
    Supports3DDirectRendering: false,
    ExtendBox: [30, 30]
}

const params: EffectParameter<any>[] = [
    new EffectParameter({
        Type: 'color',
        Id: 'adadad',
        Name: 'MyParameter',
        InitialValue: [0, 0, 0],
        Uniform: ''
    }),
    new EffectParameter({
        Type: 'float',
        Id: 'float',
        Name: 'MyParameter',
        InitialValue: 1,
        Uniform: ''
    }),
    new EffectParameter({
        Type: 'percent',
        Id: 'percent',
        Name: 'MyParameter',
        InitialValue: 0.5,
        Uniform: ''
    })
]

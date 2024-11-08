export type EffectParameterType = 'float' | 'percent' | 'color';

interface EffectParameterOptionsBase {
    /**
     * The type of the effect parameter.
     * @description This can be one of "float", "percent" or "color".
     * Floats pass a simple number. Percent displays a percentage in the 0-100 range but passes a float in the 0-1 range to the shader.
     * Color shows a color picker and passes a vec3 with components in the 0-1 range to the shader.
     * @example 'color'
     */
    Type: EffectParameterType;
    /**
     * A string identifying this parameter.
     */
    Id: string;
    /**
     * The name of the parameter.
     */
    Name: string;
    /**
     * The parameter description.
     */
    Description?: string;
    /**
     * WebGL only The name of the corresponding uniform in the shader.
     * @description The uniform must be declared in GLSL with this name.
     * It can use whichever precision you want, but the uniform type must be vec3 for color parameters, otherwise float.
     */
    Uniform: string;
}

interface FloatEffectParameterOptions extends EffectParameterOptionsBase {
    /**
     * A float parameter
     */
    Type: 'float';
    /**
     * The initial value of the shader uniform, in the float number format
     * @example 1
     */
    InitialValue: number;
}

interface PercentEffectParameterOptions extends EffectParameterOptionsBase {
    /**
     * A percent parameter
     */
    Type: 'percent';
    /**
     * The initial value of the shader uniform, in the  0-1 range
     * @example 0.5
     */
    InitialValue: number;
}

interface ColorEffectParameterOptions extends EffectParameterOptionsBase {
    /**
     * A color parameter
     */
    Type: 'color';
    /**
     * The initial value of the shader uniform, use a 3-element array, e.g. [1, 0, 0] for red.
     * @example [1, 0, 0] --> Red
     */
    InitialValue: [number, number, number];
}

export type EffectParameterOptions = FloatEffectParameterOptions | PercentEffectParameterOptions | ColorEffectParameterOptions;

export class EffectParameter<T extends EffectParameterOptions> {
    readonly Options: T;
    constructor(Options: T) {

        if (!Options.Description) Options.Description = 'There is no any description yet...';
        
        this.Options = Options;
    }
}
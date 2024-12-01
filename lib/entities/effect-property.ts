/** Object that represents all types of effect property. */
export enum EProperty {
    Float = 'float',
    Percent = 'percent',
    Color = 'color'
}


export class EffectProperty {
    readonly _id: string;
    readonly _name: string;
    readonly _description: string;
    readonly _opts: EffectPropertyOptions

    constructor(id: string, name: string, description: string, opts: EffectPropertyOptions) {
        this._id = id;
        this._name = name;
        this._description = description;

        if (opts.type === EProperty.Color) {
            if (opts.initialValue) {
                opts.initialValue = this.normalizeRGB(opts.initialValue);
            }
        }

        this._opts = opts;
    }

    private normalizeRGB(colors: [number, number, number]): [number, number, number] {
        if (
            colors.length !== 3 || 
            colors.some(c => typeof c !== "number" || c < 0 || c > 255)
        ) {
            return [0, 0, 0];
        }
        return [colors[0] / 255, colors[1] / 255, colors[2] / 255];
    }
}

export type EffectPropertyOptions =
    | FloatProperty
    | PercentProperty
    | ColorProperty
;

type EffectPropertyOptionsBase = {
    /**
     * Type of effect property.
     */
    type: EProperty;
    /**
     * WebGL only The name of the corresponding uniform in the shader.
     * @description The uniform must be declared in GLSL with this name.
     * It can use whichever precision you want, but the uniform type must be vec3 for color parameters, otherwise float.
     * This only applies to WebGL shaders written in GLSL. The WebGPU renderer ignores this setting.
     */
    uniform: string
}

/** Object represents 'float' effect property */
interface FloatProperty extends EffectPropertyOptionsBase {
    type: EProperty.Float;
    /**
     * *Optional*. The initial value of the shader uniform, in the format the shader uses it (i.e. 0-1 range)
     */
    initialValue?: number;
}

/** Object represents 'percent' effect property */
interface PercentProperty extends EffectPropertyOptionsBase {
    type: EProperty.Percent;
    /**
     * *Optional*. The initial value of the shader uniform, in the format the shader uses it (i.e. 0-1 range)
     */
    initialValue?: number;
}

/** Object represents 'color' effect property */
interface ColorProperty extends EffectPropertyOptionsBase {
    type: EProperty.Color;
    /**
     * *Optional*. A color picker property.
     * Must be an RGB array of numbers.
     * @example [255, 255, 255]
     */
    initialValue?: [number, number, number];
}

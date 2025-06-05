import type { IAddonInfo } from "./addon.ts";

export type PluginInfo =
    | IObjectPluginInfo
    | IWorldPluginInfo
;

/** All available plugin categories */
type PluginCategory =
    | 'data-and-storage'
    | 'form-controls'
    | 'general'
    | 'input'
    | 'media'
    | 'monetisation'
    | 'platform-specific'
    | 'web'
    | 'other'
    | '3d'
;

export interface IObjectPluginInfo extends IAddonInfo {
    readonly type: 'object';
    /**
        * The category for the plugin when displaying it in the Create New Object Type dialog.
        * @example 'general'
        */
    readonly category: PluginCategory;
    /**
     * *Optional*. Default is ***False***. Pass true to set the plugin to be a single-global type.
     * @description The plugin type must be "object". Single-global plugins can only be added once to a project, and they then have a single permanent global instance available throughout the project. 
     * This is the mode that plugins like Touch and Audio use.
    */
    readonly singleGlobal?: boolean;
}

export interface IWorldPluginInfo extends IAddonInfo {
    readonly type: 'world';
    /**
        * The category for the plugin when displaying it in the Create New Object Type dialog.
        * @example 'general'
        */
    readonly category: PluginCategory;
    /**
     * *Optional*. Default is ***True***. Pass true to enable resizing instances in the Layout View.
     */
    readonly resizable?: boolean;
    /**
     * *Optional*. Default is ***True***. Pass true to enable the Angle property and rotating instances in the Layout View.
     */
    readonly rotatable?: boolean;
    /**
     * *Optional*. Default is ***False***. Pass true to specify that this plugin renders in 3D.
     * @description This will cause the presence of the plugin in a project to enable 3D rendering when the project Rendering mode property is set to Auto (which is the default setting).
     */
    readonly is3D?: boolean;
    /**
     * *Optional*. Default is ***False***. Pass true to indicate that the image is intended to be tiled.
     * @description This adjusts the texture wrapping mode when Construct creates a texture for its image.
     */
    readonly tiled?: boolean;
    /** Built-in features */
    readonly supports?: Partial<Record<SupportType, true>>;
    /**
     * *Optional*. Default is ***True***. Pass true to disable an optimisation in the effects engine for objects that simply draw a texture the size of the object (e.g. Sprite).
     * @description This is necessary for effects to render correctly if the plugin draws anything other than the equivalent the Sprite plugin would.
     */
    readonly mustPreDraw?: boolean;
    /**
     * *Optional*. Add common built-in sets of actions, conditions and expressions (ACEs) to the plugin relating to various built-in features.
     * @description If adding common scene graph ACEs, your plugin must be prepared to handle being added in to a scene-graph hierarchy, and having its position, size and angle controlled automatically.
     * It must also support all the properties modifiable by hierarchies, otherwise the scene graph feature may not work as expected.
     */
    readonly commonACEs?: Partial<Record<CommonACEType, true>>;
}

type SupportType =
    /**
     * *Optional*. Default is ***True***. Pass true to allow using Z elevation with this plugin.
     * @description By default the renderer applies the Z elevation before calling the Draw() method on an instance, which in many cases is sufficient to handle rendering Z elevation correctly, but be sure to take in to account Z elevation in the drawing method if it does more complex rendering.
     */
    | 'zElevation'
    /**
     * *Optional*. Default is ***True***. Pass true to allow using the built-in color property to tint the object appearance.
     * @description By default the renderer sets the color before calling the Draw() method on an instance, which in many cases is sufficient to handle rendering with the applied color, but be sure to take in to account the instance color in the drawing method if it does more complex rendering.
     */
    | 'color'
    /**
     * *Optional*. Default is ***True***. Pass true to allow using effects, including the Blend mode property, with this plugin.
     * @description If the plugin does not simply draw a texture the size of the object (as Sprite does), you should also call SetMustPreDraw(true).
     */
    | 'effects'
;

type CommonACEType =
    | 'position'
    | 'scene_graph'
    | 'size'
    | 'angle'
    | 'appereance'
    | 'z_order'
;
/** All available types of Lost config. */
export type LostConfig<A = any, P = any> =
    A extends 'plugin' ? PluginConfig<P> :
    A extends 'behavior' ? BehaviorConfig : never
    ;

/** Base properties for any Lost config. */
type LostConfigBase<A> = {
    /** Type of addon */
    readonly type: A;
    /**
      * An object name that will applied after plugin was installed/added to project.
      * @example 'MyPlugin'
      */
    readonly objectName: string;
    /**
     * The unique ID of the addon.
     * @description This is not displayed and is only used internally.
     * This must not be used by any other addon ever published for Construct 3, and must never change after you first publish your addon. 
     * (The name is the only visible identifier of the addon in the Construct 3 editor, so that can be changed any time, but the ID must always be the same.) 
     * To ensure it is unique, it is recommended to use a vendor-specific prefix, 
     * @example 'MyCompany_MyAddon'.
     */
    readonly addonId: string;
    /**
     * The displayed name of the addon, in **English**.
     * @example 'Addon for Construct 3'
     */
    readonly addonName: string;
    /**
     * A string of a brief description of what the addon does, displayed when prompting the user to install the addon.
     * @example 'My awesome addon was made with Lost for...'
     */
    readonly addonDescription: string;
    /**
     * A string specifying the addon version in four parts (major, minor, patch, revision)
     * @example '1.0.0.0'
     */
    readonly version: string;
    /**
     * A string identifying the author of the addon.
     * @example 'lostinmind.'
     */
    readonly author: string;
    /**
     * A string of a URL to the author's website. 
     * @description It is recommended to provide updates to the addon at this URL if any become available. 
     * The website should use HTTPS.
     * @example 'https://addon.com'
     */
    readonly websiteUrl: string;
    /**
     * A string of a URL to the online documentation for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     * @example 'https://docs.addon.com'
     */
    readonly docsUrl: string;
    /**
     * A string of a URL to the help resource for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     * @example 'https://addon.com/help'
     */
    readonly helpUrl: string
    /**
     * *Optional*. Default is ***True***.
     * A boolean indicating whether the addon supports Construct's worker mode, where the entire runtime is hosted in a Web Worker instead of the main thread.
     * @description Providing the addon only uses APIs available in a Web Worker, then it is compatible; where access to the DOM is necessary, then a DOM script can be used to still access those features in worker mode - see Runtime scripts for more details. 
     * Therefore it should be possible for every addon to support worker mode, and supporting it is strongly recommended as worker mode can bring performance benefits.
     * This can be set to false to indicate that the addon does not yet support worker mode, which may be useful to expedite addon development or if the addon makes use of extremely complex DOM operations.
     * This will cause worker mode "auto" to switch to DOM mode which may degrade the performance of the project.
     * If the user attempts to switch worker mode to "Yes" in project using the addon, then Construct will show an error message highlighting the addon that does not support the mode, and prevent changing the setting.
     */
    readonly supportWorkerMode?: boolean;
    /**
     * *Optional*. Default is ***False***. Set a boolean of whether the addon is deprecated or not. 
     * @description If you wish to replace your addon with another one, the old one can be deprecated with true. 
     * This makes it invisible in the editor so it cannot be used in new projects; however old projects with the addon already added can continue to load and work as they did before. 
     * This discourages use of the deprecated addon without breaking existing projects that use it.
     */
    readonly deprecated?: boolean;
    /**
     * *Optional*. Default is ***undefined***. The minimum Construct version required to load your addon, e.g. "r399".
     * @description If not specified, the addon will be allowed to be installed with any version of Construct. 
     * If specified and the user attempts to install the addon with a version lower than the minimum, then Construct will prevent installation and show a message indicating that a newer version of Construct must be used. 
     * If the user installs the addon with a newer version of Construct and then rolls back to an older version of Construct lower than the minimum, then Construct will refuse to load the addon (a message will be logged to the console) and the editor will act as if the addon is not installed.
     * @example "r399"
     */
    readonly minConstructVersion?: string;
    /**
     * *Optional*. Default is ***True***.
     * @description Pass false to prevent the addon from being bundled via the Bundle addons project property. 
     * By default all addons may be bundled with a project, and it is recommended to leave this enabled for best user convenience. 
     * However if you publish a commercial addon and want to prevent it being distributed by project-bundling, you may wish to disable this.
     */
    readonly canBeBundled?: boolean;
}

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

interface IPluginConfigBase<P> extends LostConfigBase<'plugin'> {
    /**
     * Set the plugin type.
     * @description This can be "object" or "world".
     * The world typeh represents a plugin that appears in the Layout View, whereas the object type represents a hidden plugin, similar to the Audio plugin (a single-global type) or Dictionary.
     * World type plugins must derive from SDK.IWorldInstanceBase instead of SDK.IInstanceBase and implement a Draw() method.
     */
    readonly pluginType: P;
    /**
        * The category for the plugin when displaying it in the Create New Object Type dialog.
        * @example 'general'
        */
    readonly category: PluginCategory;
}

/** Object represents configs for Plugin addon type. */
export type PluginConfig<P> =
    P extends 'object' ? IObjectPluginConfig :
    P extends 'world' ? IWorldPluginConfig : never
    ;

/** Object represents config for Object Plugin addon. */
interface IObjectPluginConfig extends IPluginConfigBase<'object'> {
    /**
     * *Optional*. Default is ***False***. Pass true to set the plugin to be a single-global type.
     * @description The plugin type must be "object". Single-global plugins can only be added once to a project, and they then have a single permanent global instance available throughout the project. 
     * This is the mode that plugins like Touch and Audio use.
    */
    readonly isSingleGlobal?: boolean;
}

interface IWorldPluginConfig extends IPluginConfigBase<'world'> {
    /**
     * *Optional*. Default is ***True***. Pass true to enable resizing instances in the Layout View.
     */
    readonly isResizable?: boolean;
    /**
     * *Optional*. Default is ***True***. Pass true to enable the Angle property and rotating instances in the Layout View.
     */
    readonly isRotatable?: boolean;
    /**
     * *Optional*. Default is ***False***. Pass true to specify that this plugin renders in 3D.
     * @description This will cause the presence of the plugin in a project to enable 3D rendering when the project Rendering mode property is set to Auto (which is the default setting).
     */
    readonly is3D?: boolean;
    /**
     * *Optional*. Default is ***False***. Pass true to indicate that the image is intended to be tiled.
     * @description This adjusts the texture wrapping mode when Construct creates a texture for its image.
     */
    readonly isTiled?: boolean;
    /**
     * *Optional*. Default is ***True***. Pass true to allow using Z elevation with this plugin.
     * @description By default the renderer applies the Z elevation before calling the Draw() method on an instance, which in many cases is sufficient to handle rendering Z elevation correctly, but be sure to take in to account Z elevation in the drawing method if it does more complex rendering.
     */
    readonly supportsZElevation?: boolean;
    /**
     * *Optional*. Default is ***True***. Pass true to allow using the built-in color property to tint the object appearance.
     * @description By default the renderer sets the color before calling the Draw() method on an instance, which in many cases is sufficient to handle rendering with the applied color, but be sure to take in to account the instance color in the drawing method if it does more complex rendering.
     */
    readonly supportsColor?: boolean;
    /**
     * *Optional*. Default is ***True***. Pass true to allow using effects, including the Blend mode property, with this plugin.
     * @description If the plugin does not simply draw a texture the size of the object (as Sprite does), you should also call SetMustPreDraw(true).
     */
    readonly supportsEffects?: boolean;
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
    readonly commonACEs?: CommonACEsType[];
}

type CommonACEsType =
    | 'position'
    | 'scene_graph'
    | 'size'
    | 'angle'
    | 'appereance'
    | 'z_order'
    ;

type BehaviorCategory =
    | 'attributes'
    | 'general'
    | 'movements'
    | 'other'
    ;

/** Object represents config for Behavior addon type. */
export type BehaviorConfig = {
    /**
      * An object name that will applied after plugin was installed/added to project.
      * @example 'MyPlugin'
      */
    readonly objectName: string;
    /**
     * *Optional*. Default is ***True***.
     * A boolean indicating whether the addon supports Construct's worker mode, where the entire runtime is hosted in a Web Worker instead of the main thread.
     * @description Providing the addon only uses APIs available in a Web Worker, then it is compatible; where access to the DOM is necessary, then a DOM script can be used to still access those features in worker mode - see Runtime scripts for more details. 
     * Therefore it should be possible for every addon to support worker mode, and supporting it is strongly recommended as worker mode can bring performance benefits.
     * This can be set to false to indicate that the addon does not yet support worker mode, which may be useful to expedite addon development or if the addon makes use of extremely complex DOM operations.
     * This will cause worker mode "auto" to switch to DOM mode which may degrade the performance of the project.
     * If the user attempts to switch worker mode to "Yes" in project using the addon, then Construct will show an error message highlighting the addon that does not support the mode, and prevent changing the setting.
     */
    readonly supportWorkerMode?: boolean;
    /**
     * *Optional*. Default is ***False***. Set a boolean of whether the addon is deprecated or not. 
     * @description If you wish to replace your addon with another one, the old one can be deprecated with true. 
     * This makes it invisible in the editor so it cannot be used in new projects; however old projects with the addon already added can continue to load and work as they did before. 
     * This discourages use of the deprecated addon without breaking existing projects that use it.
     */
    readonly deprecated?: boolean;
    /**
     * *Optional*. Default is ***undefined***. The minimum Construct version required to load your addon, e.g. "r399".
     * @description If not specified, the addon will be allowed to be installed with any version of Construct. 
     * If specified and the user attempts to install the addon with a version lower than the minimum, then Construct will prevent installation and show a message indicating that a newer version of Construct must be used. 
     * If the user installs the addon with a newer version of Construct and then rolls back to an older version of Construct lower than the minimum, then Construct will refuse to load the addon (a message will be logged to the console) and the editor will act as if the addon is not installed.
     * @example "r399"
     */
    readonly minConstructVersion?: string;
    /**
     * *Optional*. Default is ***True***.
     * @description Pass false to prevent the addon from being bundled via the Bundle addons project property. 
     * By default all addons may be bundled with a project, and it is recommended to leave this enabled for best user convenience. 
     * However if you publish a commercial addon and want to prevent it being distributed by project-bundling, you may wish to disable this.
     */
    readonly canBeBundled?: boolean;
    /**
     * *Optional*. Default is ***False***. Set a boolean of whether the behavior is allowed to be added more than once to the same object.
     * @description The default is false, which means the behavior can be added multiple times to the same object.
     * Set to true to only allow it to be added once to each object.
     */
    readonly isOnlyOneAllowed?: boolean;
    /**
     * The category for the behavior when displaying it in the Add behavior dialog.
     * @example 'general'
     */
    readonly category: BehaviorCategory;
} & LostConfigBase<'behavior'>;
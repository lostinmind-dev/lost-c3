export type AddonType = 'plugin' | 'behavior' | 'theme' | 'effect' | 'drawing-plugin';

export type ScriptDependencyType = 'external-dom-script' | 'external-runtime-script';

export type FileDependencyType = 'external-css' | 'copy-to-output';

interface ExternalRuntimeScript {
    /**
     * Path to file without './Scripts'
     * @example "library.js"
     */
    FileName: string;
    /**
     * A script dependency that is included via the addition of an extra <script> tag in the exported HTML file, or loaded on the worker with importScripts() in worker mode.
     * @description This means the script is always directly available to runtime code. However the dependency must be designed to work in a Web Worker, e.g. not assuming the DOM is present. 
     * The script is not minified on export.
     */
    Type: "external-runtime-script";
}

interface ExternalDomScript {
    /**
     * Path to file without './Scripts'
     * @example "library.js"
     */
    FileName: string;
    /**
     * A script dependency that is included via the addition of an extra <script> tag in the exported HTML file.
     * @description The scriptType option can be set to "module" to load the script as a module (see below).
     * Note in worker mode the script is loaded in the DOM, so is not directly available to the runtime code in the worker.
     * The script is not minified on export.
     * This is suitable for large external libraries that the addon references.
     */
    Type: 'external-dom-script';
    /**
     * Optional. By default external DOM scripts are loaded as "classic" scripts. 
     * @description This property can be set to the string "module" to instead load the external DOM script as a module (i.e. with <script src="filename.js" type="module"></script>).
     * @example "module"
     */
    ScriptType?: 'module';
}

interface ExternalCSSFile {
    /**
     * Path to file without './Files'
     * @example "styles.css"
     */
    FileName: string;
    /**
     * A stylesheet dependency that is included via the addition of an extra <link rel="stylesheet"> tag in the exported HTML file, in case the addon needs to specify CSS styles.
     */
    Type: 'external-css'
}

interface CopyToOutputFile {
    /**
     * Path to file without './Files'
     * @example "data.txt"
     */
    FileName: string;
    /**
     * This simply causes the file to be copied to the output folder when exporting.
     * @description The file is also available in preview mode.
     * This is useful for bundling additional resources, such as an image file that needs to be loaded at runtime, or a script that is dynamically loaded.
     */
    Type: 'copy-to-output'
}

export enum LTS {
    R397_4 = 'r397-4'
}

export enum BETA {
    R408 = 'r408',
    R409 = 'r409',
    R410 = 'r410',
    R411 = 'r411',
    R412 = 'r412',
    R413 = 'r413',
    R414 = 'r414'
}

export enum STABLE {
    R407_2 = 'r407-2'
}

interface ConfigBase {
    Type: AddonType;
    /**
     * Optional. Default is **True**.
     * A boolean indicating whether the addon supports Construct's worker mode, where the entire runtime is hosted in a Web Worker instead of the main thread. 
     * @description Providing the addon only uses APIs available in a Web Worker, then it is compatible; where access to the DOM is necessary, then a DOM script can be used to still access those features in worker mode - see Runtime scripts for more details. 
     * Therefore it should be possible for every addon to support worker mode, and supporting it is strongly recommended as worker mode can bring performance benefits.
     * This can be set to false to indicate that the addon does not yet support worker mode, which may be useful to expedite addon development or if the addon makes use of extremely complex DOM operations.
     * This will cause worker mode "auto" to switch to DOM mode which may degrade the performance of the project.
     * If the user attempts to switch worker mode to "Yes" in project using the addon, then Construct will show an error message highlighting the addon that does not support the mode, and prevent changing the setting.
     */
    SupportsWorkerMode?: boolean;
    /**
     * Optional. The minimum Construct version required to load your addon, e.g. "r399".
     * @description If not specified, the addon will be allowed to be installed with any version of Construct. 
     * If specified and the user attempts to install the addon with a version lower than the minimum, then Construct will prevent installation and show a message indicating that a newer version of Construct must be used. 
     * If the user installs the addon with a newer version of Construct and then rolls back to an older version of Construct lower than the minimum, then Construct will refuse to load the addon (a message will be logged to the console) and the editor will act as if the addon is not installed.
     * @example "r399"
     */
    MinConstructVersion?: STABLE | BETA | LTS;
    /**
     * The unique ID of the addon.
     * @description This is not displayed and is only used internally.
     * This must not be used by any other addon ever published for Construct 3, and must never change after you first publish your addon. 
     * (The name is the only visible identifier of the addon in the Construct 3 editor, so that can be changed any time, but the ID must always be the same.) 
     * To ensure it is unique, it is recommended to use a vendor-specific prefix, 
     * @example "MyCompany_MyAddon".
     */
    AddonId: string;
    /**
     * Optional. Default is **False**. Set a boolean of whether the addon is deprecated or not. 
     * @description If you wish to replace your addon with another one, the old one can be deprecated with true. 
     * This makes it invisible in the editor so it cannot be used in new projects; however old projects with the addon already added can continue to load and work as they did before. 
     * This discourages use of the deprecated addon without breaking existing projects that use it.
     */
    Deprecated?: boolean;
    /**
     * Optional. Default is **True**.
     * @description Pass false to prevent the addon from being bundled via the Bundle addons project property. 
     * By default all addons may be bundled with a project, and it is recommended to leave this enabled for best user convenience. 
     * However if you publish a commercial addon and want to prevent it being distributed by project-bundling, you may wish to disable this.
     */
    CanBeBundled?: boolean;
    /**
     * The displayed name of the addon, in English.
     * @example "Addon for Construct 3"
     */
    AddonName: string;
    /**
     * A string of a brief description of what the addon does, displayed when prompting the user to install the addon.
     */
    AddonDescription: string;
    /**
     * A string specifying the addon version in four parts (major, minor, patch, revision)
     * @example "1.0.0.0"
     */
    Version: string;
    /**
     * A string identifying the author of the addon.
     */
    Author: string;
    /**
     * A string of a URL to the author's website. 
     * @description It is recommended to provide updates to the addon at this URL if any become available. 
     * The website should use HTTPS.
     */
    WebsiteURL: string;
    /**
     * A string of a URL to the online documentation for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     */
    DocsURL: string;
    /**
     * An object name that will applied after plugin was installed/added to project.
     */
    ObjectName: string;
    /**
     * Optional. Setup your scripts from 'Scripts' folder.
     * @example [{FileName: "library.js", Type: "external-dom-script", ScriptType?: "module"}]
     */
    Scripts?: (ExternalDomScript | ExternalRuntimeScript)[];
    /**
     * Optional. Add a remote URL to load a script from.
     * @description The script URL must not use http: in its URL. On the modern web this will often be blocked from secure sites as mixed content. 
     * You must either use secure HTTPS, or a same-protocol URL.
     * @example ["https://example.com/api.js"]
     */
    RemoteScripts?: string[];
    /**
     * Optional. Setup your files from 'Files' folder.
     * @example [{FileName: "styles.css", Type: "external-css"}]
     */
    Files?: (ExternalCSSFile | CopyToOutputFile)[];
    /**
     * Optional. Specify an array of TypeScript definition files (.d.ts) from ./Addon/Types folder.
     * @description This should be used to provide full TypeScript definitions of any script interfaces your addon provides, which is necessary for projects using TypeScript with your addon.
     */
    // TypeScriptDefinitionFiles?: string[];
}

type PluginCategory = 'data-and-storage' | 'form-controls' | 'general' | 'input' | 'media' | 'monetisation' | 'platform-specific' | 'web' | 'other';

interface PluginConfig extends ConfigBase {
    Type: 'plugin',
    /**
     * The category for the plugin when displaying it in the Create New Object Type dialog.
     * @example "general"
     */
    Category: PluginCategory;
    /**
     * Optional. Default is **False**. Pass true to set the plugin to be a single-global type.
     * @description The plugin type must be "object". Single-global plugins can only be added once to a project, and they then have a single permanent global instance available throughout the project. 
     * This is the mode that plugins like Touch and Audio use.
     */
    IsSingleGlobal?: boolean;
}

interface DrawingPluginConfig extends ConfigBase {
    Type: 'drawing-plugin',
    /**
     * The category for the plugin when displaying it in the Create New Object Type dialog.
     * @example "general"
     */
    Category: PluginCategory;
    /**
     * Pass true to enable resizing instances in the Layout View.
     */
    IsResizable: boolean;
    /**
     * Pass true to enable the Angle property and rotating instances in the Layout View.
     */
    IsRotatable: boolean;
    /**
     * Optional. Default is **False**. Pass true to specify that this plugin renders in 3D.
     * @description This will cause the presence of the plugin in a project to enable 3D rendering when the project Rendering mode property is set to Auto (which is the default setting).
     */
    Is3D?: boolean;
    /**
     * Optional. Default is **False**. Pass true to add a single editable image, such as used by the Tiled Background plugin.
     */
    HasImage?: boolean;
    /**
     * Optional. Default is **False**. Pass true to indicate that the image is intended to be tiled.
     * @description This adjusts the texture wrapping mode when Construct creates a texture for its image.
     */
    IsTiled?: boolean;
    /**
     * Pass true to allow using Z elevation with this plugin.
     * @description By default the renderer applies the Z elevation before calling the Draw() method on an instance, which in many cases is sufficient to handle rendering Z elevation correctly, but be sure to take in to account Z elevation in the drawing method if it does more complex rendering.
     */
    SupportsZElevation: boolean;
    /**
     * Pass true to allow using the built-in color property to tint the object appearance.
     * @description By default the renderer sets the color before calling the Draw() method on an instance, which in many cases is sufficient to handle rendering with the applied color, but be sure to take in to account the instance color in the drawing method if it does more complex rendering.
     */
    SupportsColor: boolean;
    /**
     * Pass true to allow using effects, including the Blend mode property, with this plugin.
     * @description If the plugin does not simply draw a texture the size of the object (as Sprite does), you should also set *MustPreDraw*: **true**.
     */
    SupportsEffects: boolean;
    /**
     * Pass true to disable an optimisation in the effects engine for objects that simply draw a texture the size of the object (e.g. Sprite).
     * @description This is necessary for effects to render correctly if the plugin draws anything other than the equivalent the Sprite plugin would.
     */
    MustPreDraw: boolean;
    /**
     * Add common built-in sets of actions, conditions and expressions (ACEs) to the plugin relating to various built-in features.
     */
    CommonACEs?: {
        Position?: true;
        SceneGraph?: true;
        Size?: true;
        Angle?: true;
        Appearance?: true;
        ZOrder?: true;
    }
}

type BehaviorCategory = 'attributes' | 'general' | 'movements' | 'other';

interface BehaviorConfig extends ConfigBase {
    Type: 'behavior',
    /**
     * The category for the behavior when displaying it in the Add behavior dialog.
     * @example "general"
     */
    Category: BehaviorCategory;
    /** Optional. Set a boolean of whether the behavior is allowed to be added more than once to the same object.
     * @description The default is false, which means the behavior can be added multiple times to the same object.
     * Set to true to only allow it to be added once to each object.
     */
    IsOnlyOneAllowed?: boolean;
}

interface ThemeConfig {
    Type: 'theme',
    /**
     * The unique ID of the addon.
     * @description This is not displayed and is only used internally.
     * This must not be used by any other addon ever published for Construct 3, and must never change after you first publish your addon. 
     * (The name is the only visible identifier of the addon in the Construct 3 editor, so that can be changed any time, but the ID must always be the same.) 
     * To ensure it is unique, it is recommended to use a vendor-specific prefix, 
     * @example "MyCompany_MyAddon".
     */
    AddonId: string;
    /**
     * The displayed name of the addon, in English.
     * @example "Addon for Construct 3"
     */
    AddonName: string;
    /**
     * A string of a brief description of what the addon does, displayed when prompting the user to install the addon.
     */
    AddonDescription: string;
    /**
     * A string specifying the addon version in four parts (major, minor, patch, revision)
     * @example "1.0.0.0"
     */
    Version: string;
    /**
     * A string identifying the author of the addon.
     */
    Author: string;
    /**
     * A string of a URL to the author's website. 
     * @description It is recommended to provide updates to the addon at this URL if any become available. 
     * The website should use HTTPS.
     */
    WebsiteURL: string;
    /**
     * A string of a URL to the online documentation for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     */
    DocsURL: string;
}

export type EffectCategory = '3d' | 'blend' | 'color' | 'distortion' | 'mask' | 'normal-mapping' | 'tiling' | 'other';

export type EffectRendererType = 'webgl' | 'webgl2' | 'webgpu';

interface EffectConfig {
    Type: 'effect',
    /**
     * The category the effect should appear in.
     * @example "color"
     */
    Category: EffectCategory;
    /**
     * Optional. Default is **False**. Boolean to indicate a deprecated effect.
     * @description This hides the effect from the Add effect dialog, but allows existing projects to continue using it.
     * This allows an effect to be phased out without breaking projects.
     */
    Deprecated?: boolean;
    /**
     * The unique ID of the addon.
     * @description This is not displayed and is only used internally.
     * This must not be used by any other addon ever published for Construct 3, and must never change after you first publish your addon. 
     * (The name is the only visible identifier of the addon in the Construct 3 editor, so that can be changed any time, but the ID must always be the same.) 
     * To ensure it is unique, it is recommended to use a vendor-specific prefix, 
     * @example "MyCompany_MyAddon".
     */
    AddonId: string;
    /**
     * The displayed name of the addon, in English.
     * @example "Addon for Construct 3"
     */
    AddonName: string;
    /**
     * A string of a brief description of what the addon does, displayed when prompting the user to install the addon.
     */
    AddonDescription: string;
    /**
     * A string specifying the addon version in four parts (major, minor, patch, revision)
     * @example "1.0.0.0"
     */
    Version: string;
    /**
     * A string identifying the author of the addon.
     */
    Author: string;
    /**
     * A string of a URL to the author's website. 
     * @description It is recommended to provide updates to the addon at this URL if any become available. 
     * The website should use HTTPS.
     */
    WebsiteURL: string;
    /**
     * A string of a URL to the online documentation for the addon. 
     * @description It is important to provide documentation for your addon to be useful to users.
     */
    DocsURL: string;
    /**
     * An array of strings indicating the supported renderers for this effect.
     * @description The string "webgl2" can be added to support a WebGL 2 variant of the effect - see the section on WebGL shaders for more details.
     * The string "webgpu" can be added to support the WebGPU renderer with a shader written in WGSL - see the section on WebGPU shaders for more details.
     * @link https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-effects/webgl-shaders
     * @link https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-effects/webgpu-shaders
     * @example ['webgl']
     * 
     */
    SupportedRenderers: EffectRendererType[];
    /**
     * Boolean indicating whether the effect blends with the background.
     * @description Objects and layers can use effects that blend with the background, but layouts cannot.
     */
    BlendsBackground: boolean;
    /**
     * Boolean indicating whether the effect samples the depth buffer with the samplerDepth uniform.
     * @description This is used for depth-based effects like fog.
     */
    UsesDepth: boolean;
    /**
     * Boolean indicating whether a background-blending effect has inconsistent sampling of the background and foreground.
     * @description A normal blending shader like Multiply will sample the background and foreground 1:1, so each foreground pixel samples only the background pixel it is rendered to.
     * This is consistent sampling so cross-sampling should be false. However an effect that distorts the background, like Glass or a masking Warp effect, can sample different background pixels to the foreground pixel being rendered, so should set cross-sampling to true.
     * This must be specified so the effect compositor can ensure the correct result is rendered when this happens.
     */
    CrossSampling: boolean;
    /**
     * Boolean indicating whether the effect preserves opaque pixels, i.e. every input pixel with an alpha of 1 is also output with an alpha of 1.
     * @description This is true for most color-altering effects, but not for most distorting effects, since in some cases a previously opaque pixel will be distorted in to a transparent area of the texture.
     * This information is not currently used, but is important for front-to-back rendering algorithms.
     */
    PreservesOpaqueness: boolean;
    /**
     * Boolean indicating whether the effect is animated, i.e. changes over time using the seconds uniform.
     * @description This is used to ensure Construct keeps redrawing the screen if an animated effect is visible.
     */
    Animated: boolean;
    /**
     * Optional. Default is **False**. Boolean indicating whether to force the pre-draw step.
     * @description Sometimes Construct tries to optimise effect rendering by directly rendering an object with the shader applied.
     * Setting this flag forces Construct to first render the object to an intermediate surface, which is necessary for some kinds of effect.
     */
    MustPredraw?: boolean;
    /**
     * Optional. Default is **False**. Boolean indicating whether 3D objects can render directly with this effect.
     * @description This defaults to false, causing all 3D objects with the effect to first perform a pre-draw step, and then processing the effect on a 2D surface.
     * If set to true, then 3D objects with the effect are allowed to render directly to the display with the effect being processed for each triangle in the geometry.
     * This is usually more efficient and can be more appropriate for processing 3D effects.
     * Note however that the effect compositor may still decide to add a pre-draw step in some circumstances, so this setting is not a guarantee that it will always use direct rendering.
     */
    Supports3DDirectRendering?: boolean;
    /**
     * Amount to extend the rendered box horizontally and vertically as [0, 0].
     * @description Normally the effect is clipped to the object's bounding box, but some effects like Warp need to be able to render a short distance outside of that for the correct result.
     * This property lets you extend the rendered box by a number of pixels.
     * @example [30, 30]
     */
    ExtendBox: [number, number];
}

// export type LostConfig<T extends AddonType> = T extends 'plugin' ? PluginConfig : T extends 'behavior' ? BehaviorConfig : never;
export type LostConfig<T extends AddonType> = 
    T extends 'plugin'
    ? PluginConfig
    : T extends 'behavior'
    ? BehaviorConfig
    : T extends 'theme'
    ? ThemeConfig
    : T extends 'effect'
    ? EffectConfig
    : T extends 'drawing-plugin'
    ? DrawingPluginConfig
    : never; 
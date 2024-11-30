/** All available types of Lost config. */
export type LostConfig<T extends AddonType> = 
    T extends 'plugin' ? PluginConfig :
    T extends 'behavior' ? BehaviorConfig : never
; 

/** Type of addon. */
export type AddonType = 
    | 'plugin'
    | 'behavior'
;

/** Base properties for any Lost config. */
type LostConfigBase = {
    /** Type of addon */
    readonly type: AddonType;
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
;

/** Object represents config for Plugin addon type. */
export interface PluginConfig extends LostConfigBase {
    /**
     * Addon type
     * @example 'plugin'
     */
    readonly type: 'plugin';
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
     * *Optional*. Default is ***False***. Pass true to set the plugin to be a single-global type.
     * @description The plugin type must be "object". Single-global plugins can only be added once to a project, and they then have a single permanent global instance available throughout the project. 
     * This is the mode that plugins like Touch and Audio use.
     */
    readonly isSingleGlobal?: boolean;
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
     * The category for the plugin when displaying it in the Create New Object Type dialog.
     * @example 'general'
     */
    readonly category: PluginCategory;
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
    readonly helpUrl: {
        EN: string;
    }
}

type BehaviorCategory =
    | 'attributes'
    | 'general'
    | 'movements'
    | 'other'
;


/** Object represents config for Behavior addon type. */
export interface BehaviorConfig extends LostConfigBase {
    /**
     * Addon type
     */
    readonly type: 'behavior';
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
     * The category for the behavior when displaying it in the Add behavior dialog.
     * @example 'general'
     */
    readonly category: BehaviorCategory;
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
    readonly helpUrl: {
        EN: string;
    }
}
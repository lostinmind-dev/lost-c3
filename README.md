![Lost by lostinmind.](https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/cover.png)

<div align="center">
  <h3>
    Lost for easy making Construct 3 Addons. <br />
    v2.0.0
  </h3>
</div>

**Lost** is a framework for easy making Construct 3 addons using
**[Deno (JavaScript runtime)](https://deno.com)** that was created by
lostinmind.

## Navigation

<!-- - __[Examples](https://github.com/lostinmindd/lost-c3-examples)__ -->

- **[💪 Advantages](#-advantages)**
- **[🚀 Quickstart](#-quickstart)**
- **[🔌 Creating ***`Plugin`*** addon](#-creating-plugin-addon)**
- **[🎛️ Creating ***`Behavior`*** addon](#️-creating-behavior-addon)**
- **[🎨 Creating ***`Theme`*** addon](#-creating-theme-addon)**
- **[✨ Creating ***`Effect`*** addon](#-creating-effect-addon)**
- **[🏗️ Building addon](#️-building-addon)**
- **[🧪 Testing addon](#-testing-addons-in-developer-mode)**

# 💪 Advantages

Here I've compiled some of the benefits from standard addon creation for
**Construct 3**.
> - ⚡️ **Using the powerful _**JavaScript Runtime**_ [Deno](https://deno.com).**
> - ❌ **Error detecting before installization of your Addon!**
> - 📝 **Only _**Typescript**_ and no _**Javascript**_ for your addon**
> - E **___Typescript___ support for addon scripts!**
> - 🚀 **Fast compilation to .c3addon format!**
> - 🧪 **Built-in addon testing using
>   [Developer Mode in Construct 3](https://www.construct.net/en/make-games/manuals/addon-sdk/guide/using-developer-mode)**.
> - 📂 **No need to configure separately _**aces.json**_ and _**en-US.json**_
>   files for addon. All necessary properties for _**aces.json**_ and
>   _**en-US.json**_ are defined together with the function implementation.**
> - 🔍 **There is no need to configure addon _.js_ scripts/files. _**Lost**_
>   automatically detects the addon scripts/files!**
> - 📜 **Structured categorization of all addon _**Actions, Conditions,
>   Expressions**_. Categories are separated files like _MyCategory.ts._**
> - 🚫 **Possibility to mark all _**Actions, Conditions, Expressions**_ in a
>   category as _Deprecated_ instead of having to configure each _**Action,
>   Condition, Expression**_ separately.**
> - ✨ **Additional tools to format the displayed text in Construct 3 itself by
>   using built-in functions - formatting the text into a specific BBCode tag.**

# 🚀 Quickstart

- **Install [Deno (JavaScript runtime)](https://docs.deno.com/runtime/)**
- **Install [Lost CLI](https://jsr.io/@lost-c3/lib) by using**
  `deno install --name lost jsr:@lost-c3/lib/cli --global -f -A`
- **Create empty folder which will be used as main folder for your addon.**

```bash
deno install --name lost jsr:@lost-c3/lib/cli --global -f -A
lost create
```
- **Create a bare-bones project for addon by using one of the following commands:**
```bash
lost create --plugin    # Creates a bare-bones project for 'plugin' addon
```

```bash
lost create --theme    # Creates a bare-bones project for 'theme' addon
```

```bash
lost create --effect    # Creates a bare-bones project for 'effect' addon
```


>[!IMPORTANT] Check and install the latest version of Lost CLI!
> deno install --name lost jsr:@lost-c3/lib@LAST_VERSION/cli --global -f -A

# 📝 Documentation

## 🔌 Creating `Plugin` addon
```bash
lost create --plugin    # Creates a bare-bones project for 'plugin' addon
```

### 🧱 File structure
```bash
├── Addon/                      # Addon folder
│   ├── Categories/             # Categories folder
│   ├── Files/                  # Addon files folder
│   ├── Scripts/                # Addon scripts folder
│   ├── Modules/                # Addon modules folder
│   ├── Types/                  # Addon scripts folder
│       ├── ts-defs/            # Construct 3 declaration files
│           ├── ...
│           └── lost.d.ts/      # Lost types declaration file
│       └── global.d.ts         # Declaration file for your purposes
│   ├── icon.svg                # Your .svg OR .png addon icon
│   ├── Instance.ts             # Addon Instance class
│   ├── Plugin.ts               # Addon Plugin class
│   └── Type.ts                 # Addon Type class
├── Builds/                     # Builds folder
│   ├── Source/                 # Final Construct 3 addon folder
│       └── ...
│   └── AddonId_Version.c3addon # Final .c3addon file
├── deno.json                   # deno.json file for Deno enviroment
├── lost.config.ts              # Addon config file
├── properties.ts               # Plugin properties file
```

### ⚙️ Config setup
Let's setup _`lost.config.ts`_ config file at first.

```typescript
import { type LostConfig, STABLE, BETA, LTS } from "jsr:@lost-c3/lib";

const Config: LostConfig<'plugin'> = {
    /**
     * Set addon type
     */
    Type: 'plugin',
    /**
     * Set a boolean of whether the addon is deprecated or not.
     */
    Deprecated?: false,

    /**
     * A boolean indicating whether the addon supports Construct's worker mode, where the entire runtime is hosted in a Web Worker instead of the main thread.
     */
    SupportsWorkerMode?: false,
    /**
     * The minimum Construct version required to load your addon, e.g. "r399".
     */
    MinConstructVersion?: STABLE.R407_2, 
    /**
     * Pass false to prevent the addon from being bundled via the Bundle addons project property.
     */
    CanBeBundled?: false,
    /**
     * Pass true to set the plugin to be a single-global type.
     */
    IsSingleGlobal?: true,

    /**
     * An object name that will applied after plugin was installed/added to project.
     */
    ObjectName: 'LostPluginName',
    AddonId: 'Lost_MyAddon',
    AddonName: 'Lost addon for Construct 3',
    AddonDescription: 'Amazing addon made with Lost.',
    Category: 'general',
    Version: '1.0.0.0',
    Author: 'lostinmind.',
    WebsiteURL: `https://addon.com`,
    DocsURL: `https://docs.addon.com`,
    
    /**
     * Setup your scripts from 'Scripts' folder.
     */    
    Scripts?: [],
    /**
     * Add a remote URL to load a script from.
     */
    RemoteScripts?: [],
    /**
     *  Setup your files from 'Files' folder.
     */
    Files?: []
}

export default Config;
```

### 📜 Specifying plugin properties
Use _`properties.ts`_ file to specify any plugin properties for your
addon. That file located in following path: `./properties.ts`.

**List of available plugin property types:**

| Type | Description |
| ----------- | ----------- |
| ```"integer"``` | **An integer number property, always rounded to a whole number.** |
| ```"float"``` | **A floating-point number property.** |
| ```"percent"``` | **A floating-point number in the range [0-1] represented as a percentage.** |
| ```"text"``` | **A field the user can enter a string in to.** |
| ```"longtext"``` | **The same as "text", but a button with an ellipsis ("...") appears on the right side of the field.** |
| ```"check"``` | **A checkbox property, returning a boolean.** |
| ```"font"``` | **A field which displays the name of a font and provides a button to open a font picker dialog.** |
| ```"combo"``` | **A dropdown list property.** |
| ```"color"``` | **A color picker property.** |
| ```"object"``` | **An object picker property allowing the user to pick an object class.** |
| ```"group"``` | **Creates a new group in the Properties Bar.** |
| ```"info"``` | **Creates a read-only string that cannot be edited.** |

*Example*

```typescript
import { Property } from 'jsr:@lost-c3/lib';

const Properties: Property[] = [
    new Property({
        Type: 'integer',
        Id: 'integerProperty',
        Name: 'Integer',
        InitialValue: 0,
    }),
    new Property({
        Type: 'float',
        Id: 'floatProperty',
        Name: 'Float',
        InitialValue: 0,
    }),
    new Property({
        Type: 'percent',
        Id: 'percentProperty',
        Name: 'Percent',
        InitialValue: 1,
    }),
    new Property({
        Type: 'text',
        Id: 'textProperty',
        Name: 'Text',
        InitialValue: '...',
    }),
    new Property({
        Type: 'longtext',
        Id: 'longtextProperty',
        Name: 'Long Text',
        InitialValue: '',
    }),
    new Property({
        Type: 'check',
        Id: 'checkProperty',
        Name: 'Check',
        InitialValue: true,
    }),
    new Property({
        Type: 'font',
        Id: 'fontProperty',
        Name: 'Font',
    }),
    new Property({
        Type: 'combo',
        Id: 'comboProperty',
        Name: 'Combo',
        Items: [
            ['item1','Item 1'],
            ['item2', 'Item 2'],
        ],
    }),
    new Property({
        Type: 'color',
        Id: 'colorProperty',
        Name: 'Color',
    }),
    new Property({
        Type: 'object',
        Id: 'objectProperty',
        Name: 'Object',
    }),
    new Property({
        Type: 'group',
        Id: 'groupProperty',
        Name: 'Awesome Group',
    }),
    new Property({
        Type: 'info',
        Id: 'infoProperty',
        Name: 'Info',
        Value: 'lostinmind.',
    }),
];

export default Properties;
```

### 📁 Creating category
To create category you should create new **`CategoryName.ts`** file in path:
`./Addon/Categories` folder. Then you can use code snippet from bare-bones
project **`!cc`** to create default Category structure or copy-paste below
script.

```typescript
import { Category, Action, Condition, Expression, Param } from "jsr:@lost-c3/lib";
import type { Instance } from "../Instance.ts";

@Category({Id: 'myCategory', Name: 'Category Name', Deprecated?: false, InDevelopment?: false})
export default class MyCategory {
    /**
     * Actions
     */

    /**
     * Conditions
     */

    /**
     * Expressions
     */
}
```

>[!INFO] *Deprecated* property in @Category decorator deprecates all category Actions, Conditions, Expressions.

>[!WARNING] *InDevelopment* property in @Category decorator removes all category Actions, Conditions, Expressions from addon.

#### ⚡️ Create action

To create actions for your addon you should use _`@Action`_ method decorator
in your category class.

Example

```typescript
import { Category, Action, Condition, Expression } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

/**
 * Setup your category settings here
 */
@Category({Id: 'categoryId', Name: 'Category Name'})
export default class MyCategory {
    @Action({
        /**
         * A string specifying a unique ID for the ACE.
         */
        Id: `doSomething`,
        /**
         * The name that appears in the action picker dialog.
         */
        Name: `Do something`,
        /**
         * The text that appears in the event sheet. 
         * You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders.
         * For easy BBCode import functions from @lost-c3/lib --> Bold, Italic, Underline, Strikethrough, Code
         */
        DisplayText: `Do something`,
        /**
         * A description of the action or condition, which appears as a tip at the top of the condition/action picker dialog.
         */
        Description?: `Awesome description...`,
        /**
         * Set to true to mark the action as asynchronous. 
         */
        IsAsync?: false,
        /*
         * Set to true to highlight.
         */
        Highlighted?: false
        /**
         * Set to true to deprecate.
         */
        Deprecated?: false,
        /**
         * Setup your parameters here.
         */
        Params?: []
    })
    doSomething() {
        console.log('Do something');
    };    
}
```

> [!WARNING]
> It's important to use {0}, {1} as parameter placeholders inside _DisplayText_
> property if you have any parameters inside your function (excluding _this_
> parameter as _Instance_ Type)

> [!TIP]
> You can use build-in [BBCode](#-fast-bbcode-features) functions for fast and
> beautiful development.

#### ❓ Create condition

To create conditions for your addon you should use _`@Condition`_ method
decorator in your category class.

Example

```typescript
import { Category, Action, Condition, Expression } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category({Id: 'categoryId', Name: 'Category Name'})
export default class MyCategory {
    @Condition({
        Id: `onEvent`,
        Name: `On event`,
        DisplayText: `On event`,
        Description?: '',
        /**
         * Specifies a trigger condition.
         */
        IsTrigger: true,
        /**
         * Allow the condition to be used in the same branch as a trigger.
         */
        IsCompatibleWithTriggers?: false,
        /**
         * Specifies a fake trigger.
         */
        IsFakeTrigger?: false,
        /**
         * Allow the condition to be inverted in the event sheet.
         */
        IsInvertible?: false,
        /**
         * Display an icon in the event sheet to indicate the condition loops.
         */
        IsLooping?: false,
        /**
         * Normally, the condition runtime method is executed once per picked instance.
         */
        IsStatic?: false,
        Deprecated?: false,
        Highlight?: false,
        Params?: []
    })
    onEvent(this: Instance) { return true };
}
```

> [!WARNING]
> It's important to use {0}, {1} as parameter placeholders inside _DisplayText_
> property if you have any parameters inside your function (excluding _this_
> parameter as _Instance_ Type)

> [!TIP]
> You can use build-in [BBCode](#-fast-bbcode-features) functions for fast and
> beautiful development.

#### 🧮 Create expression

To create expressions for your addon you should use _`@Expression`_ decorator in
your category class.

Example

```typescript
import { Category, Action, Condition, Expression } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category({Id: 'categoryId', Name: 'Category Name'})
export default class MyCategory {
    @Expression({
        Id: `getValue`,
        Name: `getValue`,
        Description?: ``,
        /**
         * One of "number", "string", "any".
         */
        ReturnType: 'string',
        /**
         * Allow the user to enter any number of parameters beyond those defined.
         */
        IsVariadicParameters?: false,
        Deprecated?: false,
        Highlight?: false,
        Params?: []
    })
    getValue(this: Instance) { return 'value' };
}
```

> [!TIP]
> You can use build-in [BBCode](#-fast-bbcode-features) functions for fast and
> beautiful development.

#### 🔧 Setting up Action/Condition/Expression parameters

To setup parameters in your Action/Condition/Expression you should use 'Params'
field when you creating on of the entity.

**List of available parameter types:**

| Type | Description |
| ----------- | ----------- |
| ```"number"``` | **A number parameter.** |
| ```"string"``` | **A string parameter.** |
| ```"any"``` | **Either a number or a string.** |
| ```"boolean"``` | **A boolean parameter, displayed as a checkbox.** |
| ```"combo"``` | **A dropdown list.** |
| ```"cmp"``` | **A dropdown list with comparison options like "equal to", "less than" etc.** |
| ```"object"``` | **An object picker.** |
| ```"objectname"``` | **A string parameter which is interpreted as an object name.** |
| ```"layer"``` | **A string parameter which is interpreted as a layer name.** |
| ```"layout"``` | **A dropdown list with every layout in the project.** |
| ```"keyb"``` | **A keyboard key picker.** |
| ```"instancevar"``` | **A dropdown list with the non-boolean instance variables the object has.** |
| ```"instancevarbool"``` | **A dropdown list with the boolean instance variables the object has.** |
| ```"eventvar"``` | **A dropdown list with non-boolean event variables in scope.** |
| ```"eventvarbool"``` | **A dropdown list with boolean event variables in scope.** |
| ```"animation"``` | **A string parameter which is interpreted as an animation name in the object.** |
| ```"objinstancevar"``` | **A dropdown list with non-boolean instance variables available in a prior "object" parameter.** |

*Example*

```typescript
import { Category, Action, Condition, Expression, Param, Bold } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category({Id: 'categoryId', Name: 'Category Name'})
export default class MyCategory {
    @Action({
        Id: `doActionWithParams`,
        Name: `Do action`,
        /**
         * Note that here we specified '{0}' for displaying user value
         */
        DisplayText: `Do action with value: ${Bold('{0}')}`,
        Params: [
            new Param({
                Type: 'string',
                Id: 'value',
                Name: 'Value',
                Description?: '',
                /**
                 * A string which is used as the initial expression for expression-based parameters. 
                 * @description This is still a string for "number" type parameters. 
                 * It can contain any valid expression for the parameter, such as "1 + 1".
                 * For "boolean" type parameters, use a string of either "true" or "false".
                 * For "combo" type parameters, this is the initial item ID.
                 */
                InitialValue?: ''
            })
        ]
    })
    doActionWithParams(this: Instance, value: string) {
        console.log('Do action with value', value);
    };
}
```

#### 💢 Deprecating _Actions_, _Conditions_, _Expressions_

> [!CAUTION]
> Do not delete any actions, conditions, expressions from your category file.
> Because it can break projects that are using your addon inside.
>
> Read more info:
> https://www.construct.net/en/make-games/manuals/addon-sdk/guide/defining-aces#internalH1Link0

How to mark any Action, Condition OR Expression as deprecated? Each Action,
Condition OR Expression has _Deprecated_ property in decorator, so you can set
it to _`true`_ to deprecate.

Example

```typescript
import { Action, Bold, Category, Condition, Expression, Param } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category({Id: 'categoryId', Name: 'Category Name'})
export default class MyCategory {
    @Action({
        Id: `doAction`,
        Name: `Do action`,
        DisplayText: `Do action`,
        /**
         * Default is False. Set to true to deprecate the ACE.
         */
        Deprecated: true,
    })
    doActionWithParams() { /* do something */ }
}
```

### 🌳 Using Instance
Use Instance class to implement your custom logic to addon. Main instance file
is available at path: `./Addon/Instance.ts`.

Example of using Instance properties and functions inside any category entity
(Action/Condition/Expression).

_Instance.ts_

```typescript
const C3 = globalThis.C3;

class LostInstance extends globalThis.ISDKInstanceBase {
    readonly value: string = 'My property value';
    /**
     * Use this property to call any condition in your addon
     */
    readonly PluginConditions = C3.Plugins[Config.AddonId].Cnds;

    constructor() {
        super();
        const properties = this._getInitProperties();

        if (properties) {
            /**
             * Here you can find your plugin properties
             */
        }
    }

    _release() {
        super
            ._release();
    }

    /**
     * Here is our instance method
     */
    _getPropertyValue() {
        return this.value;
    }
}

C3.Plugins[Config.AddonId].Instance = LostInstance;
export type { LostInstance as Instance };
```

_MyCategory.ts_

```typescript
import { Action, Category, Condition, Expression, Param } from 'jsr:@lost-c3/lib';
/**
 * Import your instance type
 */
import type { Instance } from '../Instance.ts';

@Category({Id: 'categoryId', Name: 'Category Name'},
)
export default class MyCategory {
    @Expression({
        Id: `GetValue`,
        Name: `GetValue`,
        ReturnType: 'string'
    })
    /**
     * Set the first argument of your method to: this: Instance
     */
    GetValue(this: Instance) {
        return this._getPropertyValue();
    }
}
```

### 📚 Using Scripts (Javascript / Typescript)
It's available to use custom **Javascript** OR **Typescript** in your addon.

To use any script you should copy OR create _**script.js**_ OR _**script.ts**_ file at path:
`./Addon/Scripts`. Your script will automatically will be loaded with type:
**external-dom-script**.


- To use any file you should copy your _**file.css**_ OR _**data.txt**_ file to
  path: `./Addon/Files`. If you added any **.css** file it will automatically
  loaded with type: _**external-css**_. If you added file with any other
  extension it will automatically loaded with type: _**copy-to-output**_.

> [!NOTE]
> All **Typescript** files will be compiled into .js files after addon building.

> [!NOTE]
> If you want to load your script with type **external-runtime-script**, you
> should add some settings in your _**`lost.config.ts`**_ file.

> [!NOTE]
> If you want to load your script with other dependency type, you should add your script with your dependency type in your _**`lost.config.ts`**_ file.

*Example*

```typescript
import type { LostConfig } from 'jsr:@lost-c3/lib';

const Config: LostConfig<'plugin'> = {
    Scripts: [
        {FileName: 'library.js', Type: 'external-runtime-script'},
    ],
};

export default Config;
```

> [!NOTE]
> Useful information for choosing _`Type`_ property value:
> https://www.construct.net/en/make-games/manuals/addon-sdk/reference/specifying-dependencies#internalH1Link0

### 📄 Using Files
It's available to use files in your addon.

To use any file you should copy OR create _**file.***_ file at path:
`./Addon/Files`. Your file will automatically will be loaded with auto-detected type.

> [!NOTE]
> If you want to load your file with other type, you should add your file with your type in your _**`lost.config.ts`**_ file.

*Example*

```typescript
import type { LostConfig } from 'jsr:@lost-c3/lib';

const Config: LostConfig<'plugin'> = {
    Files: [
        {FileName: 'styles.css', Type: 'copy-to-output'},
    ],
};

export default Config;
```

### 📦 Using Modules
It's available to use modules in your addon.

To use any module you should copy OR create _**mymodule.js**_ file at path:
`./Addon/Modules`.

*Example*

```typescript
import * as MyModule from './Modules/mymodule.js';

const C3 = globalThis.C3;

class LostInstance extends globalThis.ISDKInstanceBase {

	readonly PluginConditions = C3.Plugins[Config.AddonId].Cnds;
	constructor() {
		super();
		const properties = this._getInitProperties();

		console.log(MyModule.VAR);

        if (properties) {

        }

	}

	_release() {
		super._release();
	}

};

C3.Plugins[Config.AddonId].Instance = LostInstance;
export type { LostInstance as Instance };
```

>[!WARNING] Note this is only supported from r401+.

>[!INFO] 📖 For more info checkout official docs:
>
>https://www.construct.net/en/make-games/manuals/addon-sdk/guide/runtime-scripts/sdk-v2

### 🔤 Fast BBCode features
For *fast* and *beautiful* development there is a few functions that can help you
customize displaying text in your addon.

**List of available BBCode functions:**

| Function | Result |
| ----------- | ----------- |
| ```Bold('Do action')``` | **Do action** |
| ```Italic('Do action')``` | *Do action* |
| ```Strikethrough('Do action')``` | ~~Do action~~ |
| ```Underline('Do action')``` | <u>Do action</u> |
| ```Code('Do action')``` | <code>Do action</code> |

*Example*

```typescript
import { Action, Bold, Category, Code, Italic, Strikethrough, Underline } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category({Id: 'categoryId', Name: 'Category Name'})
export default class MyCategory {
    @Action({
        Id: `doAction`,
        Name: `${Bold('Action name')}`,
        DisplayText: `${Italic('Do something')} and ${Strikethrough('NOT')}`,
        Description: `${Underline('Underlined description...')} with ${Code('SOMETHING')}`,
        }
    )
    doAction(this: Instance,) { /* do something */}
}
```

## 🎛️ Creating `Behavior` addon

## 🎨 Creating `Theme` addon
```bash
lost create --theme    # Creates a bare-bones project for 'theme' addon
```

### 🧱 File structure
```bash
├── Addon/                      # Addon folder
│   └── Styles/                 # Addon styles collections folder
│       └── *.css               # Your .css file
│   └── icon.svg                # Your .svg OR .png addon icon
├── Builds/                     # Builds folder
│   ├── Source/                 # Final Construct 3 addon folder
│       └── ...
│   └── AddonId_Version.c3addon # Final .c3addon file
├── deno.json                   # deno.json file for Deno enviroment
├── lost.config.ts              # Addon config file
```


### ⚙️ Config setup
Let's setup _`lost.config.ts`_ config file at first.

```typescript
import type { LostConfig } from "jsr:@lost-c3/lib";

const Config: LostConfig<'theme'> = {
    /**
     * Set addon type
     */
    Type: 'theme',

    /**
     * An object name that will applied after plugin was installed/added to project.
     */
    ObjectName: 'LostPluginName',
    AddonId: 'Lost_MyAddon',
    AddonName: 'Lost addon for Construct 3',
    AddonDescription: 'Amazing addon made with Lost.',
    Category: 'general',
    Version: '1.0.0.0',
    Author: 'lostinmind.',
    WebsiteURL: `https://addon.com`,
    DocsURL: `https://docs.addon.com`
}

export default Config;
```

### 🛠️ Theme development
>[!TIP] For more info about developing themes you can read official docs
>
> https://www.construct.net/en/make-games/manuals/addon-sdk/guide/themes

## ✨ Creating `Effect` addon
```bash
lost create --effect    # Creates a bare-bones project for 'effect' addon
```

### 🧱 File structure
```bash
├── Addon/                      # Addon folder
│   └── Effects/                # .fx OR .wgsl files collections folder
├── Builds/                     # Builds folder
│   ├── Source/                 # Final Construct 3 addon folder
│       └── ...
│   └── AddonId_Version.c3addon # Final .c3addon file
├── deno.json                   # deno.json file for Deno enviroment
├── lost.config.ts              # Addon config file
├── parameters.ts               # Effect parameters file
```

### ⚙️ Config setup
Let's setup _`lost.config.ts`_ config file at first.

```typescript
import type { LostConfig } from "jsr:@lost-c3/lib";

const Config: LostConfig<'effect'> = {
    /**
     * Set addon type
     */
    Type: 'effect',

    AddonId: 'Lost_MyAddon',
    AddonName: 'Lost addon for Construct 3',
    AddonDescription: 'Amazing addon made with Lost.',
    Category: 'general',
    Version: '1.0.0.0',
    Author: 'lostinmind.',
    WebsiteURL: `https://addon.com`,
    DocsURL: `https://docs.addon.com`,

    /**
     * An array of strings indicating the supported renderers for this effect.
     */
    SupportedRenderers: ['webgl', 'webgl2', 'webgpu'],

    /**
     * Boolean indicating whether the effect blends with the background.
     */
    BlendsBackground: false,

    /**
     * Boolean indicating whether the effect samples the depth buffer with the samplerDepth uniform.
     */
    UsesDepth: false,
    /**
     * Boolean indicating whether a background-blending effect has inconsistent sampling of the background and foreground.
     */
    CrossSampling: false,

    /**
     * Boolean indicating whether the effect preserves opaque pixels, i.e. every input pixel with an alpha of 1 is also output with an alpha of 1.
     */
    PreservesOpaqueness: true,

    /**
     * Boolean indicating whether the effect is animated, i.e. changes over time using the seconds uniform.
     */
    Animated: false,

    /**
     * Optional. Default is False. Boolean indicating whether to force the pre-draw step.
     */
    MustPredraw?: false,

    /**
     * Optional. Default is False. Boolean indicating whether 3D objects can render directly with this effect.
     */
    Supports3DDirectRendering?: false,

    /**
     * Amount to extend the rendered box horizontally and vertically as [0, 0].
     */
    ExtendBox: [0, 0]
}

export default Config;
```

### 📜 Specifying effect parameters
Use _`parameters.ts`_ file to specify any effect parameters. That file located in following path: `./parameters.ts`.

**List of available effect parameters types:**

| Type | Description |
| ----------- | ----------- |
| ```"color"``` | **A color parameter.** |
| ```"float"``` | **A float parameter.** |
| ```"percent"``` | **A percent parameter.** |

*Example*

```typescript
import { EffectParameter } from "jsr:@lost-c3/lib@1.2.5";

const EffectParameters: EffectParameter<any>[] = [
    new EffectParameter<any>({
        Type: 'color',
        Id: 'myColor',
        InitialValue: [0, 0, 0]
    }),
    new EffectParameter<any>({
        Type: 'float',
        Id: 'myFloat',
        InitialValue: 1
    }),
    new EffectParameter<any>({
        Type: 'percent',
        Id: 'myPercent',
        InitialValue: 0.5
    })
]

export default EffectParameters;
```

### 🔮 Effect development
>[!TIP] For more info about developing WebGL shaders you can read official docs
>
> https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-effects/webgl-shaders

>[!TIP] For more info about developing WebGPU shaders you can read official docs
>
> https://www.construct.net/en/make-games/manuals/addon-sdk/guide/configuring-effects/webgpu-shaders


## 🏗️ Building addon

To build addon into **`.c3addon`** file you can use one of the following
commands:

- `lost build`

**`addon.c3addon`** file will be available at path: `./Builds/my_addon_1.0.0.0.c3addon`

## 🧪 Testing addons in Developer Mode

To test your addon you can use one of the following commands:

- `lost serve`

> [!IMPORTANT]
> Read more info about Developer Mode in Construct 3:
>
> https://www.construct.net/en/make-games/manuals/addon-sdk/guide/using-developer-mode


# 🪪 License

MIT

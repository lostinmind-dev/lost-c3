![Lost by lostinmind.](https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/cover.png)

<div align="center">
  <h3>
    Lost for easy making Construct 3 Addons. <br />
    v5.0.0
  </h3>
</div>

**Lost** is a framework for easy making Construct 3 addons (Plugins & Behaviors) using
**[Deno (JavaScript runtime)](https://deno.com)** that was created by
lostinmind.

## Navigation

<!-- - __[Examples](https://github.com/lostinmindd/lost-c3-examples)__ -->

- **[💪 Advantages](#-advantages)**
- **[🚀 Quickstart](#-quickstart)**
- **[🔌 Creating ***`Plugin`*** addon](#-creating-plugin-addon)**
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
lost create --plugin    # Creates a bare-bones project for 'Plugin' addon
```

```bash
lost create --drawing-plugin    # Creates a bare-bones project for 'Drawing Plugin' addon
```

```bash
lost create --behavior    # Creates a bare-bones project for 'Behavior' addon
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
├── addon/ 
│   ├── categories/             # Categories folder
│   ├── runtime/                # Addon runtime classes folder
│       ├── instance.ts
│       ├── plugin.ts
│       └── type.ts
│   ├── editor/                 # Addon editor classes folder
│       ├── Instance.ts
│       └── Type.ts
│   ├── modules/                # Addon modules folder
│   ├── scripts/                # Addon scripts folder
│   └── files/                  # Addon files folder
├── builds/
│   ├── source/                 # Final Construct 3 addon folder
│       └── ...
│   └── AddonId_Version.c3addon # Final .c3addon file
├── types/
│   ├── construct.d.ts
│   └── properties.d.ts
├── icon.svg                    # Your '.svg' OR '.png' addon icon
├── deno.json                   # deno.json file for Deno enviroment
├── addon.ts                    # Main addon file
├── lost.config.ts              # Lost config file
```

### ⚙️ Config setup
Let's setup _`lost.config.ts`_ config file at first.

```typescript
import { defineConfig } from "jsr:@lost-c3/lib";

export default defineConfig({
    /**
     * Set addon type
     */
    type: 'plugin',
    /**
     * Set plugin type
     */
    pluginType: 'object' | 'world',
    /**
     * Set a boolean of whether the addon is deprecated or not.
     */
    deprecated?: false,

    /**
     * A boolean indicating whether the addon supports Construct's worker mode, where the entire runtime is hosted in a Web Worker instead of the main thread.
     */
    supportsWorkerMode?: false,
    /**
     * The minimum Construct version required to load your addon, e.g. "r399".
     */
    minConstructVersion?: 'r416', 
    /**
     * Pass false to prevent the addon from being bundled via the Bundle addons project property.
     */
    canBeBundled?: false,
    /**
     * Pass true to set the plugin to be a single-global type.
     */
    isSingleGlobal?: true,

    /**
     * An object name that will applied after plugin was installed/added to project.
     */
    objectName: 'LostPluginName',

    addonId: 'Lost_MyAddon',
    addonName: 'Lost addon for Construct 3',
    addonDescription: 'Amazing addon made with Lost.',
    category: 'general',
    version: '1.0.0.0',
    author: 'lostinmind.',
    websiteUrl: `https://addon.com`,
    docsUrl: `https://docs.addon.com`,
    helpUrl: 'https://myaddon.com/help/en'
})
```

### ⚙️ Addon setup
Let's setup _`addon.ts`_ file at second.

```typescript
import { Plugin, Property, defineAddon } from 'jsr:@lost-c3/lib';
import config from "./lost.config.ts";

export default defineAddon(
    new Plugin<'object' | 'world'>(config)
        .loadEditorScripts('modules')
        .loadEditorScripts('scripts', [
            { path: 'editorScript.ts' }
        ])
        .setRuntimeScripts(
            { type: 'directory', path: 'runtimeScriptsFolder' }
            { type: 'file', path: 'myRuntimeScript.ts' }
        )

        .setRemoteScripts(
            { url: 'https://myserve.net/index.js', type: 'module' }
        )

        /** @Properties  */
        .addProperty('integer', 'Integer', { type: Property.Integer })
        .addProperty('float', 'Float', { type: Property.Float })
        .addProperty('percent', 'Percent', { type: Property.Percent })
        .addProperty('text', 'Text', { type: Property.Text })
        .addProperty('longText', 'Long Text', { type: Property.LongText })
        .addProperty('check', 'Check', { type: Property.Checkbox })
        .addProperty('font', 'Font', { type: Property.Font })
        .addProperty('combo', 'Combo', {
            type: Property.Combo,
            items: [['item1', 'item2']]
        })
        .addProperty('color', 'Color', { 
            type: Property.Color,
            initialValue: [255, 210, 155]
        })
        .createGroup('group', 'Awesome Group')
            .addProperty('info', 'Info', {
                type: Property.Info,
                callback: (inst) => {
                    return '';
                }
            })
            .addProperty('link', 'Link', {
                type: Property.Link,
                linkText: 'Do ...',
                callbackType: 'for-each-instance',
                callback: (inst) => {
                    console.log('Link property for each instance');
                }
            })
            .addProperty('link2', 'Link', {
                type: Property.Link,
                linkText: 'Do ...',
                callbackType: 'once-for-type',
                callback: (type) => {
                    console.log('Link property once for type');
                }
            })
)
```

### 📁 Creating category
To create category you should create new **`CategoryName.ts`** file in path:
`./Addon/Categories` folder. Then you can use code snippet from bare-bones
project **`!cc`** to create default Category structure or copy-paste below
script.

```typescript
import { Category, Action, Condition, Expression, addParam } from "jsr:@lost-c3/lib";
import type { Instance } from "../Instance.ts";

@Category('myCategory', 'Category Name', { isDeprecated: false, inDevelopment: false })
export default class {
    /** @Actions */

    /** @Conditions */

    /** @Expressions */
}
```

>[!INFO] *isDeprecated* property in options for category in @Category decorator deprecates all category Actions, Conditions, Expressions.

>[!WARNING] *inDevelopment* property in options for category in @Category decorator removes all category Actions, Conditions, Expressions from addon.

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
@Category('categoryId', 'Category Name')
export default class MyCategory {
    @Action(
        /**
         * A string specifying a unique ID for the ACE.
         */
        `doSomething`,
        /**
         * The name that appears in the action picker dialog.
         */
        `Do something`,
        /**
         * The text that appears in the event sheet. 
         * You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders.
         * For easy BBCode import functions from @lost-c3/lib --> Bold, Italic, Underline, Strikethrough, Code
         */
        `Do something`,
        /**
         * A description of the action or condition, which appears as a tip at the top of the condition/action picker dialog.
         */
        `Awesome description...`,
        {
            /**
             * Set to true to mark the action as asynchronous. 
             */
            isAsync: false,
            /**
             * Set to true to deprecate.
             */
            isDeprecated: false,
            /*
             * Set to true to highlight.
             */
            highlight: true,
            /**
             * Setup your parameters here.
             */
            params: []
        }
    )
    doSomething() {
        console.log('Do something');
    };    
}
```

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

@Category('categoryId', 'Category Name')
export default class {
    @Condition(
        `onEvent`,
        `On event`,
        `On event`,
        'Trigger when something done...',
        {
            /**
             * Specifies a trigger condition.
             */
            isTrigger: true,
            /**
             * Allow the condition to be used in the same branch as a trigger.
             */
            isCompatibleWithTriggers: false,
            /**
             * Specifies a fake trigger.
             */
            isFakeTrigger: false,
            /**
             * Allow the condition to be inverted in the event sheet.
             */
            isInvertible: false,
            /**
             * Display an icon in the event sheet to indicate the condition loops.
             */
            isLooping: false,
            /**
             * Normally, the condition runtime method is executed once per picked instance.
             */
            isStatic: false,
            isDeprecated: false,
            highlight: false,
            params: []
        }
    )
    onEvent(this: Instance) { return true };
}
```

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

@Category('categoryId', 'Category Name')
export default class {
    @Expression(
        `getValue`,
        `GetValue`,
        `Returns some value`,
        {
            /**
             *  "number" OR "string" OR "any".
             */
            returnType: 'string',
            /**
             * Allow the user to enter any number of parameters beyond those defined.
             */
            isVariadicParameters: false,
            isDeprecated: false,
            highlight: false,
            params: []
        }
    )
    getValue(this: Instance) { return 'value' };
}
```

> [!TIP]
> You can use build-in [BBCode](#-fast-bbcode-features) functions for fast and
> beautiful development.

#### 🔧 Setting up Action/Condition/Expression parameters

To setup parameters in your Action/Condition/Expression you should use 'params'
field when you creating on of the entity. Also you should use `addParam()` method AND `Param` enum that you can import from library.

**List of available parameter types:**

| Type | Description |
| ----------- | ----------- |
| ```"Number"``` | **A number parameter.** |
| ```"String"``` | **A string parameter.** |
| ```"Any"``` | **Either a number or a string.** |
| ```"Boolean"``` | **A boolean parameter, displayed as a checkbox.** |
| ```"Combo"``` | **A dropdown list.** |
| ```"Cmp"``` | **A dropdown list with comparison options like "equal to", "less than" etc.** |
| ```"Object"``` | **An object picker.** |
| ```"ObjectName"``` | **A string parameter which is interpreted as an object name.** |
| ```"Layer"``` | **A string parameter which is interpreted as a layer name.** |
| ```"Layout"``` | **A dropdown list with every layout in the project.** |
| ```"Keyb"``` | **A keyboard key picker.** |
| ```"InstanceVar"``` | **A dropdown list with the non-boolean instance variables the object has.** |
| ```"InstanceVarBool"``` | **A dropdown list with the boolean instance variables the object has.** |
| ```"EventVar"``` | **A dropdown list with non-boolean event variables in scope.** |
| ```"EventVarBool"``` | **A dropdown list with boolean event variables in scope.** |
| ```"Animation"``` | **A string parameter which is interpreted as an animation name in the object.** |
| ```"ObjInstanceVar"``` | **A dropdown list with non-boolean instance variables available in a prior "object" parameter.** |

*Example*

```typescript
import { Category, Action, Condition, Expression, addParam, Param } from 'jsr:@lost-c3/lib';
import { bold } from 'jsr:@lost-c3/lib/misc';
import type { Instance } from '../Instance.ts';

@Category('categoryId', 'Category Name')
export default class {
    @Action({
        `doActionWithParams`,
        `Do action`,
        `Do action with value: ${Bold('{0}')}`,
        {
            params: [
                addParam('value', 'Value', { type: Param.String, initialValue?: '' })
            ]
        }
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
Condition OR Expression has _isDeprecated_ property in decorator options property, so you can set
it to _`true`_ to deprecate.

Example

```typescript
import { Action, Category, Condition, Expression } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category('categoryId', 'Category Name')
export default class {
    @Action(`doAction`, `Do action`, `Do action`, {
        /**
         * Default is False. Set to true to deprecate the ACE.
         */
        isDeprecated: true
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
class LostInstance extends globalThis.ISDKInstanceBase {
    readonly value: string = 'My property value';
    /**
     * Use this property to call any condition in your addon
     */
    readonly Conditions = C3.Plugins[Lost.addonId].Cnds;

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

export type { LostInstance as Instance };
```

_MyCategory.ts_

```typescript
import { Action, Category, Condition, Expression } from 'jsr:@lost-c3/lib';
/**
 * Import your instance type
 */
import type { Instance } from '../Instance.ts';

@Category('categoryId', 'Category Name')
export default class {
    @Expression(`getValue`, `GetValue`)
    /**
     * Set the first argument of your method to: this: Instance
     */
    GetValue(this: Instance) {
        return this._getPropertyValue();
    }
}
```

### 📚 Using Scripts (Javascript / Typescript)
It's available to use custom **Javascript** OR **Typescript** script in your addon.

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
> should configure it with `setRuntimeScripts()` method in your Addon object in _**`addon.ts`**_ file.

*Example*

```typescript
import { Plugin, Property } from 'jsr:@lost-c3/lib';
import config from "./lost.config.ts";

export default defineAddon(
    new Plugin<'object'>(config)
        .setRuntimeScripts('myscript1.ts', 'main/myscript.ts')
)
```

### 📄 Using Files
It's available to use files in your addon.

To use any file you should copy OR create _**file.***_ file at path:
`./Addon/Files`. Your file will automatically will be loaded with auto-detected type.

> [!NOTE]
> If you want to include your file in project build, you should call `addFilesToOutput(path)` in your Addon object in _**`addon.ts`**_ file.

*Example*

```typescript
import { Plugin, Property } from 'jsr:@lost-c3/lib';
import type { EditorInstance } from "@Editor/Instance.ts";
import type { EditorType } from "@Editor/Type.ts";
import config from "./lost.config.ts";

export default defineAddon(
    new Plugin<EditorInstance, EditorType>(config)
        .addFilesToOutput('myfile.wasm')
)
```

### 📦 Using Modules
It's available to use custom **Javascript** OR **Typescript** module in your addon.

To use any module you should copy OR create _**mymodule.js**_ file at path:
`./Addon/Modules`.

*Example*

```typescript
import * as MyModule from './Modules/mymodule.ts';

class LostInstance extends globalThis.ISDKInstanceBase {

	readonly PluginConditions = C3.Plugins[Lost.addonId].Cnds;
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

export type { LostInstance as Instance };
```

> [!NOTE]
> All **Typescript** files will be compiled into .js files after addon building.

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
| ```bold('Do action')``` | **Do action** |
| ```italic('Do action')``` | *Do action* |
| ```strikethrough('Do action')``` | ~~Do action~~ |
| ```underline('Do action')``` | <u>Do action</u> |
| ```code('Do action')``` | <code>Do action</code> |

*Example*

```typescript
import { bold, code, italic, strikethrough, underline } from 'jsr:@lost-c3/lib/misc';
import { Action, Category } from 'jsr:@lost-c3/lib';
import type { Instance } from '../Instance.ts';

@Category('categoryId', 'Category Name')
export default class {
    @Action(
        `doAction`,
        `${bold('Action name')}`,
        `${italic('Do something')} and ${strikethrough('NOT')}`,
        `${underline('Underlined description...')} with ${code('SOMETHING')}`
    )
    doAction(this: Instance) { /* do something */}
}
```

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

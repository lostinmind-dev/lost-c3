![Lost by lostinmind.](https://raw.githubusercontent.com/lostinmind-dev/lost-c3/refs/heads/master/cover.png)
<div align="center">
  <h3>
    Framework for easy making Construct 3 Addons. <br />
  </h3>
</div>

__Lost__ is a library for easy making Construct 3 addons using __[Deno (JavaScript runtime)](https://deno.com)__ that was created by lostinmind.

## Key features:
<!-- - __[Examples](https://github.com/lostinmindd/lost-c3-examples)__ -->
- __[Advantages](#-advantages)__
- __[Quickstart](#-quickstart)__
- __[Specifying plugin properties](#️-specifying-plugin-properties)__
- __[Creating category](#-creating-category)__
- __[Building addon](#-building-addon)__
- __[Testing addon](#-testing-addons)__


# 🚀 Quickstart

- Install __[Deno (JavaScript runtime)](https://docs.deno.com/runtime/)__
- Install [__Lost CLI__](https://jsr.io/@lost-c3/cli) by using `deno install --name lost jsr:@lost-c3/cli --global -f -A`


<!-- Create a bare-bones Lost Addon for __plugin__ by using `lost-c3 init --plugin` -->

<!-- ```bash
npm i lost-c3-cli -g
lost-c3 init --plugin # For plugin 
npm run build
``` -->

# 📝 Documentation

After using `lost-c3 init --plugin` we get default file structure for creating addon.

## 🧱 Addon file structure

``` bash
├── Addon/                      # Addon folder
│   ├── Categories/             # Categories folder
│   ├── Files/                  # Addon files folder
│   ├── Scripts/                # Addon scripts folder
│   ├── Types/                  # Addon scripts folder
│       ├── ts-defs/            # Construct 3 declaration files
│       └── global.d.ts         # Declaration file for your purposes
│   ├── Instance.ts             # Addon Instance class
│   ├── ico.svg                 # Your .svg OR .png addon icon
│   └── PluginProperties.ts     # Plugin properties file
├── Builds/                     # Builds folder
│   ├── Source/                 # Final Construct 3 addon folder
│       └── ...
│   └── AddonId_Version.c3addon # Final .c3addon file
├── deno.json                   # 'deno.json' file
├── lost.config.ts              # Addon config file
```

## ⚙️ Config setup

Let's setup _`lost.config.ts`_ config file at first.

```typescript
import type { LostConfig } from "jsr:@lost-c3/lib@0.1.4";

export const Config: LostConfig<'plugin'> = {
    Type: 'plugin',
    SupportsWorkerMode: false,
    CanBeBundled: false,
    IsSingleGlobal: true,
    ObjectName: 'LostPluginName',

    AddonId: 'Lost_AddonId',
    AddonName: '{Addon Name} for Construct 3',
    AddonDescription: 'Amazing addon made with Lost.',
    Category: 'general',
    Version: '1.0.0.0',
    Author: 'lostinmind.',
    WebsiteURL: `https://addon.com`,
    DocsURL: `https://docs.addon.com`
}
```
Check more info about using scripts OR libraries in your addon:
_[Using custom libraries/scripts/files](#-using-custom-libraries/scripts/files)_

## 📚 Using custom libraries/scripts/files

It's available to use custom scripts or libraries in your addon.

- Add any library file (_`library.js`)_ into _`src/addon/libs/`_ folder.

- Add any file (_`data.txt`)_ into _`src/addon/files`_ folder.

> [!IMPORTANT]
> You should update _`lost.config.ts`_ _Scripts_ OR _Files_ property and add any script/file you have uploaded.

Example of adding custom script

```typescript
import { Lost } from "lost-c3-lib";

const Config: Lost.Config = {

    /**
     * Here we added some objects 
     */
    Scripts: [
        {FileName: 'library.js', Type: 'external-dom-script', ScriptType: 'module'},
    ],

    MinConstructVersion: "",
    IsSingleGlobal: true,
    IsDeprecated: false,
    CanBeBundled: true,
    ObjectName: "MyLostAddon",
    AddonId: "addon_id",
    Type: "plugin",
    AddonCategory: "general",
    AddonName: "My First Lost Addon",
    AddonDescription: "My first lost addon is awesome!",
    Version: "1.0.0.0",
    Author: "Lost",
    WebsiteURL: "https://addon.com",
    DocsURL: "https://docs.addon.com",
    Icon: {
        FileName: 'icon.svg',
        Type: 'image/svg+xml'
    }
}

export { Config };
```

In that case we added new object in _`Scripts`_ property. That object has some own properties:

```typescript
- FileName: string // Use only path to lib without ./lib/. Example: "lib.js"
- Type: "external-runtime-script" | "external-dom-script"
```

> [!NOTE]
> Useful information for choosing _`Type`_ property value:
> https://www.construct.net/en/make-games/manuals/addon-sdk/reference/specifying-dependencies#internalH1Link0

> [!TIP]
> It's recommended to use _`.d.ts`_ files to easy code writing.
> You can also move them into _`src/libs/`_ folder.

> [!WARNING]
> If you passed adding script into _`lost.config.ts`_ file. Addon won't be loaded successfully!

> [!WARNING]
> Use only .js libraries with .d.ts declaration files only.

## ⚙️ Specifying plugin properties

Use _`plugin.properties.ts`_ file to specify any plugin properties for your addon.

Example

```typescript
import { CheckProperty, ColorProperty, ComboProperty, FloatProperty, FontProperty, GroupProperty, IntegerProperty, LongTextProperty, ObjectProperty, PercentProperty, TextProperty } from "lost-lib";

const PluginProperties: Lost.PluginProperty[] = [
    new IntegerProperty({
        Id: "int",
        Name: "Integer Property",
        Description: "Description...",
        InitialValue: 0,
    }),
    new FloatProperty({
        Id: "float",
        Name: "Float Property",
        InitialValue: 0,
    }),
    new PercentProperty({
        Id: "percent",
        Name: "Percent Property",
        InitialValue: 1,
    }),
    new TextProperty({
        Id: "text",
        Name: "Text Property",
        InitialValue: "",
    }),
    new LongTextProperty({
        Id: "long_text",
        Name: "Long Text Property",
        InitialValue: "",
    }),
    new CheckProperty({
        Id: "check",
        Name: "Check Property",
        InitialValue: false,
    }),
    new FontProperty({
        Id: "font",
        Name: "Font Property",
        InitialValue: "Arial",
    }),
    new ComboProperty({
        Id: "combo",
        Name: "Combo Property",
        InitialValue: "item_one",
        Items: [
            {Id: "item_one", Name: "Item 1"},
            {Id: "item_two", Name: "Item 2"}
        ]
    }),
    new ColorProperty({
        Id: "color",
        Name: "Color Property",
        InitialValue: [1, 0, 0]
    }),
    new ObjectProperty({
        Id: "object",
        Name: "Object Property"
    }),
    new GroupProperty({
        Id: "group",
        Name: "Group Property",
    }),
]

export { PluginProperties };
```

## 📁 Creating category

To create category you should create new  __`CategoryName.ts`__ file in _`src/addon/categories`_ folder.
Then you can use code snippet __`!CC`__ to create default Category structure or copy-paste below script.

```typescript
import { Lost, Action, Condition, Expression } from "lost-c3-lib"; 
import type { Instance } from "@Instance";

class MyCategory extends Lost.Category {
    
    /**
     * @super(categoryId: string, categoryName: string)
     */
    constructor() { super('main', 'My Category') };

}

const Category = new MyCategory();
export { Category };
```

> [!CAUTION]
> DO NOT CHANGE __`Category`__ VARIABLE NAME!'

### ⚡️ Create action

To create actions for your addon you should use _`@Action`_ decorator of function in your category class.

Example

```typescript
import { Lost, Action, StringParam } from "lost-c3-lib"; 
import type { Instance } from "@Instance";

class MyCategory extends Lost.Category {
    
    constructor() { super('myCategoryId', 'My Category') };

    @Action({
        /**
         * A string specifying a unique ID
         */
        Id: 'myAction',
        /**
         * The name that appears in the action picker dialog
         */
        Name: 'Do something', 
        /**
         * The text that appears in the event sheet. 
         * You can use simple BBCode tags like [b] and [i], and use {0}, {1} etc. as parameter placeholders. 
         * (There must be one parameter placeholder per parameter.) 
         */
        DisplayText: 'Do something',
        /**
         * @optional A description of the action or condition, which appears as a tip at the top of the condition/action picker dialog.
         */
        Description: 'Awesome action...',
        /**
         * @optional Set to true to mark the action as asynchronous. 
         * Make the action method an async function, and the system Wait for previous actions to complete action will be able to wait for the action as well.
         */
        IsAsync: false,
        /**
         * @optional Set to true to deprecate
         */
        Deprecated: false,
        /**
         * Use Params property if you need to assign action parameters
         */
        Params: [
            new StringParam({
                /**
                * A string specifying a unique ID
                */
                Id: 'message',
                /**
                 * The name of the parameter
                 */
                Name: 'Message',
                /**
                 * @optional The parameter description
                 */
                Description: 'Enter your message...',
                /**
                 * A string which is used as the initial expression
                 */
                InitialValue: '"Some message"'
            })
        ]
    })
    myAction(message: string) {
        console.log('Log message', message);
    }

}

const Category = new MyCategory();
export { Category };
```

> [!WARNING]
> It's important to use {0}, {1} as parameter placeholders inside _DisplayText_ property if you have any parameters inside your function (excluding _this_ parameter as _Instance_ Type)

### ❓ Create condition

To create conditions for your addon you should use _`@Condition`_ decorator of function in your category class.

Example

```typescript
import { Lost, Condition, ComboParam } from "lost-c3-lib"; 
import type { Instance } from "@Instance";

class MyCategory extends Lost.Category {
    
    constructor() { super('myCategoryId', 'My Category') };

    @Condition({
        Id: 'myCondition',
        Name: 'On event',
        DisplayText: 'On event [i]{0}[/i]',
        /**
         * Set to true to highlight the ACE in the condition/action/expression picker dialogs.
         */
        Highlight: true,
        /**
         * Specifies a trigger condition. 
         * This appears with an arrow in the event sheet. 
         * Instead of being evaluated every tick, triggers only run when they are explicity triggered by a runtime call.
         */
        IsTrigger: true,
        IsCompatibleWithTriggers: false,
        IsFakeTrigger: false,
        IsInvertible: false,
        IsLooping: false,
        IsStatic: false,
        Params: [
            new ComboParam({
                Id: 'event',
                Name: 'Event',
                Items: [
                    {Id: 'open', Name: 'Open'},
                    {Id: 'close', Name: 'Close'}
                ],
                /**
                 * Use any item id to use as iniial value
                 * If passed, library will automatically set initial value to the first item
                 */
                InitialValue: 'open'
            })
        ]
    })
    onEvent(eventIndex: number) {
        /**
         * When it's a ComboParam, in function you get item index
         */
        switch(eventIndex) {
            case 0:
                // 'open' event
                break;
            case 1:
                // 'close' event
                break;
        }
    }

}

const Category = new MyCategory();
export { Category };
```

> [!WARNING]
> It's important to use {0}, {1} as parameter placeholders inside _DisplayText_ property if you have any parameters inside your function (excluding _this_ parameter as _Instance_ Type)

### 🧮 Create expression

To create expressions for your addon you should use _`@Expression`_ decorator of function in your category class.

Example

```typescript
import { Lost, Expression, StringParam } from "lost-c3-lib"; 
import type { Instance } from "@Instance";

class MyCategory extends Lost.Category {
    
    constructor() { super('myCategoryId', 'My Category') };

    @Expression({
        Id: 'getValue',
        /**
         * Name will not be used, but required
         */
        Name: 'GetValue',
        DisplayText: 'GetValue',
        ReturnType: 'string',
        /**
         * If true, Construct 3 will allow the user to enter any number of parameters beyond those defined. 
         * In other words the parameters (if any) listed in "params" are required, but this flag enables adding further "any" type parameters beyond the end.
         */
        IsVariadicParameters: false
    })
    getValue() {
        return 'somevalue';
    }

}

const Category = new MyCategory();
export { Category };
```

> [!TIP]
> It's recommended to name _DisplayText_ property without spaces
> Because if you name _DisplayText_ with spaces it will not correctly display expression after user close expressions window.

> [!CAUTION]
> Lost library isn't checking parameters that you use in Expressions at that moment. But you must use only __StringParam()__ OR __NumberParam()__ OR __AnyParam()__

### 💢 Deprecating _Actions_, _Conditions_, _Expressions_

> [!CAUTION]
> Do not delete any actions, conditions, expressions from your category file.
> Because it can break projects that are using your addon inside.
>
> Read more info: https://www.construct.net/en/make-games/manuals/addon-sdk/guide/defining-aces#internalH1Link0

How to mark any Action, Condition OR Expression as deprecated?
Each Action, Condition OR Expression has _Deprecated_ property in decorator, so you can set it to _`true`_ to deprecate.
```typescript
Deprecated: boolean;
```

## 🌳 Using Instance

Also you have an ability to use Instance class to implement your custom logic to addon.
Main instance class is available at path _`src/addon/Instance.ts`_.

> [!NOTE]
> Example of using instance inside function
>
>_Instance.ts_
> ```typescript
>import { Config } from "@Config";
>
>const C3 = globalThis.C3;
>
>class LostInstance extends globalThis.ISDKInstanceBase {
>	myVar: string = 'someValue';
>	readonly PluginConditions = C3.Plugins[Config.AddonId].Cnds;
>	constructor() {
>		super();
>
>		const properties = this._getInitProperties();
>		if (properties) {
>
>		}
>
>	}
>	
>	_release() {
>		super._release();
>	}
>	
>};
>
>C3.Plugins[Config.AddonId].Instance = LostInstance;
>export type { LostInstance as Instance };
> ```
>
>_Category.ts_
> ```typescript
>import { Lost, Action } from "lost-c3-lib"; 
>import type { Instance } from "@Instance";
>
>class MyCategory extends Lost.Category {
>    
>    constructor() { super('myCategoryId', 'My Category') };
>
>    @Action({
>        Id: 'getValue',
>        Name: 'GetValue',
>        DisplayText: 'GetValue',
>    })
>    getValue(this: Instance) {
>        console.log(this.myVar);
>    }
>
>}
>
>const Category = new MyCategory();
>export { Category };
> ```

## Building addon

To build addon into `addon.c3addon` file you should use `npm run build`

`.c3addon` file will be available in your main folder when you are developing your addon.

## Testing addons in developer mode

To run test server you should use `npm run server` __OR__ `npm run dev`

- `npm run server` comman will run server once
- `npm run dev` will detect all addon changes and reload addon with recompiling

> [!IMPORTANT]
> Read more info about developer mode in Construct 3:
>
> https://www.construct.net/en/make-games/manuals/addon-sdk/guide/using-developer-mode

> [!TIP]
> If you want to open Construct 3 page after server run you should use `npm run server --open`

# 🪪 License

MIT
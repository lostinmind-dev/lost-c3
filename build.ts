import * as path from "jsr:@std/path@1.0.6";
import { type Lost, zip, Project, walk, bold, yellow, green, magenta, join, Logger, ErrorMessage, WarningMessage } from "./deps.ts";

let __dirname: string //= path.dirname(path.fromFileUrl(import.meta.url));

if (import.meta.url.startsWith('file:')) {
    __dirname = path.fromFileUrl(import.meta.url);
  } else {
    // Обработка https: URL
    __dirname = new URL(import.meta.url).pathname;
  }

const buildPath = `${Deno.cwd()}/Builds/Source`;
const addonsCollectionPath = `${Deno.cwd()}/Builds`;

const logger = new Logger();

type LostAddonFolder = 'Types' | 'Scripts' | 'Files' | 'Categories';

let iconName: string = '';
let iconType: 'image/svg+xml' | 'image/png';

interface BuildResult {
    Config: Lost.LostConfig<'plugin' | 'behavior'>;
    PluginProperties: Lost.PluginProperty[];
    Categories: Lost.LostCategoryBase[];
}

export async function build(options: {serve: boolean}): Promise<BuildResult | false> {

    const configModule = await import(`file://${Deno.cwd()}/lost.config.ts`);
    const Config = configModule.Config as Lost.LostConfig<'plugin' | 'behavior'>;

    const ppsModule = await import(`file://${Deno.cwd()}/Addon/PluginProperties.ts`);
    const PluginProperties = ppsModule.PluginProperties as Lost.PluginProperty[];

    const scripts: string[] = [];
    const files: string[] = [];
    let categories: Lost.LostCategoryBase[] = [];

    logger.Clear();
    logger.Process('Building addon');
    logger.LogBetweenLines(bold(yellow('📛 Addon Id:')), bold(Config.AddonId), '', bold(green('👽Addon Name:')), bold(Config.AddonName));
    try {
        await Deno.remove(buildPath, { recursive: true });
    } catch (e) {
        //return;
    }

    for await (const entry of Deno.readDir(`${Deno.cwd()}/Addon`)) {
        if (entry.isDirectory) {
            switch (entry.name as LostAddonFolder) {
                case 'Categories':
                    logger.Searching('Searching for categories');
                    await getCategories(`${Deno.cwd()}/Addon/${entry.name}`).then((cats) => {
                        categories = cats?.filter(c => !c.InDevelopment) || [];
                    })
                    await createAddonStructure(Config.Type);
                    break;
                default:
                    break;
            }
        }
    }
    logger.Searching('Searching issues in categories')
    await checkCategories(categories).then(() => logger.Success('Issues not founded'));

    await addAddonEntities();

    await createAddonJSON();
    await createAcesJSON();
    await createLanguageJSON();

    if (!options.serve) {
        await zipAddon();
        logger.Success(bold(`Addon [${yellow(Config.AddonId)}] has been ${green('successfully')} built`));
    } else {
        logger.Success(bold(`Addon [${yellow(Config.AddonId)}] has been ${green('successfully')} built`));
        await serveAddon(65432);
    }

    async function getCategories(path: string | URL) {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await getCategories(`${path}/${entry.name}`);
            }
            if (entry.isFile && entry.name.endsWith('.ts')) {
                try {
                    const module = await import(`file://${path}/${entry.name}`);
                    if (module.LostCategory) {
                        categories.push(module.LostCategory as Lost.LostCategoryBase);
                        logger.Success(`${green('Successfully')} imported category: ${magenta(entry.name)}`);
    
                    } else {
                        logger.Error('build', `LostCategory variable not found in: ${bold(magenta(entry.name))}`, 'Category must be exported with LostCategory variable!');
                        return;
                    }
                } catch (error) {
                    logger.Error('build', `Error importing category: ${bold(magenta(entry.name))}`, error);
                    return;
                }
            }
        }
        return categories;
    }

    async function createAddonJSON() {
        const AddonJSON: Lost.AddonJSON = {
            "supports-worker-mode": (Config.SupportsWorkerMode) ? Config.SupportsWorkerMode : undefined,
            "min-construct-version": (Config.MinConstructVersion) ? Config.MinConstructVersion : undefined,
            "is-c3-addon": true,
            "sdk-version": 2,
            "type": Config.Type,
            "name": Config.AddonName,
            "id": Config.AddonId,
            "version": Config.Version,
            "author": Config.Author,
            "website": Config.WebsiteURL,
            "documentation": Config.DocsURL,
            "description": Config.AddonDescription,
            "editor-scripts": [
                `${(Config.Type === 'plugin') ? 'plugin.js' : 'behavior.js'}`,
                "type.js",
                "instance.js"
            ],
            "file-list": [
                `${(Config.Type === 'plugin') ? 'c3runtime/plugin.js' : 'c3runtime/behavior.js'}`,
                "c3runtime/type.js",
                "c3runtime/instance.js",
                "c3runtime/conditions.js",
                "c3runtime/actions.js",
                "c3runtime/expressions.js",
                "lang/en-US.json",
                "aces.json",
                "addon.json",
                `${(Config.Type === 'plugin') ? 'plugin.js' : 'behavior.js'}`,
                "instance.js",
                "type.js",
                `${iconName}`
            ]
        };
    
        scripts.forEach(script => AddonJSON['file-list'].push(`scripts/${script}`));
        files.forEach(file => AddonJSON['file-list'].push(`files/${file}`));
    
        await Deno.writeTextFile(`${buildPath}/addon.json`, JSON.stringify(AddonJSON, null, 4));
    }
    
    async function createAcesJSON() {
        const AcesJSON = {} as Lost.AcesJSON;
    
        categories.forEach(category => {
            AcesJSON[category.Id] = {
                'actions': [],
                'conditions': [],
                'expressions': []
            }
    
            category['Actions'].forEach(action => {
                const {Id, Options, Params} = action;
                const {ScriptName, Highlight, Deprecated, IsAsync} = Options;
                const AceAction = {} as Lost.AceAction;
                AceAction['id'] = Id;
                AceAction['scriptName'] = ScriptName;
                AceAction['highlight'] = Highlight;
                AceAction['isDeprecated'] = Deprecated;
                AceAction['isAsync'] = IsAsync;
                AceAction['params'] = [];
                Params.forEach(param => {
                    const {Type, Id, InitialValue} = param.Options;
                    const AceParam = {} as Lost.AceParam;
                    AceParam['id'] = Id;
                    AceParam['type'] = Type;
                    AceParam['initialValue'] = InitialValue as string;
                    if (Type === 'string') AceParam['autocompleteId'] = param.Options.AutocompleteId;
                    if (Type === 'combo') {
                        const paramItems = param.Options.Items.map(item => item[0]);
                        AceParam['items'] = paramItems;
                    }
                    if (Type === 'object') AceParam['allowedPluginIds'] = param.Options.AllowedPluginIds;
                    AceAction['params'].push(AceParam);
                })
                if (category.Deprecated) AceAction['isDeprecated'] = true;
                AcesJSON[category.Id]['actions'].push(AceAction);
            })
    
            category['Conditions'].forEach(condition => {
                const {Id, Options, Params} = condition;
                const {
                    ScriptName, Highlight, Deprecated, 
                    IsTrigger, IsFakeTrigger, IsStatic, IsLooping,
                    IsInvertible, IsCompatibleWithTriggers
                } = Options;
                const AceCondition = {} as Lost.AceCondition;
                AceCondition['id'] = Id;
                AceCondition['scriptName'] = ScriptName;
                AceCondition['highlight'] = Highlight;
                AceCondition['isDeprecated'] = Deprecated;
                AceCondition['isTrigger'] = IsTrigger;
                AceCondition['isFakeTrigger'] = IsFakeTrigger;
                AceCondition['isStatic'] = IsStatic;
                AceCondition['isLooping'] = IsLooping;
                AceCondition['isInvertible'] = IsInvertible;
                AceCondition['isCompatibleWithTriggers'] = IsCompatibleWithTriggers;
    
                Params.forEach(param => {
                    const {Type, Id, InitialValue} = param.Options;
                    const AceParam = {} as Lost.AceParam;
                    AceParam['id'] = Id;
                    AceParam['type'] = Type;
                    AceParam['initialValue'] = InitialValue as string;
                    if (Type === 'string') AceParam['autocompleteId'] = param.Options.AutocompleteId;
                    if (Type === 'combo') {
                        const paramItems = param.Options.Items.map(item => item[0]);
                        AceParam['items'] = paramItems;
                    }
                    if (Type === 'object') AceParam['allowedPluginIds'] = param.Options.AllowedPluginIds;
                    AceCondition['params'].push(AceParam);
                })
                if (category.Deprecated) AceCondition['isDeprecated'] = true;
                AcesJSON[category.Id]['conditions'].push(AceCondition);
            })
    
            category['Expressions'].forEach(expression => {
                const {Id, Options, Params} = expression;
                const {ScriptName, Highlight, Deprecated, ReturnType, IsVariadicParameters} = Options;
                const AceExpression = {} as Lost.AceExpression;
                AceExpression['id'] = Id;
                AceExpression['expressionName'] = ScriptName;
                AceExpression['highlight'] = Highlight;
                AceExpression['isDeprecated'] = Deprecated;
                AceExpression['returnType'] = ReturnType;
                AceExpression['isVariadicParameters'] = IsVariadicParameters;
    
                Params.forEach(param => {
                    const {Type, Id, InitialValue} = param.Options;
                    const AceParam = {} as Lost.AceParam;
                    AceParam['id'] = Id;
                    AceParam['type'] = Type;
                    AceParam['initialValue'] = InitialValue as string;
                    if (Type === 'string') AceParam['autocompleteId'] = param.Options.AutocompleteId;
                })
                if (category.Deprecated) AceExpression['isDeprecated'] = true;
                AcesJSON[category.Id]['expressions'].push(AceExpression);
            })
        })
    
        await Deno.writeTextFile(`${buildPath}/aces.json`, JSON.stringify(AcesJSON, null, 4));
    }
    
    async function createLanguageJSON() {
        const LanguageJSON = {
            "languageTag": "en-US",
            "fileDescription": `Strings for ${Config.AddonName} addon.`,
            "text": {
                [Config.Type + 's']: {
                    [Config.AddonId.toLowerCase()]: {
                        "name": Config.ObjectName,
                        "description": Config.AddonDescription,
                        "help-url": Config.DocsURL,
                        "properties": {},
                        "aceCategories": {},
                        "conditions": {},
                        "actions": {},
                        "expressions": {}
                    }
                }
            }
        } as Lost.LanguageJSON;
    
        const DeepJSON = LanguageJSON['text'][Config.Type + 's'][Config.AddonId.toLowerCase()];
    
        PluginProperties.forEach(pp => {
            const {Type, Id, Name, Description} = pp.Options;
            const LangPP = {} as Lost.LanguagePluginProperty;
            LangPP['name'] = Name;
            LangPP['desc'] = Description || '';
            if (Type === 'combo') {
                LangPP['items'] = {};
                pp.Options.Items.forEach(item => {
                    (LangPP['items'] as {[itemsId: string]: string})[item[0]] = item[1];
                })
            }
            DeepJSON['properties'][Id] = LangPP;
        })
    
        categories.forEach(category => {
            DeepJSON['aceCategories'][category.Id] = category.Name;
    
            
    
            category['Actions'].forEach(action => {
                const {Id, Name, DisplayText, Description, Params} = action;
                const LanguageAction = {} as Lost.LanguageAction;
                LanguageAction['list-name'] = Name;
                LanguageAction['display-text'] = DisplayText;
                LanguageAction['description'] = Description;
                LanguageAction['params'] = {};
    
                Params.forEach(param => {
                    const {Type, Id, Name, Description} = param.Options;
                    const LanguageParam = {} as Lost.LanguageParam;
                    LanguageParam['name'] = Name;
                    LanguageParam['desc'] = Description || '';
                    if (Type === 'combo') {
                        LanguageParam['items'] = {};
                        param.Options.Items.forEach(item => {
                            (LanguageParam['items'] as {[itemsId: string]: string})[item[0]] = item[1];
                        })
                    }
                    LanguageAction['params'][Id] = LanguageParam;
                })
                DeepJSON['actions'][Id] = LanguageAction;
            })
    
            category['Conditions'].forEach(condition => {
                const {Id, Name, DisplayText, Description, Params} = condition;
                const LanguageCondition = {} as Lost.LanguageCondition;
                LanguageCondition['list-name'] = Name;
                LanguageCondition['display-text'] = DisplayText;
                LanguageCondition['description'] = Description;
                LanguageCondition['params'] = {};
    
                Params.forEach(param => {
                    const {Type, Id, Name, Description} = param.Options;
                    const LanguageParam = {} as Lost.LanguageParam;
                    LanguageParam['name'] = Name;
                    LanguageParam['desc'] = Description || '';
                    if (Type === 'combo') {
                        LanguageParam['items'] = {};
                        param.Options.Items.forEach(item => {
                            (LanguageParam['items'] as {[itemsId: string]: string})[item[0]] = item[1];
                        })
                    }
                    LanguageCondition['params'][Id] = LanguageParam;
                })
                DeepJSON['conditions'][Id] = LanguageCondition;
            })
    
            category['Expressions'].forEach(condition => {
                const {Id, Name, Description, Params} = condition;
                const LanguageExpression = {} as Lost.LanguageExpression;
                LanguageExpression['translated-name'] = Name;
                LanguageExpression['description'] = Description;
                LanguageExpression['params'] = {};
    
                Params.forEach(param => {
                    const {Id, Name, Description} = param.Options;
                    const LanguageParam = {} as Lost.LanguageParam;
                    LanguageParam['name'] = Name;
                    LanguageParam['desc'] = Description || '';
                    LanguageExpression['params'][Id] = LanguageParam;
                })
                DeepJSON['expressions'][Id] = LanguageExpression;
            })
        })
    
        await Deno.writeTextFile(`${buildPath}/lang/en-US.json`, JSON.stringify(LanguageJSON, null, 4));
    }

    async function addAddonEntities() {
        const decoder = new TextDecoder("utf-8");
        const encoder = new TextEncoder();
    
        let allActions: any = {};
        let allConditions: any = {};
        let allExpressions: any = {};
    
        categories.forEach(category => {
            category['Actions'].forEach(action => {
                const {ScriptName, Script} = action.Options;
                allActions[ScriptName] = Script;
            })
            
            category['Conditions'].forEach(condition => {
                const {ScriptName, Script} = condition.Options;
                allConditions[ScriptName] = Script;
            })
    
            category['Expressions'].forEach(expression => {
                const {ScriptName, Script} = expression.Options;
                allExpressions[ScriptName] = Script;
            })
        })
    
        const actionsFile = await Deno.readFile(`${buildPath}/c3runtime/actions.js`);
        let actionsContent = decoder.decode(actionsFile);
        actionsContent = actionsContent.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Acts\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Acts = ${serializeObjectWithFunctions(allActions)}`);
        const actionsJS = encoder.encode(actionsContent);
        await Deno.writeFile(`${buildPath}/c3runtime/actions.js`, actionsJS);
    
        const conditionsFile = await Deno.readFile(`${buildPath}/c3runtime/conditions.js`);
        let conditionsContent = decoder.decode(conditionsFile);
        conditionsContent = conditionsContent.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Cnds\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Cnds = ${serializeObjectWithFunctions(allConditions)}`);
        const conditionsJS = encoder.encode(conditionsContent);
        await Deno.writeFile(`${buildPath}/c3runtime/conditions.js`, conditionsJS);
    
        const expressionsFile = await Deno.readFile(`${buildPath}/c3runtime/expressions.js`);
        let expressionsContent = decoder.decode(expressionsFile);
        expressionsContent = expressionsContent.replace(/C3\.Plugins\[CONFIG\.AddonId\]\.Exps\s*=\s*\{\};/, `C3.Plugins[CONFIG.AddonId].Exps = ${serializeObjectWithFunctions(allExpressions)}`);
        const expressionsJS = encoder.encode(expressionsContent);
        await Deno.writeFile(`${buildPath}/c3runtime/expressions.js`, expressionsJS);
    
    }

    async function getScripts(path: string) {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await getScripts(`${path}/${entry.name}`);
            }
            if (entry.isFile && entry.name.endsWith('.js')) {
                const scriptInConfig = Config.Scripts?.find(script => script.FileName === entry.name);
                if (scriptInConfig) {
                    logger.Info(`Founded script: ${entry.name}`, `Loading with dependency type: ${scriptInConfig.Type}`);
                } else {
                    logger.Info(`Founded script: ${entry.name}`, `Loading with default dependency type: ${"external-dom-script"}`);
                }
                await Deno.copyFile(`${path}/${entry.name}`, `${buildPath}/scripts/${entry.name}`);
                scripts.push(entry.name);
            }
        }
    }
    
    async function getFiles(path: string) {
        for await (const entry of Deno.readDir(path)) {
            if (entry.isDirectory) {
                await getFiles(`${path}/${entry.name}`);
            }
            if (entry.isFile) {
                const fileInConfig = Config.Files?.find(file => file.FileName === entry.name);
                if (fileInConfig) {
                    logger.Info(`Founded file: ${entry.name}`, `Loading with type: ${fileInConfig.Type}`);
                } else {
                    logger.Info(`Founded file: ${entry.name}`, `Loading with default type: ${(entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output'}`);
                }
                await Deno.copyFile(`${path}/${entry.name}`, `${buildPath}/files/${entry.name}`);
                files.push(entry.name);
            }
        }
    }
    
    async function getAddonIcon(): Promise<boolean> {
        for await (const entry of Deno.readDir(`${Deno.cwd()}/Addon`)) {
            if (entry.isFile) {
                const isPng = entry.name.endsWith('.png');
                const isSvg = entry.name.endsWith('.svg');
                if (isPng || isSvg) {
                    console.log(iconName)
                    iconName = entry.name
                    if (isPng) iconType = 'image/png';
                    if (isSvg) iconType = 'image/svg+xml';
                    return true;
                }
            }
        }
        logger.Error('build', ErrorMessage.ICON_NOT_FOUNDED_OR_INCORRECT_FORMAT)
        return false;
    }
    
    async function createAddonStructure(type: Lost.AddonType) {
        const addonBaseDir = path.resolve(__dirname,`${type}_base/dist`);
        const mainAddonFile = `${type}.js`;
        await Deno.mkdir(buildPath);
        await Deno.mkdir(`${buildPath}/c3runtime`);
        await Deno.mkdir(`${buildPath}/lang`);
        await Deno.mkdir(`${buildPath}/scripts`);
        await Deno.mkdir(`${buildPath}/files`);
    
        logger.Searching('Searching for scripts');
        await getScripts(`${Deno.cwd()}/Addon/Scripts`);
    
        logger.Searching('Searching for files');
        await getFiles(`${Deno.cwd()}/Addon/Files`);

        /**
        * Search addon icon
        */
        await getAddonIcon().then(recieved => { if (!recieved) throw new Error('') });
        await Deno.copyFile(`${Deno.cwd()}/Addon/${iconName}`, `${buildPath}/${iconName}`);
    
        const LOST_CONFIG = {
            Config: Config,
            PluginProperties,
            IconName: iconName,
            IconType: iconType,
            Scripts: scripts,
            Files: files,
            RemoteScripts: Config.RemoteScripts || []
        };
        const lostConfigRegex = /const\s+LOST_CONFIG\s*=\s*{\s*};/;
        const lostConfigReplace = `const LOST_CONFIG = ${JSON.stringify(LOST_CONFIG)};`;
    
        // root
        
        let _mainAddonFile = await Deno.readTextFile(`${addonBaseDir}/${mainAddonFile}`);
        _mainAddonFile = _mainAddonFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, mainAddonFile)}`, _mainAddonFile);
        // await Deno.copyFile(`${addonBaseDir}/${mainAddonFile}`, `${join(buildPath, mainAddonFile)}`);
    
        let typeFile = await Deno.readTextFile(`${join(addonBaseDir, 'instance.js')}`);
        typeFile = typeFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${buildPath}/type.js`, typeFile);
        //await Deno.copyFile(`${join(addonBaseDir, 'type.js')}`, `${buildPath}/type.js`);
    
        let _instanceFile = await Deno.readTextFile(`${join(addonBaseDir, 'instance.js')}`);
        _instanceFile = _instanceFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, 'instance.js')}`, _instanceFile);
        //await Deno.copyFile(`${join(addonBaseDir, 'instance.js')}`, `${join(buildPath, 'instance.js')}`);
    
        // c3runtime folder
        let _mainAddonC3RuntimeFile = await Deno.readTextFile(`${join(addonBaseDir, `c3runtime/${mainAddonFile}`)}`);
        _mainAddonC3RuntimeFile = _mainAddonC3RuntimeFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, `c3runtime/${mainAddonFile}`)}`, _mainAddonC3RuntimeFile);
        //await Deno.copyFile(`${join(addonBaseDir, `c3runtime/${mainAddonFile}`)}`, `${join(buildPath, `c3runtime/${mainAddonFile}`)}`);

        let typeC3RuntimeFile = await Deno.readTextFile(`${join(addonBaseDir, 'c3runtime/type.js')}`);
        typeC3RuntimeFile = typeC3RuntimeFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, 'c3runtime/type.js')}`, typeC3RuntimeFile);
        //await Deno.copyFile(`${join(addonBaseDir, 'c3runtime/type.js')}`, `${join(buildPath, 'c3runtime/type.js')}`);
    
        let actionsFile = await Deno.readTextFile(`${join(addonBaseDir, 'c3runtime/actions.js')}`);
        actionsFile = actionsFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, 'c3runtime/actions.js')}`, actionsFile);
        //await Deno.copyFile(`${join(addonBaseDir, 'c3runtime/actions.js')}`, `${join(buildPath, 'c3runtime/actions.js')}`);
        
        let conditionsFile = await Deno.readTextFile(`${join(addonBaseDir, 'c3runtime/conditions.js')}`);
        conditionsFile = conditionsFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, 'c3runtime/conditions.js')}`, conditionsFile);
        //await Deno.copyFile(`${join(addonBaseDir, 'c3runtime/conditions.js')}`, `${join(buildPath, 'c3runtime/conditions.js')}`);
    
        let expressionsFile = await Deno.readTextFile(`${join(addonBaseDir, 'c3runtime/expressions.js')}`);
        expressionsFile = expressionsFile.replace(lostConfigRegex, lostConfigReplace);
        await Deno.writeTextFile(`${join(buildPath, 'c3runtime/expressions.js')}`, expressionsFile);
        //await Deno.copyFile(`${join(addonBaseDir, 'c3runtime/expressions.js')}`, `${join(buildPath, 'c3runtime/expressions.js')}`);
    
        // instance.js
        let instanceFile = await transpileTsToJs(`${Deno.cwd()}/Addon/Instance.ts`) as string;
        const configImportRegex = /import\s*{?\s*Config\s*}?\s*from\s*["'](?:@config|(?:\.\.\/)?lost\.config\.ts)["'];/;
    
        instanceFile = instanceFile.replace(configImportRegex, `
    const LOST_CONFIG = ${JSON.stringify(LOST_CONFIG)};\n
    const Config = LOST_CONFIG.Config;\n`)
        await Deno.writeTextFile(`${buildPath}/c3runtime/instance.js`, instanceFile);
    }

    async function zipAddon() {
        const files: {
            name: string;
            data: Uint8Array;
        }[] = [];
    
        // Add top files
        for await (const entry of walk(buildPath)) {
            const {isFile, path} = entry;
            if (isFile) {
                const data = await Deno.readFile(path);
                const relativePath = entry.path.substring(buildPath.length + 1);
                
                files.push({name: relativePath, data});
            }
        }
    
        //console.log(files);
        const buffer = await zip.create(files);
        const addonFile = `${Config.AddonId}_${Config.Version}.c3addon`;
        await Deno.writeFile(`${addonsCollectionPath}/${addonFile}`, buffer);
    
        /**
         * Remove all files after build
         */
        await Deno.remove(buildPath, { recursive: true });
    }
    
    return {
        Config,
        PluginProperties,
        Categories: categories
    }
}

function findDuplicates(arr: string[]) {
    const counts: any = {};
    const duplicates: string[] = [];

    for (let item of arr) {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > 1) {
            duplicates.push(item);
        }
    }
    return {
        result: duplicates.length > 0,
        items: duplicates
    };
}

function checkCategories(cats: Lost.LostCategoryBase[]): Promise<boolean> {
    return new Promise<true> ((res, rej) => {
        const categoryDuplicates = findDuplicates(cats.map(c => c.Id));
        if (categoryDuplicates.result) {
            logger.Error('build', ErrorMessage.CATEGORY_ID_DUPLICATED, categoryDuplicates.items);
            rej('');
        }
    
        cats.forEach(category => {
            const {Id, Name, Deprecated} = category;
    
            if (Deprecated) {
                logger.Warning(`"${Name}" --> ${WarningMessage.CATEGORY_DEPRECATED}`);
            }
    
            if (Id === '') {
                logger.Error('build', ErrorMessage.CATEGORY_ID_EMPTY)
                rej(false);
            }
            if (Name === '') {
                logger.Error('build', ErrorMessage.CATEGORY_NAME_EMPTY)
                rej(false);
            }
    
            /**
             * Actions
             */
            const actionsIdsDuplicates = findDuplicates(category['Actions'].map(e => e.Id));
            if (actionsIdsDuplicates.result) {
                logger.Error('build', ErrorMessage.ACTIONS_ID_DUPLICATED, `Category Id: "${category.Id}", Actions Ids:`, actionsIdsDuplicates.items);
                rej(false);
            }
            // const emptyActionsIds = category['Actions'].map(e => e.Id === '');
            // if (emptyActionsIds.length > 0) {
            //     logger.Error('build', ErrorMessage.ACTION_ID_EMPTY, `Category Id: "${category.Id}"`);
            //     rej(false);
            // }
    
            /**
             * Conditions
             */
            const conditionsIdsDuplicates = findDuplicates(category['Conditions'].map(e => e.Id));
            if (conditionsIdsDuplicates.result) {
                logger.Error('build', ErrorMessage.CONDITIONS_ID_DUPLICATED, `${bold('Category Id:')} "${category.Id}", ${bold('Conditions Ids:')}`, conditionsIdsDuplicates.items);
                rej(false);
            }
    
            // const emptyConditionsIds = category['Conditions'].map(e => {e.Id, e.Options.ScriptName});
            // if (emptyConditionsIds.length > 0) {
            //     logger.Error('build', ErrorMessage.CONDITION_ID_EMPTY, `Category Id: "${category.Id}"`);
            //     rej(false);
            // }

            /**
             * Expressions
             */
            const expressionsIdsDuplicates = findDuplicates(category['Expressions'].map(e => e.Id));
            if (expressionsIdsDuplicates.result) {
                logger.Error('build', ErrorMessage.EXPRESSIONS_ID_DUPLICATED, `${bold('Category Id:')} "${category.Id}", ${bold('Expressions Ids:')}`, expressionsIdsDuplicates.items);
                rej(false);
            }

            // const emptyExpressionsIds = category['Expressions'].map(e => e.Id === '');
            // if (emptyExpressionsIds.length > 0) {
            //     logger.Error('build', ErrorMessage.EXPRESSION__ID_EMPTY, `Category Id: "${category.Id}"`);
            //     rej(false);
            // }
    
        })
        /**
         * Else
         */
        res(true);
    })
}

async function transpileTsToJs(filePath: string): Promise<string | null> {
    const project = new Project({
        compilerOptions: {
            target: 8,
            module: 7
        }
    });
    const sourceFile = project.addSourceFileAtPath(filePath);
    const transpiled = sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();
    return transpiled || null;
}

async function serveAddon(port: number) {
    logger.Line();
    logger.Process('Starting addon server');

    const getContentType = (filePath: string): string | undefined => {
        const extension = filePath.split(".").pop();
        const contentTypes: { [key: string]: string } = {
            "js": "application/javascript",
            "css": "text/css",
            "json": "application/json",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "gif": "image/gif",
            "svg": "image/svg+xml",
            "txt": "text/plain",
        };
        return contentTypes[extension || ""];
    }

    const handler = async (req: Request): Promise<Response> => {
        try {
            const url = new URL(req.url);
            let filePath = `${buildPath}${url.pathname}`;
    
            try {
                const fileInfo = await Deno.stat(filePath);
                if (fileInfo.isDirectory) {
                    filePath = `${filePath}/index.html`;
                }
            } catch {
                return new Response("File not found", { status: 404 });
            }
    
            const file = await Deno.readFile(filePath);
            const contentType = getContentType(filePath) || "application/octet-stream";
    
            return new Response(file, {
                status: 200,
                headers: {
                    "Content-Type": contentType,
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (err) {
            return new Response("Internal Server Error", { status: 500 });
        }
    }

    Deno.serve({
        port,
        onListen() {
            console.log(`${bold('Addon server started!')} ${magenta(bold(`--> http://localhost:${port}/addon.json <--`))}`)
            //console.log(magenta(`\n --> ${bold(`http://localhost:${port}/addon.json`)} <--`));
        }
    }, handler)
}

/**
 * Misc
 */
function serializeObjectWithFunctions(obj: any): string {
    let str = '{\n';
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'function') {
                // Преобразование функции в строку
                str += `  ${key}: function ${value.toString().replace(/^function\s*\w*\s*/, '')},\n`;
            } else {
                str += `  ${key}: ${JSON.stringify(value, null, 2)},\n`;
            }
        }
    }
    str = str.replace(/,\n$/, '\n'); // Удаляем последнюю запятую
    str += '}';
    return str;
}
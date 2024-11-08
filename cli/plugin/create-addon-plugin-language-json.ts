import type { LanguageJSON, LanguageAction, LanguageCondition, LanguageExpression, LanguagePluginProperty, LanguageParam } from "../../lib/json.ts";
import type { LostConfig } from "../../lib/common.ts";
import type { Property } from "../../lib/plugin-props.ts";
import { BUILD_PATH } from "../paths.ts";
import type { CategoryClassType } from '../../lib/entities.ts';

interface CreateLanguageJSONOptions {
    CONFIG: LostConfig<'plugin' | 'behavior'>;
    PLUGIN_PROPERTIES: Property[];
    CATEGORIES: CategoryClassType[];
}

export async function createAddonPluginLanguageJSON({CONFIG, PLUGIN_PROPERTIES, CATEGORIES}: CreateLanguageJSONOptions) {
    const LanguageJSON = {
        "languageTag": "en-US",
        "fileDescription": `Strings for ${CONFIG.AddonName} addon.`,
        "text": {
            [CONFIG.Type + 's']: {
                [CONFIG.AddonId.toLowerCase()]: {
                    "name": CONFIG.ObjectName,
                    "description": CONFIG.AddonDescription,
                    "help-url": CONFIG.DocsURL,
                    "properties": {},
                    "aceCategories": {},
                    "conditions": {},
                    "actions": {},
                    "expressions": {}
                }
            }
        }
    } as LanguageJSON.Plugin;

    const DeepJSON = LanguageJSON['text'][CONFIG.Type + 's'][CONFIG.AddonId.toLowerCase()];

    PLUGIN_PROPERTIES.forEach(pp => {
        const {Type, Id, Name, Description} = pp.Options;
        const LangPP = {} as LanguagePluginProperty;
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

    CATEGORIES.forEach(category => {
        DeepJSON['aceCategories'][category.Id] = category.Name;

        

        category['Actions'].forEach(action => {
            const {Id, Name, DisplayText, Description, Params} = action;
            const LanguageAction = {} as LanguageAction;
            LanguageAction['list-name'] = Name;
            LanguageAction['display-text'] = DisplayText;
            LanguageAction['description'] = Description;
            LanguageAction['params'] = {};

            Params.forEach(param => {
                const {Type, Id, Name, Description} = param.Options;
                const LanguageParam = {} as LanguageParam;
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
            const LanguageCondition = {} as LanguageCondition;
            LanguageCondition['list-name'] = Name;
            LanguageCondition['display-text'] = DisplayText;
            LanguageCondition['description'] = Description;
            LanguageCondition['params'] = {};

            Params.forEach(param => {
                const {Type, Id, Name, Description} = param.Options;
                const LanguageParam = {} as LanguageParam;
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
            const LanguageExpression = {} as LanguageExpression;
            LanguageExpression['translated-name'] = Name;
            LanguageExpression['description'] = Description;
            LanguageExpression['params'] = {};

            Params.forEach(param => {
                const {Id, Name, Description} = param.Options;
                const LanguageParam = {} as LanguageParam;
                LanguageParam['name'] = Name;
                LanguageParam['desc'] = Description || '';
                LanguageExpression['params'][Id] = LanguageParam;
            })
            DeepJSON['expressions'][Id] = LanguageExpression;
        })
    })

    await Deno.writeTextFile(`${BUILD_PATH}/lang/en-US.json`, JSON.stringify(LanguageJSON, null, 4));
}
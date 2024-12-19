// deno-lint-ignore-file
import { ActionEntity } from "../entities/action.ts";
import { ICategory } from "../entities/category.ts";
import { ConditionEntity } from "../entities/condition.ts";
import { EntityType, Entity } from "../entities/entity.ts";
import { ExpressionEntity } from "../entities/expression.ts";
import { Param, Parameter } from "../entities/parameter.ts";
import { PluginProperty, Property } from "../entities/plugin-property.ts";
import { LostProject } from "../lost-project.ts";
import { 
    AceAction, AceBooleanParameter, AceCategory, AceComboParameter, 
    AceCondition, AceExpression, AceObjectParameter, AceParameter, 
    AcesJSON, AceStringParameter 
} from "../types/json/aces.ts";
import type { AddonJSON } from "../types/json/addon.ts";
import { 
    AceParametersCollection, LanguageAceCategoriesCollection, LanguageAceComboParameter, LanguageAceParameter, 
    LanguageAction, LanguageActionsCollection, LanguageComboProperty, LanguageCondition, 
    LanguageConditionsCollection, LanguageExpression, LanguageExpressionsCollection, 
    LanguageJSON, LanguageLinkProperty, LanguagePropertiesCollection, LanguageProperty 
} from "../types/json/language.ts";
import { AddonFileManager } from "./file-manager.ts";
import { Addon } from "./index.ts";

export abstract class AddonMetadataManager {

    static async create(): Promise<string> {
        const config = Addon.config;
        const editorScripts = AddonFileManager.getEditorScriptsList();
        const fileList = await AddonFileManager.getFilesList();
        
        const json: AddonJSON = {
            "supports-worker-mode": (config.supportWorkerMode) ? config.supportWorkerMode : undefined,
            "min-construct-version": (config.minConstructVersion) ? config.minConstructVersion : undefined,
            "is-c3-addon": true,
            "sdk-version": 2,
            "type": config.type,
            "name": config.addonName,
            "id": config.addonId,
            "version": config.version,
            "author": config.author,
            "website": config.websiteUrl,
            "documentation": config.docsUrl,
            "description": config.addonDescription,
            "editor-scripts": editorScripts,
            "file-list": fileList
        }

        if (LostProject.buildOptions.minify) {
            return JSON.stringify(json);
        } else {
            return JSON.stringify(json, null, 4);
        }
    }
}

export abstract class AcesManager {

    static create(): string {
        const categories = Addon.categories;
        const json: AcesJSON = {} as AcesJSON;

        categories.forEach(c => {
            json[c._id] = this.#createCategory(c);
        });

        if (LostProject.buildOptions.minify) {
            return JSON.stringify(json);
        } else {
            return JSON.stringify(json, null, 4);
        }
    }

    static #createParameter(parameter: Parameter): AceParameter {
        const aceParameter: AceParameter = {} as AceParameter;

        aceParameter['id'] = parameter._id;
        aceParameter['type'] = parameter._opts.type;

        switch (parameter._opts.type) {
            case Param.Number:
                aceParameter['initialValue'] = (parameter._opts.initialValue) ? String(parameter._opts.initialValue) : '';
                break;
            case Param.String:
                const p = aceParameter as AceStringParameter;
                p['initialValue'] = (parameter._opts.initialValue) ? `"${String(parameter._opts.initialValue)}"` : "";
                p['autocompleteId'] = parameter._opts.autocompleteId;
                break;
            case Param.Any:
                if (parameter._opts.initialValue) {
                    if (typeof parameter._opts.initialValue === 'string') {
                        aceParameter['initialValue'] = `"${String(parameter._opts.initialValue)}"`;
                    } else if (typeof parameter._opts.initialValue === 'number') {
                        aceParameter['initialValue'] = String(parameter._opts.initialValue);
                    }
                } else {
                    aceParameter['initialValue'] = '';
                }
                break;
            case Param.Boolean:
                const b = aceParameter as AceBooleanParameter;
                if (typeof parameter._opts.initialValue === 'boolean') {
                    switch (parameter._opts.initialValue) {
                        case true:
                            b['initialValue'] = 'true';
                            break;
                        default:
                            b['initialValue'] = 'false';
                            break;
                    }
                } else {
                    b['initialValue'] = 'false';
                }
                break;
            case Param.Combo:
                const c = aceParameter as AceComboParameter;
                const items = parameter._opts.items.map(item => item[0]);

                c['items'] = items;

                if (parameter._opts.initialValue) {
                    if (items.includes(parameter._opts.initialValue)) {
                        c['initialValue'] = parameter._opts.initialValue;
                    } else {
                        c['initialValue'] = items[0];
                    }
                } else {
                    c['initialValue'] = items[0];
                }
                break;
            case Param.Object:
                const o = aceParameter as AceObjectParameter;

                o['allowedPluginIds'] = parameter._opts.allowedPluginIds
                break
            // case Param.ComboGrouped:
            //     const cg = aceParameter as AceComboGroupedParameter;

            //     const itemGroups = parameter._opts.groups.map(group => {
            //         return {
            //             id: group.id,
            //             items: group.items.map(item => item[0])
            //         }
            //     })
            //     cg['itemGroups'] = itemGroups;
            //     break;
        }

        return aceParameter;
    }

    static #createCategory(category: ICategory): AceCategory {
        const aceCategory: AceCategory = {} as AceCategory;

        aceCategory['actions'] = [...category._actions.map(e => this.#createAction(e))],
            aceCategory['conditions'] = [...category._conditions.map(e => this.#createCondition(e))],
            aceCategory['expressions'] = [...category._expressions.map(e => this.#createExpression(e))]

        return aceCategory;
    }


    static #createAction(entity: ActionEntity): AceAction {
        const aceEntity: AceAction = {} as AceAction;

        aceEntity['id'] = entity._id;
        aceEntity['scriptName'] = entity._func.name;
        aceEntity['highlight'] = entity._opts?.highlight;
        aceEntity['isDeprecated'] = entity._opts?.isDeprecated;
        aceEntity['isAsync'] = entity._opts?.isAsync;

        if (entity._params.length > 0) {
            aceEntity['params'] = [...entity._params.map(p => this.#createParameter(p))];
        }

        return aceEntity;
    }

    static #createCondition(entity: ConditionEntity): AceCondition {
        const aceEntity: AceCondition = {} as AceCondition;

        aceEntity['id'] = entity._id;
        aceEntity['scriptName'] = entity._func.name;
        aceEntity['highlight'] = entity._opts?.highlight;
        aceEntity['isDeprecated'] = entity._opts?.isDeprecated;
        aceEntity['isTrigger'] = entity._opts?.isTrigger || true;
        aceEntity['isFakeTrigger'] = entity._opts?.isFakeTrigger;
        aceEntity['isStatic'] = entity._opts?.isStatic;
        aceEntity['isLooping'] = entity._opts?.isLooping;
        aceEntity['isInvertible'] = entity._opts?.isInvertible || true;
        aceEntity['isCompatibleWithTriggers'] = entity._opts?.isCompatibleWithTriggers || true;

        if (entity._params.length > 0) {
            aceEntity['params'] = [...entity._params.map(p => this.#createParameter(p))];
        }

        return aceEntity;
    }

    static #createExpression(entity: ExpressionEntity): AceExpression {
        const aceEntity: AceExpression = {} as AceExpression;

        aceEntity['id'] = entity._id;
        aceEntity['expressionName'] = entity._func.name;
        aceEntity['highlight'] = entity._opts?.highlight;
        aceEntity['isDeprecated'] = entity._opts?.isDeprecated;
        aceEntity['returnType'] = entity._opts?.returnType || 'any';
        aceEntity['isVariadicParameters'] = entity._opts?.isVariadicParameters;

        if (entity._params.length > 0) {
            aceEntity['params'] = [...entity._params.map(p => this.#createParameter(p))];
        }

        return aceEntity;
    }
}

export abstract class LanguageManager {

    static create(): string {
        const categories = Addon.categories;
        const properties = Addon.properties;
        const config = Addon.config;

        const json: LanguageJSON = {
            "languageTag": 'en-US',
            "fileDescription": `Strings for ${config.addonName} addon.`,
            "text": {}
        } as LanguageJSON;

        let addonType: 'plugins' | 'behaviors';

        switch (config.type) {
            case "plugin":
                addonType = 'plugins'
                json['text']['plugins'] = {};
                break;
            case "behavior":
                addonType = 'behaviors';
                json['text']['behaviors'] = {};
                break;
        }
        json['text'][addonType][config.addonId.toLocaleLowerCase()] = {
            'name': '',
            'description': '',
            'help-url': '',
            'properties': {},
            'aceCategories': {},
            'actions': {},
            'conditions': {},
            'expressions': {}
        }
        const deep = json['text'][addonType][config.addonId.toLocaleLowerCase()];

        deep['name'] = config.objectName;
        deep['description'] = config.addonDescription;
        deep['help-url'] = config.helpUrl;
        deep['properties'] = this.#createProperties(properties);
        deep['aceCategories'] = this.#createAceCategories(categories);

        deep['actions'] = this.#createActionsCollection(categories.map(c => c._actions).flat())
        deep['conditions'] = this.#createConditionsCollection(categories.map(c => c._conditions).flat());
        deep['expressions'] = this.#createExpressionsCollection(categories.map(c => c._expressions).flat());

        if (LostProject.buildOptions.minify) {
            return JSON.stringify(json);
        } else {
            return JSON.stringify(json, null, 4);
        }
    }

    static #createAceParameters(parameters: Parameter[]): AceParametersCollection {
        const collection: AceParametersCollection = {} as AceParametersCollection;

        parameters.forEach(parameter => {
            collection[parameter._id] = this.#createAceParameter(parameter);
        })

        return collection;
    }

    static #createAceParameter(parameter: Parameter): LanguageAceParameter {
        const languageParameter: LanguageAceParameter = {} as LanguageAceParameter;

        languageParameter['name'] = parameter._name;
        languageParameter['desc'] = parameter._description;

        if (parameter._opts.type === Param.Combo) {
            const p = languageParameter as LanguageAceComboParameter;
            const items = parameter._opts.items;

            p['items'] = {};
            items.forEach(item => {
                p['items'][item[0]] = item[1];
            })
        }

        // if (parameter._opts.type === Param.ComboGrouped) {
        //     const c = languageParameter as LanguageAceComboGroupedParameter;
        //     const groups = parameter._opts.groups;

        //     c['itemGroups'] = {};
        //     groups.forEach(group => {
        //         const items = group.items;

        //         c['itemGroups'][group.id] = {
        //             "name": '',
        //             "items": {}
        //         }

        //         items.forEach(item => {
        //             c['itemGroups'][group.id]['items'][item[0]] = item[1];
        //         })
        //     })
        // }

        return languageParameter;
    }

    static #createAction<E extends EntityType>(entity: Entity<E>): LanguageAction {
        const languageEntity: LanguageAction = {} as LanguageAction;

        languageEntity['list-name'] = entity._name;
        languageEntity['display-text'] = entity._displayText;
        languageEntity['description'] = entity._description;

        languageEntity['params'] = this.#createAceParameters(entity._params);

        return languageEntity;
    }

    static #createCondition<E extends EntityType>(entity: Entity<E>): LanguageCondition {
        const languageEntity: LanguageCondition = {} as LanguageCondition;

        languageEntity['list-name'] = entity._name;
        languageEntity['display-text'] = entity._displayText;
        languageEntity['description'] = entity._description;

        languageEntity['params'] = this.#createAceParameters(entity._params);

        return languageEntity;
    }

    static #createExpression<E extends EntityType>(entity: Entity<E>): LanguageExpression {
        const languageEntity: LanguageExpression = {} as LanguageExpression;

        languageEntity['translated-name'] = entity._name;
        languageEntity['description'] = entity._description;

        languageEntity['params'] = this.#createAceParameters(entity._params);

        return languageEntity;
    }

    static #createActionsCollection(entities: ActionEntity[]): LanguageActionsCollection {
        const collection: LanguageActionsCollection = {} as LanguageActionsCollection;

        entities.forEach(entity => {
            collection[entity._id] = this.#createAction(entity);
        })

        return collection;
    }

    static #createConditionsCollection(entities: ConditionEntity[]): LanguageConditionsCollection {
        const collection: LanguageConditionsCollection = {} as LanguageConditionsCollection;

        entities.forEach(entity => {
            collection[entity._id] = this.#createCondition(entity);
        })

        return collection;
    }

    static #createExpressionsCollection(entities: ExpressionEntity[]): LanguageExpressionsCollection {
        const collection: LanguageExpressionsCollection = {} as LanguageExpressionsCollection;

        entities.forEach(entity => {
            collection[entity._id] = this.#createExpression(entity);
        })

        return collection;
    }

    static #createAceCategories(categories: ICategory[]): LanguageAceCategoriesCollection {

        const aceCategories = {} as LanguageAceCategoriesCollection;

        categories.forEach(category => {
            aceCategories[category._id] = category._name;
        })

        return aceCategories;
    }

    static #createProperty(property: PluginProperty): LanguageProperty {
        const _property: LanguageProperty = {} as LanguageProperty;

        _property['name'] = property.name;
        _property['desc'] = property.description;

        if (property.opts.type === Property.Link) {
            const p = _property as LanguageLinkProperty;
            p['link-text'] = property.opts.linkText || 'Link Text';
        };

        if (property.opts.type === Property.Combo) {
            const p = _property as LanguageComboProperty;
            const items = property.opts.items;

            items.forEach(item => {
                p['items'][item[0]] = item[1];
            })
        }

        return _property;
    }
    static #createProperties(properties: PluginProperty[]): LanguagePropertiesCollection {
        const collection: LanguagePropertiesCollection = {} as LanguagePropertiesCollection;

        properties.forEach(p => {
            collection[p.id] = this.#createProperty(p);
        })

        return collection;
    }
}
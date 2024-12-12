import type {
    LanguageJSON, AceParametersCollection, LanguageAceParameter, LanguageAceComboParameter,
    LanguageAction, LanguageCondition, LanguageExpression, LanguageActionsCollection,
    LanguageConditionsCollection, LanguageExpressionsCollection, LanguageAceCategoriesCollection, LanguageProperty,
    LanguageLinkProperty, LanguageComboProperty, LanguagePropertiesCollection
} from "../../shared/json-types.ts";
import { Param } from "../entities/parameter.ts";
import { Property } from "../entities/plugin-property.ts";
import type { LostConfig, AddonType } from "../config.ts";
import type { ActionEntity } from "../entities/action.ts";
import type { CategoryClassType } from "../entities/category.ts";
import type { ConditionEntity } from "../entities/condition.ts";
import type { EntityType, Entity } from "../entities/entity.ts";
import type { ExpressionEntity } from "../entities/expression.ts";
import type { Parameter } from "../entities/parameter.ts";
import type { PluginProperty } from "../entities/plugin-property.ts";

export abstract class LanguageManager {

    static create(categories: CategoryClassType[], pluginProperties: PluginProperty<any, any, any>[], config: LostConfig<AddonType>): LanguageJSON {
        const language: LanguageJSON = {
            "languageTag": 'en-US',
            "fileDescription": `Strings for ${config.addonName} addon.`,
            "text": {}
        } as LanguageJSON;

        let addonType: 'plugins' | 'behaviors';

        switch (config.type) {
            case "plugin":
                addonType = 'plugins'
                language['text']['plugins'] = {};
                break;
            case "behavior":
                addonType = 'behaviors';
                language['text']['behaviors'] = {};
                break;
        }
        language['text'][addonType][config.addonId.toLocaleLowerCase()] = {
            'name': '',
            'description': '',
            'help-url': '',
            'properties': {},
            'aceCategories': {},
            'actions': {},
            'conditions': {},
            'expressions': {}
        }
        const deep = language['text'][addonType][config.addonId.toLocaleLowerCase()];

        deep['name'] = config.objectName;
        deep['description'] = config.addonDescription;
        deep['help-url'] = config.helpUrl.EN;
        deep['properties'] = this.#createProperties(pluginProperties);
        deep['aceCategories'] = this.#createAceCategories(categories);

        deep['actions'] = this.#createActionsCollection(categories.map(c => c._actions).flat())
        deep['conditions'] = this.#createConditionsCollection(categories.map(c => c._conditions).flat());
        deep['expressions'] = this.#createExpressionsCollection(categories.map(c => c._expressions).flat());

        return language;
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

    static #createAceCategories(categories: CategoryClassType[]): LanguageAceCategoriesCollection {

        const aceCategories = {} as LanguageAceCategoriesCollection;

        categories.forEach(category => {
            aceCategories[category._id] = category._name;
        })

        return aceCategories;
    }

    static #createProperty(pluginProperty: PluginProperty<any, any, any>): LanguageProperty {
        const property: LanguageProperty = {} as LanguageProperty;

        property['name'] = pluginProperty._name;
        property['desc'] = pluginProperty._description;

        if (pluginProperty._opts.type === Property.Link) {
            const p = property as LanguageLinkProperty;
            p['link-text'] = pluginProperty._opts.linkText || 'Link Text';
        };

        if (pluginProperty._opts.type === Property.Combo) {
            const p = property as LanguageComboProperty;
            const items = pluginProperty._opts.items;

            items.forEach(item => {
                p['items'][item[0]] = item[1];
            })
        }

        return property;
    }
    static #createProperties(pluginProperties: PluginProperty<any, any, any>[]): LanguagePropertiesCollection {
        const collection: LanguagePropertiesCollection = {} as LanguagePropertiesCollection;

        pluginProperties.forEach(p => {
            collection[p._id] = this.#createProperty(p);
        })

        return collection;
    }
}
import type {
    LanguageJSON, AceParametersCollection, LanguageAceParameter, LanguageAceComboParameter,
    LanguageAction, LanguageCondition, LanguageExpression, LanguageActionsCollection,
    LanguageConditionsCollection, LanguageExpressionsCollection, LanguageAceCategoriesCollection, LanguageProperty,
    LanguageLinkProperty, LanguageComboProperty, LanguagePropertiesCollection
} from "../../shared/json-types.ts";
import { Param } from "../entities/parameter.ts";
import { Property } from "../entities/plugin-property.ts";
import type { EntityType, Entity } from "../entities/entity.ts";
import type { Parameter } from "../entities/parameter.ts";
import type { PluginProperty } from "../entities/plugin-property.ts";
import { LostAddonProject } from "../lost.ts";

export abstract class LanguageManager {
    static create(): LanguageJSON {

        const json: LanguageJSON = {
            "languageTag": 'en-US',
            "fileDescription": `Strings for ${LostAddonProject.addon._config.addonName} addon.`,
            "text": {}
        } as LanguageJSON;

        let addonType: 'plugins' | 'behaviors';

        switch (LostAddonProject.addon._config.type) {
            case "plugin":
                addonType = 'plugins'
                json['text']['plugins'] = {};
                break;
            case "behavior":
                addonType = 'behaviors';
                json['text']['behaviors'] = {};
                break;
        }
        json['text'][addonType][LostAddonProject.addon._config.addonId.toLocaleLowerCase()] = {
            'name': '',
            'description': '',
            'help-url': '',
            'properties': {},
            'aceCategories': {},
            'actions': {},
            'conditions': {},
            'expressions': {}
        }
        const deep = json['text'][addonType][LostAddonProject.addon._config.addonId.toLocaleLowerCase()];

        deep['name'] = LostAddonProject.addon._config.objectName;
        deep['description'] = LostAddonProject.addon._config.addonDescription;
        deep['help-url'] = LostAddonProject.addon._config.helpUrl.EN;
        deep['properties'] = this.#createProperties();
        deep['aceCategories'] = this.#createAceCategories();

        deep['actions'] = this.#createActionsCollection()
        deep['conditions'] = this.#createConditionsCollection();
        deep['expressions'] = this.#createExpressionsCollection();

        return json;
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

    static #createActionsCollection(): LanguageActionsCollection {
        const entities = LostAddonProject.addon._categories.map(c => c._actions).flat();
        const collection: LanguageActionsCollection = {} as LanguageActionsCollection;

        entities.forEach(entity => {
            collection[entity._id] = this.#createAction(entity);
        })

        return collection;
    }

    static #createConditionsCollection(): LanguageConditionsCollection {
        const entities = LostAddonProject.addon._categories.map(c => c._conditions).flat();
        const collection: LanguageConditionsCollection = {} as LanguageConditionsCollection;

        entities.forEach(entity => {
            collection[entity._id] = this.#createCondition(entity);
        })

        return collection;
    }

    static #createExpressionsCollection(): LanguageExpressionsCollection {
        const entities = LostAddonProject.addon._categories.map(c => c._expressions).flat();
        const collection: LanguageExpressionsCollection = {} as LanguageExpressionsCollection;

        entities.forEach(entity => {
            collection[entity._id] = this.#createExpression(entity);
        })

        return collection;
    }

    static #createAceCategories(): LanguageAceCategoriesCollection {

        const aceCategories = {} as LanguageAceCategoriesCollection;

        LostAddonProject.addon._categories.forEach(category => {
            aceCategories[category._id] = category._name;
        })

        return aceCategories;
    }

    static #createProperty(property: PluginProperty<any, any, any, any>): LanguageProperty {
        const languageProperty: LanguageProperty = {} as LanguageProperty;

        languageProperty['name'] = property._name;
        languageProperty['desc'] = property._description;

        if (property._opts.type === Property.Link) {
            const p = languageProperty as LanguageLinkProperty;
            p['link-text'] = property._opts.linkText || 'Link Text';
        };

        if (property._opts.type === Property.Combo) {
            const p = languageProperty as LanguageComboProperty;
            const items = property._opts.items;

            items.forEach(item => {
                p['items'][item[0]] = item[1];
            })
        }

        return languageProperty;
    }
    static #createProperties(): LanguagePropertiesCollection {
        const collection: LanguagePropertiesCollection = {} as LanguagePropertiesCollection;

        LostAddonProject.addon._properties.forEach(p => {
            collection[p._id] = this.#createProperty(p);
        })

        return collection;
    }
}
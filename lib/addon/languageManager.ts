import type { Aces } from "../helpers/ace.ts";
import type { Category } from "../helpers/category.ts";
import type {
    Addons,
    Addon,
} from "./config/index.ts";

type LanguageJson = {
    languageTag: 'en-US';
    fileDescription: string;
    text: {
        [addonType in `${keyof Addons}s`]?: Record<string, {
            name: string;
            description: string;
            properties: Record<string, IProperty | IComboProperty | ILinkProperty>;
            'help-url': Addon['info']['helpUrl'];

            aceCategories: Record<string, string>;
            actions: Record<string, IAction>;
            conditions: Record<string, ICondition>;
            expressions: Record<string, IExpression>;
        }>
    }
}

interface IProperty {
    name: string;
    desc: string;
}

interface IComboProperty extends IProperty {
    items: Record<string, string>;
}

interface ILinkProperty extends IProperty {
    "link-text": string;
}

interface IParameter {
    name: string;
    desc: string;
}

interface IComboParameter extends IParameter {
    items: Record<string, string>;
}

interface IAce {
    description: string;
    params?: Record<string, IParameter | IComboParameter>;
}

export interface IAction extends IAce {
    "list-name": string;
    "display-text": string;
}

export interface ICondition extends IAce {
    "list-name": string;
    "display-text": string;
}

export interface IExpression extends IAce {
    "translated-name": string;
    "display-text": string;
}

export class LanguageManager {

    private propertiesToJson(properties: Addon['properties']) {
        const data: Record<string, IProperty | IComboProperty | ILinkProperty> = {};

        for (const property of properties) {
            if (property.type === 'combo') {
                data[property.id] = {
                    name: property.name,
                    desc: property.desc || '-',
                    items: property.items
                }
            } else if (property.type === 'link') {
                data[property.id] = {
                    name: property.name,
                    desc: property.desc || '-',
                    "link-text": property.linkText
                }
            } else {
                data[property.id] = {
                    name: property.name,
                    desc: property.desc || '-',
                }
            }
        }
        
        return data;
    }

    private categoriesToJson(categories: Category[]): Record<string, string> {
        const data: Record<string, string> = {};

        for (const category of categories) {
            data[category.id] = category.name;
        }

        return data;
    }

    private parametersToJson(parameters: Category['aces'][0]['parameters']): IAce['params'] {
            const params: IAce['params'] = {};
    
            for (const parameter of parameters) {
                if (parameter.type === 'combo') {
                    params[parameter.id] = {
                        name: parameter.name,
                        desc: parameter.desc || '-',
                        items: parameter.items
                    }
                } else {
                    params[parameter.id] = {
                        name: parameter.name,
                        desc: parameter.desc || '-'
                    }
                }
            }
    
            return params;
        }

    private acesToJson<T extends keyof Aces>(type: T, aces: Aces[T]['klass'][]) {
            const _aces: Record<string, Aces[T]['languageJson']> = {};
    
            for (const ace of aces) {
                if (ace.type === 'action') {
                    _aces[ace.id] = {
                        "list-name": ace.name,
                        "display-text": ace.displayText,
                        description: ace.desc || '-',
                        params: this.parametersToJson(ace.parameters)
                    };
                } else if (ace.type === 'condition') {
                    _aces[ace.id] = {
                        "list-name": ace.name,
                        "display-text": ace.displayText,
                        description: ace.desc || '-',
                        params: this.parametersToJson(ace.parameters)
                    };
                } else if (ace.type === 'expression') {
                    _aces[ace.id] = {
                        "translated-name": ace.name,
                        "display-text": ace.name,
                        description: ace.desc || '-',
                        params: this.parametersToJson(ace.parameters)
                    };
                } else {
                    throw new Error('Unknown ace type', ace);
                }
            }

            return _aces;
        }

    createJson<Type extends keyof Addons>(
        config: Addon<Type>,
    ) {
        const data: Required<LanguageJson> = {
            languageTag: 'en-US',
            fileDescription: `Strings for ${config.info.name}`,
            text: {
                plugins: { },
            }
        };

        data['text']['plugins']![config.info.id.toLowerCase()] = {
            name: config.info.objectName,
            description: config.info.description || 'Addon made with Lost C3 framework',
            properties: this.propertiesToJson(config.properties),
            'help-url': config.info.helpUrl || 'https://lostin.mind',

            aceCategories: this.categoriesToJson(config.allCategories()),
            actions: this.acesToJson('action', config.allCategories().flatMap(category => category.allActions())),
            conditions: this.acesToJson('condition', config.allCategories().flatMap(category => category.allConditions())),
            expressions: this.acesToJson('expression', config.allCategories().flatMap(category => category.allExpressions()))
        }

        return data;
    }
}
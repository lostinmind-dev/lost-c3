import type { Aces } from "../helpers/ace.ts";
import type { Category } from "../helpers/category.ts";

type AcesCollection = Record<string, Function>;

export class AcesSerializer {
    serialize<Type extends keyof Aces>(type: Type, categories: Category[]) {
        const aces: AcesCollection = {};

        categories.flatMap(category => category.aces.filter(ace => ace.type === type))
            .forEach(action => {
                aces[action.method.name] = new Function('...args', `
                    categories.${action.category.id}.${action.method.name}.bind(this)(...args);
                `);
            });

        return this.#serialize(aces);
    }

    #serialize(aces: AcesCollection) {
        let str = '{\n';
        for (const key in aces) {
            if (aces.hasOwnProperty(key)) {
                const value = aces[key];

                if (typeof value === 'function') {
                    str += `  ${key}: function ${(value as Function).toString().replace(/^function\s*\w*\s*/, '')},\n`;
                } else if (typeof value === 'string' && (value as string).startsWith('LostCategories[')) {
                    /** Directly embed the string without quotes */
                    str += `  ${key}: ${value},\n`;
                } else {
                    str += `  ${key}: ${JSON.stringify(value, null, 2)},\n`;
                }
            }
        }
        str = str.replace(/,\n$/, '\n'); /** Delete last comma */
        str += '}';
        return str;
    }
}
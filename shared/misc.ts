import type { CategoryClassType } from "../lib/entities/category.ts";

export function findClassesInheritingFrom(fileContent: string, parentClass: string) {
    // Динамическое регулярное выражение для поиска классов
    const classRegex = new RegExp(`class\\s+(\\w+)\\s+extends\\s+${parentClass.replace('.', '\\.')}\\s*{`, 'g');

    const matches = [];
    let match;

    while ((match = classRegex.exec(fileContent)) !== null) {
        matches.push(match[1]); // Имя класса находится в первой группе
    }

    return matches[0];
}

export function getRelativePath(path: string, basePath: string, fileName: string, replaceTsToJs?: true) {
    const relativePathIndex = path.indexOf(basePath);
    const relativePath = path.substring(relativePathIndex + basePath.length + 1);

    const newFileName = (replaceTsToJs === true) ? fileName.replace('.ts', '.js') : fileName;

    if (relativePath.length > 0) {
        return `${relativePath}/${newFileName}`;
    } else {
        return newFileName;
    }
}


export function dedent(strings: TemplateStringsArray, ...values: any[]) {
    const fullString = strings.reduce((result, str, i) => result + str + (values[i] || ""), "");
    const lines = fullString.split("\n");

    // Убираем пустые строки и минимальные отступы
    const minIndent = lines.filter(line => line.trim()).reduce((min, line) => {
        const indent = line.match(/^(\s*)/)?.[0]?.length ?? 0;
        return Math.min(min, indent);
    }, Infinity);

    return lines.map(line => line.slice(minIndent)).join("\n").trim();
}

export async function isDirectoryExists(path: string): Promise<boolean> {
    try {
        const dirStat = await Deno.stat(path);

        if (
            dirStat &&
            dirStat.isDirectory
        ) {
            return true;
        } else {
            return false;
        }
    } catch (_e) {
        return false;
    }
}

type CategoryModule = {
    default: new () => CategoryClassType;
}

export async function getCategory(path: string) {
    const getModule = async (path: string) => {
        const module = await import(path);
        return module as CategoryModule;
    }

    const module = await getModule(path);
    const _class = new module.default();
    const _prototype = _class.constructor.prototype as CategoryClassType;

    return (_prototype) ? _prototype : null;
}

export function serializeObjectWithFunctions(obj: any): string {
    let str = '{\n';
    for (const key in obj) {
        // deno-lint-ignore no-prototype-builtins
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
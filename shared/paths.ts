import { AddonFoldersPaths } from "./paths/addon-folders.ts";
import { ProjectFilesPaths } from "./paths/project-files.ts";
import { ProjectFoldersPaths } from "./paths/project-folders.ts";

import { Links } from "./paths/links.ts";

export abstract class Paths {
    static readonly Root = Deno.cwd();

    static readonly ProjectFolders = ProjectFoldersPaths;
    static readonly ProjectFiles = ProjectFilesPaths;

    static readonly AddonFolders = AddonFoldersPaths;
    static readonly Links = Links;

    // static getPathWithoutFile()

    static getFoldersAfterFolder(path: string, folderName: string): string[] {
        const normalizedPath = path.replace(/\\/g, '/'); // Приводим путь к универсальному виду
        const regex = new RegExp(`/${folderName}/`);
        const match = normalizedPath.match(regex);

        if (!match) {
            // console.warn(`Folder "${folderName}" not found in the path.`);
            return [];
        }

        // Индекс конца первого вхождения папки
        const endIndex = normalizedPath.indexOf(match[0]) + match[0].length;

        // Извлекаем часть пути после папки
        const remainingPath = normalizedPath.slice(endIndex);

        // Разделяем оставшуюся часть на папки
        return remainingPath.split('/').filter(Boolean); // Убираем пустые элементы
    }
}
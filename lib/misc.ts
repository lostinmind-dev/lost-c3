export function findClassInheritingFrom<
    ParentClasses extends readonly string[]
>(content: string, parentClasses: ParentClasses) {
    /** Dynamic regular expression for multiple class search */
    const classRegex = new RegExp(
        `class\\s+(\\w+)\\s+extends\\s+(${parentClasses
            .map(parentClass => parentClass.replace('.', '\\.'))
            .join('|')
        })\\s*{`,
        'g'
    );

    const match = classRegex.exec(content);

    return match ? {
        className: match[1],
        parentClass: match[2] as ParentClasses[number]
    } : null;
}

export function clearText(str: string) {
    return str.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '');
}

export async function isFileExists(path: string) {
    try {
        const dirStat = await Deno.stat(path);

        if (
            dirStat &&
            dirStat.isFile
        ) {
            return true;
        } else {
            return false;
        }
    } catch (_e) {
        return false;
    }
}

export async function isDirectoryExists(path: string) {
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
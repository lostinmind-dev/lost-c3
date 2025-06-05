function clearText(str: string) {
    return str.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '');
}

async function isFileExists(path: string) {
    try {
        const stat = await Deno.stat(path);

        if (stat.isFile) return true;

        return false;
    } catch (_e) {
        return false;
    }
}

async function isDirectoryExists(path: string) {
    try {
        const stat = await Deno.stat(path);

        if (stat.isDirectory) return true;

        return false;
    } catch (_e) {
        return false;
    }
}

export const misc = {
    clearText,
    isFileExists,
    isDirectoryExists
}
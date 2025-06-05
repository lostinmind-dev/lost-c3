import { path } from "./deps.ts";

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

async function clearDirectory(_path: string) {
    if (!(await isDirectoryExists(_path))) return;

    try {
        for await (const entry of Deno.readDir(_path)) {
            Deno.remove(path.join(_path, entry.name), { recursive: true });
        }
    } catch (e) {
        return;
    }
}

export const misc = {
    clearText,
    isFileExists,
    isDirectoryExists,
    clearDirectory
}
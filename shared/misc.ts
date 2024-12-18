export function findClassesInheritingFrom(fileContent: string, parentClass: string) {
    /** Dynamic regular expression for class search */
    const classRegex = new RegExp(`class\\s+(\\w+)\\s+extends\\s+${parentClass.replace('.', '\\.')}\\s*{`, 'g');

    const matches = [];
    let match;

    while ((match = classRegex.exec(fileContent)) !== null) {
        matches.push(match[1]); /** The class name is in the first group */
    }

    return matches[0];
}


export async function cloneRepo(url: string, path: string) {
    const command = new Deno.Command('git', {
        args: ['clone', url, path],
        stdout: "piped",
        stderr: "piped"
    })

    const { code } = await command.output();

    if (code === 0) {
        return;
    } else {
        Deno.exit(1);
    }
}

export function dedent(strings: TemplateStringsArray | string, ...values: any[]): string {
    /** If a string is passed, process it as a single template string */
    const fullString = typeof strings === "string"
        ? strings
        : strings.reduce((result, str, i) => result + str + (values[i] || ""), "");

    const lines = fullString.split("\n");

    const minIndent = lines.filter(line => line.trim()).reduce((min, line) => {
        const indent = line.match(/^(\s*)/)?.[0]?.length ?? 0;
        return Math.min(min, indent);
    }, Infinity);

    return lines.map(line => line.slice(minIndent)).join("\n").trim();
}

export async function isFileExists(path: string): Promise<boolean> {
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
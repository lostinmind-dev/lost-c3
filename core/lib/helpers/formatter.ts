class Formatter {
    bold(text: string) {
        return (`[b]${text}[/b]`);
    }

    italic(text: string) {
        return (`[i]${text}[/i]`);
    };

    underline(text: string) {
        return (`[u]${text}[/u]`);
    };

    strikethrough(text: string) {
        return (`[s]${text}[/s]`);
    };

    code(text: string) {
        return (`[code]${text}[/code]`);
    };
}

export const formatter = new Formatter();

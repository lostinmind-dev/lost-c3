/**
 * Returns --> **text**
 */
export function Bold(Text: string): string {
    return (`[b]${Text}[/b]`);
};

/**
 * Returns --> *text*
 */
export function Italic(Text: string): string {
    return (`[i]${Text}[/i]`);
};

/**
 * Returns --> t͟e͟x͟t͟
 */
export function Underline(Text: string): string {
    return (`[u]${Text}[/u]`);
};

/**
 * Returns --> ~text~
 */
export function Strikethrough(Text: string): string {
    return (`[s]${Text}[/s]`);
};

/**
 * Returns --> `text`
 */
export function Code(Text: string): string {
    return (`[code]${Text}[/code]`);
};
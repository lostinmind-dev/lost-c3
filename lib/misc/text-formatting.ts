/**
 * Returns --> **text**
 */
export function bold(text: string): string {
    return (`[b]${text}[/b]`);
};

/**
 * Returns --> *text*
 */
export function italic(text: string): string {
    return (`[i]${text}[/i]`);
};

/**
 * Returns --> t͟e͟x͟t͟
 */
export function underline(text: string): string {
    return (`[u]${text}[/u]`);
};

/**
 * Returns --> ~text~
 */
export function strikethrough(text: string): string {
    return (`[s]${text}[/s]`);
};

/**
 * Returns --> `text`
 */
export function code(text: string): string {
    return (`[code]${text}[/code]`);
};
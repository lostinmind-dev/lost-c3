export async function getModule<T>(path: string) {
    const module = await import(path);
    return module as T;   
}
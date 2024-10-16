import { path } from "./cli-deps.ts";

export function getLibraryDirectory(devMode?: true) {
    if (devMode) {
        return path.dirname(path.fromFileUrl(import.meta.url));
    }
    if (import.meta.url.startsWith('file:')) {
        return path.fromFileUrl(import.meta.url);
    } else {
        return new URL(import.meta.url).pathname;
    }
}
import type { FunctionsCollection, LostData } from "../types/index.ts";

declare global {
    const _lostData: LostData;
    const _lostMethods: FunctionsCollection;
}
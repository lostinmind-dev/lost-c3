interface DuplicatesResult {
    result: boolean;
    items: string[];
}

export function findDuplicatesInArray(arr: string[]): DuplicatesResult {
    const counts: any = {};
    const duplicates: string[] = [];

    for (let item of arr) {
        counts[item] = (counts[item] || 0) + 1;
        if (counts[item] > 1) {
            duplicates.push(item);
        }
    }
    return {
        result: duplicates.length > 0,
        items: duplicates
    };
}
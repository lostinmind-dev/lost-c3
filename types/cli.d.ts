declare type LostMethodsColection = {
    [key: string]: ((i: any) => void) | Function | undefined;
}

declare const _lostMethods: LostMethodsColection;
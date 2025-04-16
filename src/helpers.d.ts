type ReplaceTsToJs<T extends string> =
    T extends `${infer Name}.ts`
    ? `${Name}.js`
    : T
;
type CapitalizeFirstLetter<T extends string> =
    T extends `${infer First}${infer Rest}`
    ? `${Uppercase<First>}${Rest}`
    : T;
    
type ClassMethods<T> = {
    [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

declare type BooleanMethodsOf<T> = {
    [K in keyof T]: T[K] extends (...args: any[]) => boolean ? K : never
}[keyof T];

declare type Constructor<T = any> = new (...args: any[]) => T;

// declare type ConstructorParameters<T extends Constructor> =
//     T extends new (...args: infer P) => any ? P : never
//     ;

declare type ClassConstructor<T extends Constructor> = {
    new(...args: ConstructorParameters<T>): InstanceType<T>;
};

/**
 * Преобразует все приватные свойства и методы класса в публичные
 * Работает с полями, объявленными с префиксом "#" или модификатором "private"
 */
declare type MakePublic<T> = {
    // Для каждого ключа K в T, создаем свойство с этим именем
    // Но удаляем префикс "#" если он есть
    [K in keyof T as K extends `#${infer R}` ? R : K]: T[K];
} & {
    // Для экземпляров классов, собираем также приватные свойства из прототипа
    [K in keyof T as T[K] extends Function ? K : never]: T[K];
};
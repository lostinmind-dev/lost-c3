const module = await import('./test.ts');

// console.log(module.default)

const _class = new module.default();

console.log(_class.constructor.prototype)
import {
    bundler,
    esbuild,
    path,
    colors
} from './deps.ts';
import { Logger } from "./logger.ts";
import {
    findClassInheritingFrom,
    isDirectoryExists
} from "./misc.ts";

/** Systems */
import { FileSystem } from "./systems/file.ts";
import { AcesSystem } from "./systems/aces.ts";
import { MetadataSystem } from "./systems/metadata.ts";
import { LanguageSystem } from "./systems/language.ts";
import { RegistererSystem } from "./systems/registerer.ts";
import { DeclarationsSystem } from "./systems/declarations.ts";
import { Addon } from "./config.ts";

const c3Classes = [
    /** SDK */
    /** Behavior */
    'SDK.IBehaviorTypeBase',
    'SDK.IBehaviorInstanceBase',

    /** Plugin */
    'SDK.ITypeBase',
    'SDK.IInstanceBase', 'SDK.IWorldInstanceBase',

    /** Runtime */
    /** Behavior */
    'globalThis.ISDKBehaviorBase',
    'globalThis.ISDKBehaviorTypeBase',
    'globalThis.ISDKBehaviorInstanceBase',

    /** Plugin */
    'globalThis.ISDKPluginBase',
    'globalThis.ISDKObjectTypeBase',
    'globalThis.ISDKInstanceBase', 'globalThis.ISDKWorldInstanceBase'
] as const;

// export abstract class Builder {
//     static async #start() {
//         const runtimeContent = [
//             compiler.compile('runtime', 'type.ts'),
//             compiler.compile('runtime', `${config.type}.ts`),
//             compiler.compile('runtime', 'instance.ts'),
//         ];

//         const editorContent = [
//             compiler.compile('editor', 'type.ts'),
//             compiler.compile('editor', 'instance.ts'),
//         ];

//         Promise.all([
//             runtimeContent.map(async file => {
//                 let content = file.content;

//                 const info = findClassInheritingFrom(content, c3Classes);

//                 if (!info) {
//                     console.error('C3 class not found at file', file.name);
//                     Deno.exit(1);
//                 }

//                 let registration: string | undefined;

//                 if (file.name === 'type.js') registration = registerer.for(config.type, config.info.id, 'runtime-type');
//                 if (file.name === 'plugin.js' || file.name === 'behavior.js') registration = registerer.for(config.type, config.info.id, 'runtime-plugin-or-behavior');
//                 if (file.name === 'instance.js') registration = registerer.for(config.type, config.info.id, 'runtime-instance');

//                 if (!registration) {
//                     console.error('Registration not found for', file.name);
//                     Deno.exit(1);
//                 }

//                 content += `${registration} = ${info.className}`;

//                 if (this.#opts && this.#opts.prettier) {
//                     content = await prettier.format(content, this.#opts.prettier);
//                 } else {
//                     if (this.#opts && this.#opts.minifier) {
//                         content = uglifyJs.minify(content, this.#opts.minifier).code;
//                     } else {
//                         content = await prettier.format(content, { parser: 'babel' })
//                     }
//                 }
//                 fileManager.createFile(['c3runtime', file.name], content);
//             }),
//             editorContent.map(async file => {
//                 let content = file.content;

//                 const info = findClassInheritingFrom(content, c3Classes);
//                 if (!info) {
//                     console.error('C3 class not found at file', file.name);
//                     Deno.exit(1);
//                 }

//                 let registration: string | undefined;

//                 if (file.name === 'type.js') registration = registerer.for(config.type, config.info.id, 'sdk-type');
//                 if (file.name === 'instance.js') registration = registerer.for(config.type, config.info.id, 'sdk-instance');

//                 if (!registration) {
//                     console.error('Registration not found for', file.name);
//                     Deno.exit(1);
//                 }

//                 content += `${registration} = ${info.className}`;

//                 if (this.#opts && this.#opts.prettier) {
//                     content = await prettier.format(content, this.#opts.prettier);
//                 } else {
//                     if (this.#opts && this.#opts.minifier) {
//                         content = uglifyJs.minify(content, this.#opts.minifier).code;
//                     } else {
//                         content = await prettier.format(content, { parser: 'babel' })
//                     }
//                 }
//                 fileManager.createFile([file.name], content)
//             }),
//         ]);

//         const mainContent = await Deno.readTextFile(join(Deno.cwd(), '.addon_base', 'base.js'));
//         fileManager.createFile([`${config.type}.js`], await prettier.format(`
//             const config = ${JSON.stringify(config.toJson())}
//             ${mainContent}
//         `, { parser: 'babel' }));

//         /** scripts */
//         for (const script of config.scripts) {
//             if (script.ts) {
//                 if (this.#opts && this.#opts.bundler) {
//                     const content = (await bundler.bundle(join(script.path, script.name), this.#opts.bundler)).code;

//                     await fileManager.createFile([...script.c3Path.split('/')], content);
//                 } else {
//                     const content = compiler.compileTs(join(script.path, script.name))
//                     fileManager.createFile([...script.c3Path.split('/')], content);
//                 }
//             } else {
//                 await Deno.copyFile(
//                     join(script.path, script.name),
//                     join(Deno.cwd(), ...buildPath, ...script.c3Path.split('/'))
//                 );
//             }
//         }

//         /** modules */
//         for (const module of config.modules) {
//             if (module.ts) {
//                 if (this.#opts && this.#opts.bundler) {
//                     const content = (await bundler.bundle(join(module.path, module.name), this.#opts.bundler)).code;

//                     await fileManager.createFile([...module.c3Path.split('/')], content);
//                 } else {
//                     const content = compiler.compileTs(join(module.path, module.name))
//                     fileManager.createFile([...module.c3Path.split('/')], content);
//                 }
//             } else {
//                 await Deno.copyFile(
//                     join(module.path, module.name),
//                     join(Deno.cwd(), ...buildPath, 'c3runtime', ...module.c3Path.split('/'))
//                 );
//             }
//         }
//     }
// }


export type BuildOptions = {
    readonly watch?: true,
    /** *Optional*. Bundler options. Will be used in every script/module addon file */
    readonly bundler?: bundler.BundleOptions;
    /** *Optional*. ES Build options */
    readonly esbuild?: esbuild.BuildOptions;
    /** *Optional*. Array of custom tasks (methods) to do before build */
    readonly tasks?: Array<(() => void) | (() => Promise<void>)>;
}

function readDenoJsonImports() {
    type DenoJson = {
        importMap?: `${string}.json`;
        imports?: bundler.ImportMap['imports'];
    }

    return new Promise<bundler.ImportMap>((resolve, reject) => {

        const denoJson = JSON.parse(Deno.readTextFileSync(
            path.join(Deno.cwd(), 'deno.json')
        )) as DenoJson;

        if (denoJson.imports) {
            resolve({
                imports: denoJson.imports
            });
            return;
        }

        if (denoJson.importMap) {
            Deno.readTextFile(path.join(Deno.cwd(), denoJson.importMap))
                .then((data) => {
                    resolve(JSON.parse(data) as bundler.ImportMap);
                })
                .catch(reject)
                ;
            return;
        }

        if (!denoJson.importMap || !denoJson.imports) {
            reject(`".importMap" OR ".imports" property is not assigned in "deno.json"!`);
        }
    })
}

async function clearBuildFolder() {
    if (!await isDirectoryExists(PATHS.BUILD)) return;

    try {
        for await (const entry of Deno.readDir(PATHS.BUILD)) {
            Deno.remove(path.join(PATHS.BUILD, entry.name), { recursive: true });
        }
    } catch (e) {
        return;
    }
}

const PATHS = {
    BUILD: path.join(Deno.cwd(), 'build'),
    BUILDS: path.join(Deno.cwd(), 'builds'),
    TYPES: path.join(Deno.cwd(), 'types'),
    ADDON: path.join(Deno.cwd(), 'addon'),
} as const;

const logger = new Logger();
const file = new FileSystem();
const aces = new AcesSystem();
const metadata = new MetadataSystem();
const language = new LanguageSystem();
const registerer = new RegistererSystem();
const declarations = new DeclarationsSystem();

let building = false;
let rebuildTimeout: number;

let startTime: number
let endTime: number;
let count = 0;

async function build(config: Addon, options: BuildOptions) {
    const { watch, bundler, tasks } = options;

    try {
        const start = async () => {
            if (count === 0) {
                logger.clear();
                logger.line();

                logger.log(`👾 ${colors.bold(`Lost ➜  ${colors.yellow('5.0.0')} by ${colors.italic(colors.magenta('lostinmind.'))}`)}`);
                logger.line();
                logger.log(`🌐 ${colors.bold(`[GitHub] https://github.com/lostinmind-dev/lost-c3`)}`);
                logger.log(`📦 ${colors.bold(`[JSR] https://jsr.io/@lost-c3/lib`)}`);
                logger.log(`💵 ${colors.bold(`[Support project] https://www.paypal.com/paypalme/daklnn`)}`)

                logger.line();
            }

            await clearBuildFolder();

            /** START */
            building = true;
            startTime = performance.now();

            const importMap = await readDenoJsonImports();

            /** MAIN */
            if (tasks && tasks.length > 0) {
                logger.process('🚀 Processing tasks');

                for await (const method of tasks) {
                    await method();
                }
            }

            logger.logBetweenLines('🚀 Starting build process...');

            await file.createIcon();
            await file.createFolders(['c3runtime'], ['lang']);

            await config.loadCategories();
            // await config.loadScripts();
            // await config.loadModules();

            await declarations.createFile(config);

            /** en-US.json */
            await file.createFile(
                ['lang', 'en-US.json'],
                JSON.stringify(language.createJson(config), null, 2)
            );

            /** addon.json */
            await file.createFile(
                ['addon.json'],
                JSON.stringify(metadata.createJson(config), null, 2)
            );

            /** aces.json */
            await file.createFile(
                ['aces.json'],
                JSON.stringify(aces.createJson(config.allCategories()), null, 2)
            );

            /** c3runtime/categories.js */
            let categoriesContent = '';
            for (const category of config.allCategories()) {
                const patterns = [
                    /static\s*{[\s\S]*?}\s*constructor\s*\([^)]*\)\s*{[\s\S]*?}/g,
                    /static\s*{\s*_initClass\(\);\s*}/g
                ];

                let classContent = category.target.toString();

                for (const pattern of patterns) {
                    classContent = classContent.replace(pattern, '');
                }

                categoriesContent += `export const ${category.id} = new ${classContent};`
            }
            await file.createFile(['c3runtime', 'categories.js'], categoriesContent);

            /** c3runtime/main.js */
            await file.createFile(['c3runtime', 'main.js'], `
                import './${config.type}.js';
                import './type.js';
                import './instance.js';
                import './actions.js';
                import './conditions.js';
                import './expressions.js';
            `);

            /**
             * c3runtime/actions.js
             * c3runtime/conditions.js
             * c3runtime/expressions.js
             */
            const actsContent = `
                import * as categories from './categories.js'
                ${registerer.for(config.type, config.info.id, 'actions')} = ${aces.serialize('action', config.allCategories())};
            `;
            const cndsContent = `
                import * as categories from './categories.js'
                ${registerer.for(config.type, config.info.id, 'conditions')} = ${aces.serialize('condition', config.allCategories())};
            `;
            const expsContent = `
                import * as categories from './categories.js'
                ${registerer.for(config.type, config.info.id, 'expressions')} = ${aces.serialize('expression', config.allCategories())};
            `;

            await Promise.all([
                file.createFile(['c3runtime', 'actions.js'], actsContent),
                file.createFile(['c3runtime', 'conditions.js'], cndsContent),
                file.createFile(['c3runtime', 'expressions.js'], expsContent)
            ]);

            /** Zip all */
            await file.zipAll(`${config.info.id}-${config.info.version}`);
            /** MAIN */

            /** END */
            count++;
            endTime = performance.now();
            building = false;

            logger.logBetweenLines(
                '✅', `Addon [${config.info.id}] has been ${colors.green('successfully')} built`,
                '\n⏱️ ', `Build time: ${colors.bold(colors.yellow(`${((endTime - startTime) / 1000).toFixed(2)}`))}s | [${colors.bold(new Date().toISOString().replace('T', ' - '))}]`
            );

            if (watch) {
                logger.log(
                    '\n👀', colors.blue('Watching for file changes...\n')
                );
            } else {
                Deno.exit();
            }
        }

        await start();

        if (watch) {
            const watcher = Deno.watchFs(PATHS.ADDON);

            for await (const event of watcher) {
                if (building === true) break;

                if (rebuildTimeout) {
                    clearInterval(rebuildTimeout);
                }

                rebuildTimeout = setTimeout(() => start(), 100);
            }
        }
    } catch (e) {
        throw new Error(`Error while building ${e}`);
    }
}

export {
    PATHS, 
    build,
}
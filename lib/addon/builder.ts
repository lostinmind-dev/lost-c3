import type minifier from '../types/uglifyJs.ts';
import {
    type ts,
    bundler,
    prettier,
    uglifyJs,
    join,
    colors
} from '../deps.ts';
import { Logger } from "../utils/logger.ts";
import { findClassInheritingFrom, isDirectoryExists } from "../misc.ts";
import { ConfigLoader } from "./configLoader.ts";
import { FileManager } from "./fileManager.ts";
import { AcesManager } from "./acesManager.ts";
import { MetadataManager } from "./metadataManager.ts";
import { LanguageManager } from "./languageManager.ts";
import { AcesSerializer } from "./acesSerializer.ts";
import { TsCompiler } from "../tsCompiler.ts";
import { Registerer } from "./registerer.ts";
import { DeclarationsManager } from "../declarationsManager.ts";

export function build(opts?: BuildOptions, watch?: true) {
    Builder.start(opts, watch);
}

type TaskMethod = () => any;

type BuilderTask<
    Method extends TaskMethod = TaskMethod
> = {
    readonly method: Method;
    readonly onStart?: () => void;
    readonly onFinished?: (result?: ReturnType<Method>) => void;
}

type BuildOptions = {
    /** *Optional*. Bundler options. Will be used in every script/module addon file */
    readonly bundler?: bundler.BundleOptions;
    /** 
     * *Optional*. Typescript compiler options
     * @description If empty, will be used default compiler options that uses Construct 3
     */
    readonly compiler?: ts.CompilerOptions;
    /** *Optional*. Minify options */
    readonly minifier?: minifier.Options;
    /** *Optional*. Prettier options for all JSON files */
    readonly jsonPrettier?: prettier.Options & { parser: 'json' };
    /** *Optional*. Prettier options */
    readonly prettier?: prettier.Options & { parser: 'babel' };
    /** *Optional*. Array of custom tasks (methods) to do before build */
    readonly tasks?: BuilderTask[];
}

export const buildPath = ['build'] as const;
const watchPaths = [
    ['.addon_base'],
    ['addon', 'categories'],
    ['addon', 'editor'],
    ['addon', 'runtime'],
    ['addon', 'scripts'],
    ['addon.config.ts'],
] as const;

export const fileManager = new FileManager();
export const compiler = new TsCompiler();

const configLoader = new ConfigLoader();
const aces = new AcesManager();
const metadata = new MetadataManager();
const language = new LanguageManager();
const acesSerializer = new AcesSerializer();
const registerer = new Registerer();
const declarations = new DeclarationsManager();

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

export abstract class Builder {
    static #opts?: BuildOptions;
    static #watch: boolean = false;

    static #rebuildTimeout?: number;
    static #building: boolean = false;
    static #buildsCount: number = 0;
    static #startTime: number = 0;
    static #endTime: number = 0;

    static get buildTime() {
        return this.#endTime - this.#startTime;
    }

    static async #clear() {
        const path = join(Deno.cwd(), ...buildPath);

        if (!await isDirectoryExists(path)) return;

        try {
            for await (const entry of Deno.readDir(path)) {
                Deno.remove(join(path, entry.name), { recursive: true });
            }
        } catch (e) {
            return;
        }
    }

    /**
     * Builds addon
     * @param opts 
     * @param watch *Optional* If *true*, the build will be automatically restarted when any addon file was updated
     * @returns BuildResult
     */
    static async start(opts?: BuildOptions, watch?: true) {
        Logger.clear();
        Logger.line();

        Logger.log(`👾 ${colors.bold(`Lost ➜  ${colors.yellow('5.0.0')} by ${colors.italic(colors.magenta('lostinmind.'))}`)}`);
        Logger.line();
        Logger.log(`🌐 ${colors.bold(`[GitHub] https://github.com/lostinmind-dev/lost-c3`)}`);
        Logger.log(`📦 ${colors.bold(`[JSR] https://jsr.io/@lost-c3/lib`)}`);
        Logger.log(`💵 ${colors.bold(`[Support project] https://www.paypal.com/paypalme/daklnn`)}`)

        Logger.line();

        this.#opts = opts;
        this.#watch = watch || false;

        if (!this.#watch) {
            await this.#start();
        }

        await this.#startWithWatch();
    }

    /**  
     * Do array of custom tasks
     * @returns Count of finished tasks
     */
    static async #doTasks(tasks: BuilderTask[]) {
        if (tasks.length === 0) return 0;

        let finishedCount = 0;

        for (const task of tasks) {
            task.onStart?.();
            const result = await task.method();
            task.onFinished?.(result);
            finishedCount++;
        }

        return finishedCount;
    }

    static async #start() {
        if (this.#building) return;

        compiler.init(this.#opts?.compiler);
        await this.#clear();

        this.#startTime = performance.now();
        this.#building = true;

        if (
            this.#opts &&
            this.#opts.tasks &&
            this.#opts.tasks.length > 0
        ) {
            Logger.process('🚀 Processing tasks');
            await this.#doTasks(this.#opts.tasks);
        }

        Logger.logBetweenLines('🚀 Starting build process...');
        /** 
        *
        *
        *
        */
       /** Create base folders and files */
       await fileManager.createIcon();
       await fileManager.createFolders(['c3runtime'], ['lang']);


       const config = await configLoader.load();
       await config.loadCategories();
       await config.loadScripts();
       await config.loadModules();
        
       await declarations.create(config);

        /** en-US.json */
        const languageContent = language.createJson(config);
        if (this.#opts && this.#opts.jsonPrettier) {
            const content = await prettier.format(JSON.stringify(languageContent), this.#opts.jsonPrettier);
            await fileManager.createFile(['lang', 'en-US.json'], content);
        } else {
            await fileManager.createFile(['lang', 'en-US.json'], JSON.stringify(languageContent, null, 2));
        }

        /** addon.json */
        const metadataContent = metadata.createJson(config);
        if (this.#opts && this.#opts.jsonPrettier) {
            const content = await prettier.format(JSON.stringify(metadataContent), this.#opts.jsonPrettier);
            await fileManager.createFile(['addon.json'], content);
        } else {
            await fileManager.createFile(['addon.json'], JSON.stringify(metadataContent, null, 2));
        }

        /** aces.json */
        const acesContent = aces.createJson(config.allCategories());
        if (this.#opts && this.#opts.jsonPrettier) {
            const content = await prettier.format(JSON.stringify(acesContent), this.#opts.jsonPrettier);
            await fileManager.createFile(['aces.json'], content);
        } else {
            await fileManager.createFile(['aces.json'], JSON.stringify(acesContent, null, 2));
        }
        

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

        if (this.#opts && this.#opts.prettier) {
            categoriesContent = await prettier.format(categoriesContent, this.#opts.prettier);
        } else {
            if (this.#opts && this.#opts.minifier) {
                categoriesContent = uglifyJs.minify(categoriesContent, this.#opts.minifier).code;
            } else {
                categoriesContent = await prettier.format(categoriesContent, { parser: 'babel' }); 
            }
        }

        await fileManager.createFile(['c3runtime', 'categories.js'], categoriesContent)

        /** c3runtime/main.js */
        await fileManager.createFile(['c3runtime', 'main.js'], await prettier.format(`
            import './${config.type}.js';
            import './type.js';
            import './instance.js';
            import './actions.js';
            import './conditions.js';
            import './expressions.js';
        `, { parser: 'babel' }));

        const actsContent = `
            import * as categories from './categories.js'

            ${registerer.for(config.type, config.info.id, 'actions')} = ${acesSerializer.serialize('action', config.allCategories())};
        `;
        const cndsContent = `
            import * as categories from './categories.js'

            ${registerer.for(config.type, config.info.id, 'conditions')} = ${acesSerializer.serialize('condition', config.allCategories())};
        `;
        const expsContent = `
            import * as categories from './categories.js'

            ${registerer.for(config.type, config.info.id, 'expressions')} = ${acesSerializer.serialize('expression', config.allCategories())};
        `;

        if (this.#opts && this.#opts.prettier) {
            Promise.all([
                fileManager.createFile(['c3runtime', 'actions.js'], await prettier.format(actsContent, this.#opts.prettier)),
                fileManager.createFile(['c3runtime', 'conditions.js'], await prettier.format(cndsContent, this.#opts.prettier)),
                fileManager.createFile(['c3runtime', 'expressions.js'], await prettier.format(expsContent, this.#opts.prettier))
            ]);
        } else {
            if (this.#opts && this.#opts.minifier) {
                Promise.all([
                    fileManager.createFile(['c3runtime', 'actions.js'], uglifyJs.minify(actsContent, this.#opts.minifier).code),
                    fileManager.createFile(['c3runtime', 'conditions.js'], uglifyJs.minify(cndsContent, this.#opts.minifier).code),
                    fileManager.createFile(['c3runtime', 'expressions.js'], uglifyJs.minify(expsContent, this.#opts.minifier).code)
                ]);
            } else {
                Promise.all([
                    fileManager.createFile(['c3runtime', 'actions.js'], await prettier.format(actsContent, { parser: 'babel' })),
                    fileManager.createFile(['c3runtime', 'conditions.js'], await prettier.format(cndsContent, { parser: 'babel' })),
                    fileManager.createFile(['c3runtime', 'expressions.js'], await prettier.format(expsContent, { parser: 'babel' }))
                ]);
            }
        }

        const runtimeContent = [
            compiler.compile('runtime', 'type.ts'),
            compiler.compile('runtime', `${config.type}.ts`),
            compiler.compile('runtime', 'instance.ts'),
        ];

        const editorContent = [
            compiler.compile('editor', 'type.ts'),
            compiler.compile('editor', 'instance.ts'),
        ];
        
        Promise.all([
            runtimeContent.map(async file => {
                let content = file.content;

                const info = findClassInheritingFrom(content, c3Classes);
                
                if (!info) {
                    console.error('C3 class not found at file', file.name);
                    Deno.exit(1);
                }

                let registration: string | undefined;

                if (file.name === 'type.js') registration = registerer.for(config.type, config.info.id, 'runtime-type');
                if (file.name === 'plugin.js' || file.name === 'behavior.js') registration = registerer.for(config.type, config.info.id, 'runtime-plugin-or-behavior');
                if (file.name === 'instance.js') registration = registerer.for(config.type, config.info.id, 'runtime-instance');

                if (!registration) {
                    console.error('Registration not found for', file.name);
                    Deno.exit(1);
                }
                
                content += `${registration} = ${info.className}`;

                if (this.#opts && this.#opts.prettier) {
                    content = await prettier.format(content, this.#opts.prettier);
                } else {
                    if (this.#opts && this.#opts.minifier) {
                        content = uglifyJs.minify(content, this.#opts.minifier).code;
                    } else {
                        content = await prettier.format(content, { parser: 'babel' })
                    }
                }
                fileManager.createFile(['c3runtime', file.name], content);
            }),
            editorContent.map(async file => {
                let content = file.content;

                const info = findClassInheritingFrom(content, c3Classes);
                if (!info) {
                    console.error('C3 class not found at file', file.name);
                    Deno.exit(1);
                }

                let registration: string | undefined;

                if (file.name === 'type.js') registration = registerer.for(config.type, config.info.id, 'sdk-type');
                if (file.name === 'instance.js') registration = registerer.for(config.type, config.info.id, 'sdk-instance');

                if (!registration) {
                    console.error('Registration not found for', file.name);
                    Deno.exit(1);
                }

                content += `${registration} = ${info.className}`;

                if (this.#opts && this.#opts.prettier) {
                    content = await prettier.format(content, this.#opts.prettier);
                } else {
                    if (this.#opts && this.#opts.minifier) {
                        content = uglifyJs.minify(content, this.#opts.minifier).code;
                    } else {
                        content = await prettier.format(content, { parser: 'babel' })
                    }
                }
                fileManager.createFile([file.name], content)
            }),
        ]);

        const mainContent = await Deno.readTextFile(join(Deno.cwd(), '.addon_base', 'base.js'));
        fileManager.createFile([`${config.type}.js`], await prettier.format(`
            const config = ${JSON.stringify(config.toJson())}
            ${mainContent}
        `, { parser: 'babel' }));

        /** scripts */
        for (const script of config.scripts) {
            if (script.ts) {
                if (this.#opts && this.#opts.bundler) {
                    const content = (await bundler.bundle(join(script.path, script.name), this.#opts.bundler)).code;

                    await fileManager.createFile([...script.c3Path.split('/')], content);
                } else {
                    const content = compiler.compileTs(join(script.path, script.name))
                    fileManager.createFile([...script.c3Path.split('/')], content);
                }
            } else {
                await Deno.copyFile(
                    join(script.path, script.name),
                    join(Deno.cwd(), ...buildPath, 'c3runtime', ...script.c3Path.split('/'))
                );
            }
        }

        /** modules */
        for (const module of config.modules) {
            if (module.ts) {
                if (this.#opts && this.#opts.bundler) {
                    const content = (await bundler.bundle(join(module.path, module.name), this.#opts.bundler)).code;

                    await fileManager.createFile([...module.c3Path.split('/')], content);
                } else {
                    const content = compiler.compileTs(join(module.path, module.name))
                    fileManager.createFile([...module.c3Path.split('/')], content);
                }
            } else {
                await Deno.copyFile(
                    join(module.path, module.name),
                    join(Deno.cwd(), ...buildPath, 'c3runtime', ...module.c3Path.split('/'))
                );
            }
        }

        /** Zip all */
        await fileManager.zipAll(`${config.info.id}-${config.info.version}`);

        /** 
        *
        *
        *
        */
        this.#endTime = performance.now();
        this.#building = false;
        this.#buildsCount++;

        Logger.logBetweenLines(
            '✅', `Addon [${config.info.id}] has been ${colors.green('successfully')} built`,
            '\n⏱️ ', `Build time: ${colors.bold(colors.yellow(String(this.buildTime.toFixed(2))))} ms! | [${colors.bold(new Date().toISOString().replace('T', ' - '))}]`
        );

        if (this.#watch) {
            Logger.log(
                '\n👀', colors.blue('Watching for file changes...\n')
            );
        } else {
            Deno.exit();
        }
    }

    static async #startWithWatch() {
        const watcher = Deno.watchFs(watchPaths.map(path => join(Deno.cwd(), ...path)));

        await this.#start();

        for await (const event of watcher) {
            if (event.kind !== 'modify') continue;

            for (const path of event.paths) {
                // if (!path.endsWith('.ts') || !path.endsWith('.js')) continue;

                if (this.#rebuildTimeout) {
                    clearTimeout(this.#rebuildTimeout);
                }
                this.#rebuildTimeout = setTimeout(() => this.#start(), 250);
            }
        }
    }
}
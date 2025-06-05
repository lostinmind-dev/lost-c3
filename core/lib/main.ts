import {
    bundler,
    esbuild,
    path,
    colors
} from './deps.ts';
import { Logger } from "./logger.ts";
import { misc } from "./misc.ts";

/** Systems */
import { FileSystem } from "./systems/file.ts";
import { AcesSystem } from "./systems/aces.ts";
import { MetadataSystem } from "./systems/metadata.ts";
import { LanguageSystem } from "./systems/language.ts";
import { RegistererSystem } from "./systems/registerer.ts";
import { DeclarationsSystem } from "./systems/declarations.ts";
import { Addon } from "./config.ts";


export type BuildOptions = {
    /**
     * *Optional* Folder name of the addon project
     * @default 'src'
     */
    readonly root?: string;

    readonly serve?: true,

    readonly watch?: true,
    /** *Optional*. Bundler options. Will be used in every script/module addon file */
    readonly bundler?: bundler.BundleOptions;
    /** *Optional*. ES Build options */
    readonly esbuild?: esbuild.BuildOptions;
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
    if (!(await misc.isDirectoryExists(PATHS.BUILD))) return;

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
    TYPES: path.join(Deno.cwd(), 'types'),
    ROOT: (folderName: string = 'src') => path.join(Deno.cwd(), folderName),
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

async function build(config: Addon, opts: BuildOptions) {
    const { watch, bundler } = opts;

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

            logger.logBetweenLines('🚀 Starting build process...');

            await file.createFolders(['c3runtime'], ['lang']);

            // await config.loadCategories();
            // await config.loadScripts();
            // await config.loadModules();

            // await declarations.createFile(config);

            /** en-US.json */
            // await file.createFile(
            //     ['lang', 'en-US.json'],
            //     JSON.stringify(language.createJson(config), null, 2)
            // );

            // /** addon.json */
            // await file.createFile(
            //     ['addon.json'],
            //     JSON.stringify(metadata.createJson(config), null, 2)
            // );

            // /** aces.json */
            // await file.createFile(
            //     ['aces.json'],
            //     JSON.stringify(aces.createJson(config.allCategories()), null, 2)
            // );

            /** c3runtime/categories.js */
            // let categoriesContent = '';
            // for (const category of config.allCategories()) {
            //     const patterns = [
            //         /static\s*{[\s\S]*?}\s*constructor\s*\([^)]*\)\s*{[\s\S]*?}/g,
            //         /static\s*{\s*_initClass\(\);\s*}/g
            //     ];

            //     let classContent = category.target.toString();

            //     for (const pattern of patterns) {
            //         classContent = classContent.replace(pattern, '');
            //     }

            //     categoriesContent += `export const ${category.id} = new ${classContent};`
            // }
            // await file.createFile(['c3runtime', 'categories.js'], categoriesContent);

            /** c3runtime/main.js */
            // await file.createFile(['c3runtime', 'main.js'], `
            //     import './${config.type}.js';
            //     import './type.js';
            //     import './instance.js';
            //     import './actions.js';
            //     import './conditions.js';
            //     import './expressions.js';
            // `);


            /** Zip all */
            // await file.zipAll(`${config.info.id}-${config.info.version}`);
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
            const watcher = Deno.watchFs(PATHS.ROOT(opts.root));

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
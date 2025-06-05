import { misc } from './misc.ts';
import {
    bundler,
    esbuild,
    path,
    glob,
    fs
} from "./deps.ts";

type BuildOptions = {
    /**
     * *Optional* Folder name of the addon project
     * @default 'src'
     */
    readonly root?: string;
    /** If true, the web-server will be run for testing addon inside Construct 3 */
    readonly serve?: true;
    /** If true, Deno.watchFs() will be run for hot-reload */
    readonly watch?: true;
    /** Custom bundler options */
    readonly bundle?: bundler.BundleOptions;
    /** ESBuild custom options */
    readonly esbuild?: esbuild.BuildOptions;
}

type DenoJson = {
    name: string;
    importMap?: `${string}.json`;
    imports?: bundler.ImportMap['imports'];
}

function loadDenoJson() {
    return new Promise<DenoJson>((resolve, reject) => {
        try {
            const denoJson = JSON.parse(Deno.readTextFileSync(
                path.join(Deno.cwd(), 'deno.json')
            )) as DenoJson;

            resolve(denoJson);
        } catch (e) {
            throw new Error(`'deno.json' was not found at current directory! Reason: ${e}`);
        }
    });
}

function getDenoImports(denoJson: DenoJson) {
    return new Promise<bundler.ImportMap>((resolve, reject) => {
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

async function bundleAllFiles(opts: bundler.BundleOptions, rootPath: string, buildPath: string) {
    if (!(await misc.isDirectoryExists(rootPath))) {
        throw new Error(`Root directory was not found at path: ${rootPath}`);
    }
    const readDir = async (_path: string) => {
        for await (const entry of Deno.readDir(_path)) {
            if (entry.isDirectory) {
                await readDir(path.join(_path, entry.name));
            } else if (entry.isFile) {
                if (
                    (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts'))
                ) {
                    const { code } = await bundler.bundle(path.join(_path, entry.name), opts);

                    await Deno.writeTextFile(path.join(buildPath, entry.name.replace('.ts', '.js')), code);
                } else {

                }
            }
        }
        // bundler.bundle
    }

    await readDir(rootPath);
}

let denoJson: DenoJson | null = null;
let importsMap: bundler.ImportMap | null = null;

let building: boolean = false;
let rebuildTimeout: number;

let startTime: number;
let endTime: number;
let buildsCount: number = 0;

export async function build(opts?: BuildOptions) {
    const rootFolder = opts?.root || 'src';

    try {
        const start = async () => {
            /** Load deno.json */
            denoJson = await loadDenoJson();
            importsMap = await getDenoImports(denoJson);

            startTime = performance.now();
            building = true;

            await run();

            building = false;
            endTime = performance.now();
            buildsCount++;

            /** 
             * Build time in seconds
             * @example 0.4s 
             */
            const buildTime = (endTime - startTime) / 1000;
            const buildDate = new Date().toISOString().replace('T', ' - ');

            // console.log(
            //     // '✅', `Addon [${config.info.id}] has been ${colors.green('successfully')} built`,
            //     '\n⏱️ ', `Build time: ${colors.bold(colors.yellow(`${((endTime - startTime) / 1000).toFixed(2)}`))}s | [${colors.bold(new Date().toISOString().replace('T', ' - '))}]`
            // );

            if (opts && opts.watch) {
                console.log('Watching for file changes...\n');
            } else {
                Deno.exit();
            }
        }

        const run = async () => {
            if (!importsMap) return;

            await misc.clearDirectory(path.join(Deno.cwd(), 'build'));

            // await bundleAllFiles(
            //     opts?.bundle || {

            //     },
            //     path.join(Deno.cwd(), rootFolder),
            //     path.join(Deno.cwd(), 'build')   
            
            // )

            const copyPlugin = {
                name: 'copy-assets',
                setup(build: esbuild.PluginBuild) {
                    build.onEnd(() => {
                        // Находим все SVG файлы в исходной директории
                        const svgFiles = glob.sync(`${rootFolder}/**/*.svg`);

                        svgFiles.forEach(file => {
                            const relativePath = path.relative(rootFolder, file);
                            const outputPath = path.join('build', relativePath);
                            const outputDir = path.dirname(outputPath);

                            // Создаем директории, если они не существуют
                            if (!fs.existsSync(outputDir)) {
                                fs.mkdirSync(outputDir, { recursive: true });
                            }

                            // Копируем файл
                            fs.copyFileSync(file, outputPath);
                            console.log(`Copied: ${file} -> ${outputPath}`);
                        });
                    });
                }
            };

            const entryPoints = glob.sync(`${path.join(Deno.cwd(), rootFolder)}/**/*.ts`, {
                ignore: [`${rootFolder}/**/*.d.ts`] // Игнорировать все .d.ts файлы
            });

            esbuild.build({
                target: ['es2022'],

                ...opts?.esbuild,

                entryPoints,
                outdir: 'build',
                bundle: false,
                format: 'esm',
                platform: 'browser',
                plugins: [copyPlugin]
            })
            .then(() => esbuild.stop())
            .catch()
            /**
             * Main function for bundling and building addon files 
             */
        }

        await start();

        if (opts && opts.watch) {
            const watcher = Deno.watchFs(
                path.join(Deno.cwd(), rootFolder)
            );

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
import type { AddonBareBonesType, AddonType } from "./types/index.ts";
import { cloneRepo, isFileExists } from "../shared/misc.ts";
import { Links } from "../shared/links.ts";
import { Logger } from "../shared/logger.ts";
import { Colors, DenoJSON, join } from "../deps.ts";
import { Paths, ProjectPaths } from "../shared/paths.ts";
import { Mime, MimeType } from "../shared/mime.ts";
import { AddonBuilder } from "./addon/builder.ts";
import { AddonFileManager } from "./addon/file-manager.ts";
import type { LostConfig } from "./lost-config.ts";
import { LostCompiler } from "./lost-compiler.ts";
import type { DenoJson } from "../shared/deno-json.ts";

let rebuildTimeout: number | undefined;

type BuildOptions = {
    /** Runs continious build */
    readonly watch: boolean;
    /** If *true*, all addon files will be minified */
    readonly minify: boolean;
}

type ServeOptions = {
    /** Server port */
    readonly port: number;
}

export type CreateOptions = {
    /** Bare Bones type for empty addon project */
    readonly bareBonesType: AddonBareBonesType;
    /** The path where the new project will be created */
    readonly path: string;
}

type UpdateOptions = {
    /** If *true* construct types will be updated */
    readonly constructTypes: boolean;
    /** If *true* addon base will be updated */
    readonly addonBase: boolean;
}

type AddonBaseMetadata = {
    /** Where the 'addon_base' was downloaded from */
    readonly download_url: string;
    /** Addon type */
    readonly addon_type: AddonType;
    /** Lost framework version */
    readonly version: string;
    /** The timestamp when it was downloaded */
    readonly timestamp: number;
}

type ClearBuildsTarget =
    | 'all' 
    | 'except-current'
;

export abstract class LostProject {
    static buildOptions: BuildOptions = {
        watch: false,
        minify: false,
    };

    /** Options for UglifyJS  */
    static readonly minifyOptions: {
        mangle: {
            toplevel: boolean,
        },
        nameCache: {}
    }


    static async init(opts: BuildOptions) {
        this.buildOptions = opts;

        const denoJson: DenoJson = JSON.parse(await Deno.readTextFile(Paths.DenoJsonFile));

        LostCompiler.init(denoJson);
    }

    /** Starting addon build */
    static async build() {
        if (!this.buildOptions.watch) {
            await AddonBuilder.start();
            await AddonFileManager.createZip();
            Deno.exit(1);
        } else {
            await this.#buildAndWatch();
        }
    }

    /** Starting addon build with watcher for files changes */
    static async #buildAndWatch() {
        const watcher = Deno.watchFs([
            Paths.Addon,
            'addon.ts',
            'lost.config.ts'
        ]);

        await AddonBuilder.start();

        for await (const event of watcher) {
            if (event.kind === 'modify') {
                for (const path of event.paths) {
                    const mimeType = Mime.getFileType(path);

                    if (mimeType) {

                        if (!rebuildTimeout) {
                            clearTimeout(rebuildTimeout);
                        }

                        rebuildTimeout = setTimeout(async () => {
                            await AddonBuilder.start();
                        }, 500);
                    }
                }
            }
        }
    }

    /** Starting server with addon files */
    static async serve(opts: ServeOptions) {
        const config = await this.getLostConfig();

        Paths.updateBuildPath(
            `${config.addonId}_${config.version}`
        );

        const getContentType = (filePath: string): string | undefined => {
            const extension = filePath.split('.').pop();
            const contentTypes: { [key: string]: string } = {
                "js": MimeType.JS,
                "css": MimeType.CSS,
                "json": MimeType.JSON,
                "png": MimeType.PNG,
                "jpg": MimeType.JPEG,
                "jpeg": MimeType.JPEG,
                "gif": MimeType.GIF,
                "svg": MimeType.SVG,
                "txt": MimeType.TXT,
            };
            return contentTypes[extension || ""];
        }

        const handler = async (req: Request): Promise<Response> => {
            Logger.Clear();
            try {
                const url = new URL(req.url);
                // let filePath = url.pathname;
                let filePath = join(Paths.Build, url.pathname);

                try {
                    const fileInfo = await Deno.stat(filePath);
                    if (fileInfo.isDirectory) {
                        filePath = `${filePath}/index.html`;
                    }
                } catch {
                    // Logger.Error('serve', `File [${Colors.dim(url.pathname)}] not found`)
                    return new Response(`File not found`, { status: 404 });
                }

                const file = await Deno.readFile(filePath);
                const contentType = getContentType(filePath) || 'application/octet-stream';

                Logger.Log(
                    `📃 Sent file from path: "${Colors.yellow(url.pathname)}"`
                )
                Logger.Info(`${Colors.magenta(Colors.bold(`--> http://localhost:${opts.port}/addon.json <--`))}`);
                return new Response(file, {
                    status: 200,
                    headers: {
                        "Content-Type": contentType,
                        "Access-Control-Allow-Origin": '*',
                    },
                });
            } catch (_e) {
                return new Response("Internal Server Error", { status: 500 });
            }
        }

        Deno.serve({
            port: opts.port,
            onListen() {
                Logger.Clear();
                //${Colors.magenta(Colors.bold(`--> http://localhost:${opts.port}/addon.json <--`))}
                Logger.Log(
                    '🌐', `${Colors.bold('Development server started!')}`
                )
                Logger.Info(`${Colors.magenta(Colors.bold(`--> http://localhost:${opts.port}/addon.json <--`))}`)
                /** */ Logger.Line();
                Logger.Log(Colors.italic(`1. Click on "Menu" > "View" > "Addon manager"`));
                Logger.Log(Colors.italic(`2. Click on "Add dev addon". `));
                /** */ Logger.Line();
                Logger.Info(`How to enable Developer Mode:\nhttps://www.construct.net/br/make-games/manuals/addon-sdk/guide/using-developer-mode`);
            }
        }, handler)
    }

    /** Creates new empty **Lost** project structure */
    static async create(opts: CreateOptions) {
        Logger.Process(`Creating empty project for ${Colors.magenta(`"${opts.bareBonesType}"`)} addon`);
        await cloneRepo(Links.BareBones[opts.bareBonesType], opts.path);
        await this.installConstructTypes();

        if (
            opts.bareBonesType === 'plugin' ||
            opts.bareBonesType === 'drawing-plugin'
        ) {
            await this.downloadAddonBase('plugin');
        } else if (opts.bareBonesType === 'behavior') {
            await this.downloadAddonBase('behavior');
        }
    }

    /** Updates addon base and *construct.d.ts* files */
    static async update(opts: UpdateOptions) {
        if (opts.addonBase) {
            try {
                const config = await this.getLostConfig();
                await this.downloadAddonBase(config.type);
            } catch (_e) {
                Logger.Error('cli', `Can't update addon base, "${ProjectPaths.LostConfigFile}" file not found`);
            }
        }
        if (opts.constructTypes) {
            await this.installConstructTypes();
        }
    }

    /** Downloads addon base */
    static async downloadAddonBase(addonType: AddonType) {
        Logger.Log(`🌐 Downloading addon base ...`);
        await Deno.mkdir(Paths.AddonBase, { recursive: true });

        const response = await fetch(Links.AddonBase[addonType]);

        if (!response.ok) {
            Logger.Error('cli', 'Error while fetching addon base', `Status: ${response.statusText}`);
            Deno.exit(1);
        }

        const fileContent = await response.text();

        const metadata: AddonBaseMetadata = {
            download_url: Links.AddonBase[addonType],
            addon_type: addonType,
            version: DenoJSON.version,
            timestamp: Date.now()
        }

        await Deno.writeTextFile(Paths.AddonBaseMetadataFile, JSON.stringify(metadata, null, 4));
        await Deno.writeTextFile(join(Paths.AddonBaseFile), fileContent);

        Logger.Success(Colors.bold(`${Colors.green('Successfully')} installed addon base`));
    }

    /** Installing *construct.d.ts* file with global types */
    static async installConstructTypes() {
        try {
            const response = await fetch(Links.ConstructTypes)

            if (!response.ok) {
                Logger.Error('cli', 'Error while installing "construct.d.ts" file', `Status: ${response.statusText}`);
                Deno.exit(1);
            }

            const fileContent = await response.text();
            await Deno.writeTextFile(Paths.ConstructTypesFile, fileContent);

            Logger.Success(Colors.bold(`${Colors.green('Successfully')} installed construct types`));
        } catch (e) {
            Logger.Error('cli', 'Error while installing construct types file', `Error: ${e}`);
            Deno.exit(1);
        }
    }

    /** Checks for addon base */
    static async checkAddonBaseExists(addonType: AddonType) {
        if (
            await isFileExists(Paths.AddonBaseFile) &&
            await isFileExists(Paths.AddonBaseMetadataFile)
        ) {
            const metadata: AddonBaseMetadata = JSON.parse(await Deno.readTextFile(Paths.AddonBaseMetadataFile));

            if (metadata.version !== DenoJSON.version) {
                this.downloadAddonBase(addonType);
            }
        } else {
            this.downloadAddonBase(addonType);
        }
    }

    /** Deleted all addon builds folders from *builds* folder */
    static async clearBuilds(target: ClearBuildsTarget) {
        Logger.Log(`🗑 Deleting addon builds folders ...`);
        const config = await this.getLostConfig();

        for await (const entry of Deno.readDir(Paths.Builds)) {
            if (entry.isDirectory) {
                if (target === 'all') {
                    await Deno.remove(join(Paths.Builds, entry.name), { recursive: true });
                } else if (target === 'except-current') {
                    if (entry.name !== `${config.addonId}_${config.version}`) {
                        await Deno.remove(join(Paths.Builds, entry.name), { recursive: true });
                    }
                }
            }
        }

        Logger.Success(Colors.bold(`${Colors.green('Successfully')} deleted all addon builds`));
    }

    static async getLostConfig() {
        try {
            const config: LostConfig = (await import(Paths.LostConfigFile)).default;
            return config;
        } catch {
            Logger.Error('cli', `"${ProjectPaths.LostConfigFile}" file not found`);
            Deno.exit(1);
        }
    }
}
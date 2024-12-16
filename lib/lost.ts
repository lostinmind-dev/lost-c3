import DenoJson from '../deno.json' with { type: "json" };
import { dedent, isDirectoryExists, isFileExists } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";
import {
    type IAddonIconFile, type IAddonModuleScriptFile, type IAddonScriptFile,
    type ICopyToOutputAddonFile, type IExternalCSSAddonFile, MimeType, type AddonFile,
    type IAddonImageFile, AddonFileDependencyType, type AddonIconFileName, 
    type AddonImageFileName
} from "../shared/types/AddonFile.ts";
import { Logger } from "../shared/logger.ts";
import { Colors, join } from "../deps.ts";
import type { Addon } from "./addon.ts";
import { AddonCategoriesManager } from "./managers/categories-manager.ts";
import { MIME } from "../shared/mime.ts";
import { AddonFileManager } from "./managers/addon-file-manager.ts";
import { EditorScriptType, JsonFileType, RuntimeScriptType } from "../shared/paths/addon-files.ts";
import { ProjectFolders } from "../shared/paths/project-folders.ts";
import { transpileTs } from "../shared/transpile-ts.ts";
import Icon from "./defaults/addon-icon.ts";
import { LostAddonData } from "./LostAddonData.ts";
import type { AddonBaseMetadata } from "../shared/types/index.ts";
import { AddonType } from "./config.ts";

type BuildOptions = {
    readonly watch: boolean;
    readonly minify: boolean;
}

export abstract class LostAddonProject {
    static buildOptions: BuildOptions;
    static addon: Addon<any, any, any, any>;
    static iconName: AddonIconFileName;
    static defaultImageName: AddonImageFileName;

    static async downloadAddonBase(addonType: AddonType) {
        Logger.Log(`🌐 Downloading addon base ...`);

        await Deno.mkdir(join(Paths.Root, '.addon_base'), { recursive: true });

        const response = await fetch(Paths.Links.AddonBase[addonType]);

        if (!response.ok) {
            Logger.Error('build', 'Error while getting addon base', `Status: ${response.statusText}`);
            Deno.exit(1);
        }

        const fileContent = await response.text();

        const metadata: AddonBaseMetadata = {
            download_url: Paths.Links.AddonBase[addonType],
            addon_type: addonType,
            version: DenoJson.version,
            timestamp: Date.now()
        }

        await Deno.writeTextFile(join(Paths.ProjectFolders.AddonBase, 'metadata.json'), JSON.stringify(metadata, null, 4));
        await Deno.writeTextFile(Paths.ProjectFiles.getAddonBasePath(addonType), fileContent);
        Logger.Success(Colors.bold(`${Colors.green('Successfully')} installed addon base!`));
    }

    static async checkAddonBaseExists() {
        const addonType = this.addon._config.type;

        try {
            const dirStat = await Deno.stat(Paths.ProjectFiles.getAddonBasePath(addonType));

            if (dirStat) {
                const fileContent = await Deno.readTextFile(join(Paths.ProjectFolders.AddonBase, 'metadata.json'));
                const metadata: AddonBaseMetadata = JSON.parse(fileContent);

                if (metadata.version !== DenoJson.version) {
                    await this.downloadAddonBase(addonType);
                }
            }

        } catch (_e) {
            await this.downloadAddonBase(addonType);
        }
    }

    static getLostAddonData(): string {
        if (this.buildOptions.minify) {
            return JSON.stringify(new LostAddonData());
        } else {
            return JSON.stringify(new LostAddonData(), null, 4);
        }
    }

    static serve(port: number) {
        Logger.Line();
        Logger.Log('🌐', 'Starting addon server...');

        const getContentType = (filePath: string): string | undefined => {
            const extension = filePath.split('.').pop();
            const contentTypes: { [key: string]: string } = {
                "js": "application/javascript",
                "css": "text/css",
                "json": "application/json",
                "png": "image/png",
                "jpg": "image/jpeg",
                "jpeg": "image/jpeg",
                "gif": "image/gif",
                "svg": "image/svg+xml",
                "txt": "text/plain",
            };
            return contentTypes[extension || ""];
        }

        const handler = async (req: Request): Promise<Response> => {

            try {
                const url = new URL(req.url);
                // let filePath = url.pathname;
                let filePath = join(Paths.ProjectFolders.Build, url.pathname);

                try {
                    const fileInfo = await Deno.stat(filePath);
                    if (fileInfo.isDirectory) {
                        filePath = `${filePath}/index.html`;
                    }
                } catch {
                    Logger.Error('serve', 'File not found')
                    return new Response("File not found", { status: 404 });
                }

                const file = await Deno.readFile(filePath);
                const contentType = getContentType(filePath) || 'application/octet-stream';

                Logger.LogBetweenLines(
                    `📃 Sent file from path: "${Colors.yellow(url.pathname)}"`
                )
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
            port,
            onListen() {
                Logger.Log(
                    '✅',
                    `${Colors.bold('Server running!')} ${Colors.magenta(Colors.bold(`--> http://localhost:${port}/addon.json <--`))}`
                )
            }
        }, handler)
    }

    static async build(opts: BuildOptions) {
        await AddonFileManager.clear();
        this.buildOptions = opts;
        const startTime = performance.now();

        Logger.Clear();
        Logger.LogBetweenLines('🚀 Starting build process...');

        this.addon = await this.#getAddonModule();

        await this.checkAddonBaseExists();

        this.addon._files.push(
            ...await this.#getAllFiles()
        );
        this.addon._categories.push(
            ...await AddonCategoriesManager.getCategories()
        );

        await this.#createAddon();

        const elapsedTime = (performance.now()) - startTime;
        Logger.LogBetweenLines(
            '✅', `Addon [${Colors.yellow(LostAddonProject.addon._config.addonId)}] has been ${Colors.green('successfully')} built`,
            '\n⏱️ ', `Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`
        );

        if (opts.watch) {
            Logger.Log(
                '\n👀', Colors.blue('Watching for file changes...\n')
            );
        } else {
            Deno.exit(1);
        }
    }

    static async #getAddonModule() {
        return (
            await import(`${Paths.ProjectFiles.AddonModule}?t=${Date.now()}`)
        ).default as Addon<any, any, any, any>;
    }

    static async #getAllFiles(): Promise<AddonFile[]> {
        const icon = await this.#getIcon();
        const defaultImage = await this.#getDefaultImage();

        const files: AddonFile[] = [
            ...await this.#getScripts(),
            ...await this.#getModuleScripts(),
            ...await this.#getFiles()
        ];

        if (icon) files.push(icon);
        if (defaultImage) files.push(defaultImage);

        return files;
    }

    static async #getIcon(): Promise<IAddonIconFile | null> {
        if (await isFileExists(join(Paths.Root, 'icon.svg'))) {
            this.iconName = 'icon.svg';
            return {
                type: 'icon',
                name: 'icon.svg',
                path: Paths.Root,
                iconType: MimeType.SVG
            }
        } else if (await isFileExists(join(Paths.Root, 'icon.png'))) {
            this.iconName = 'icon.png'
            return {
                type: 'icon',
                name: 'icon.png',
                path: Paths.Root,
                iconType: MimeType.SVG
            }
        } else {
            return null;
            /**
             * User icon not found
             */
        }
    }

    static async #getDefaultImage(): Promise<IAddonImageFile | null> {
        if (await isFileExists(join(Paths.Root, 'default.png'))) {
            return {
                type: 'image',
                name: 'default.png',
                path: Paths.Root,
            }
        } else {
            return null;
            /**
             * User icon not found
             */
        }
    }

    static async #getScripts(): Promise<IAddonScriptFile[]> {
        const files: IAddonScriptFile[] = [];

        if (await isDirectoryExists(Paths.ProjectFolders.Scripts)) {
            Logger.LogBetweenLines(Colors.bgYellow('Loading scripts...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        this.#isFileTSOrJS(entry.name)
                    ) {
                        files.push({
                            type: 'script',
                            name: entry.name,
                            path,
                            isTypescript: (entry.name.endsWith('.js')) ? false : true,
                            dependencyType: AddonFileDependencyType.ExternalDomScript
                        })
                    }
                }
            }

            await readDir(Paths.ProjectFolders.Scripts)
        }

        return files;
    }

    static async #getModuleScripts(): Promise<IAddonModuleScriptFile[]> {
        const files: IAddonModuleScriptFile[] = [];

        if (await isDirectoryExists(Paths.ProjectFolders.Modules)) {
            Logger.LogBetweenLines(Colors.bgBlue('Loading modules...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (
                        entry.isFile &&
                        this.#isFileTSOrJS(entry.name)
                    ) {
                        files.push({
                            type: 'module-script',
                            name: entry.name,
                            path,
                            isTypescript: (entry.name.endsWith('.js')) ? false : true
                        })
                    }
                }
            }

            await readDir(Paths.ProjectFolders.Modules)
        }

        return files;
    }

    static async #getFiles(): Promise<(ICopyToOutputAddonFile | IExternalCSSAddonFile)[]> {
        const files: (ICopyToOutputAddonFile | IExternalCSSAddonFile)[] = [];

        if (await isDirectoryExists(Paths.ProjectFolders.Files)) {
            Logger.LogBetweenLines(Colors.bgGreen('Loading files...'));

            const readDir = async (path: string) => {
                for await (const entry of Deno.readDir(path)) {
                    if (entry.isDirectory) {
                        await readDir(join(path, entry.name));
                    } else if (entry.isFile) {

                        const dependencyType = (entry.name.endsWith('.css')) ? AddonFileDependencyType.ExternalCSS : AddonFileDependencyType.CopyToOutput;

                        if (dependencyType === 'copy-to-output') {
                            const mimeType = MIME.getFileType(entry.name);

                            if (mimeType) {
                                files.push({
                                    type: 'file',
                                    name: entry.name,
                                    path,
                                    dependencyType,
                                    mimeType
                                })
                            } else {
                                Logger.Warning(
                                    dedent`
                                        Found 'copy-to-output' file (${entry.name}) with unknown MIME type.
                                        File will not be included in final addon build'
                                        ${'https://www.construct.net/en/make-games/manuals/construct-3/tips-and-guides/mime-types'}`
                                );
                            }
                        } else if (dependencyType === 'external-css') {
                            files.push({
                                type: 'file',
                                name: entry.name,
                                path,
                                dependencyType: AddonFileDependencyType.ExternalCSS
                            })
                        }
                    }
                }
            }

            await readDir(Paths.ProjectFolders.Files);
        }

        return files;
    }

    static #isFileTSOrJS(fileName: string) {
        if (
            (fileName.endsWith('.ts') && !fileName.endsWith('.d.ts')) ||
            fileName.endsWith('.js')
        ) {
            return true;
        } else {
            return false;
        }
    }

    static async #createAddon() {
        await this.#createAddonStructure();
        await this.#createC3RuntimeFiles();
        await this.#createC3EditorFiles();
        await this.#createC3JsonFiles();

        if (!this.buildOptions.watch) {
            await AddonFileManager.createZip();
        }
    }

    static async #createAddonStructure() {

        await Deno.mkdir(Paths.ProjectFolders.Build);
        await Deno.mkdir(Paths.AddonFolders.Runtime);
        await Deno.mkdir(Paths.AddonFolders.Lang)

        await this.#copyUserIcon();
        if (
            this.addon._config.type === 'plugin' &&
            this.addon._config.pluginType === 'world'
        ) {
            await this.#copyDefaultImage();
        }
        await this.#copyUserFiles();
        await this.#copyUserScripts();
        await this.#copyUserModules();
    }

    static async #copyUserIcon() {
        const files = this.addon._files.filter(file => file.type === 'icon');

        if (files.length === 1) {
            const icon = files[0];
            await Deno.copyFile(join(icon.path, icon.name), join(Paths.AddonFolders.Root, icon.name));
        } else {
            await Deno.writeTextFile(join(Paths.AddonFolders.Root, 'icon.svg'), Icon())
        }
    }

    static async #copyDefaultImage() {
        const files = this.addon._files.filter(file => file.type === 'image');

        if (files.length === 1) {
            const image = files[0];
            this.defaultImageName = image.name;
            await Deno.copyFile(join(image.path, image.name), join(Paths.AddonFolders.Root, image.name));
        } else {
            return;
        }
    }

    static async #copyUserFiles() {
        const files = this.addon._files.filter(file => file.type === 'file');

        if (files.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.Files);

            files.forEach(async file => {
                const path = join(
                    Paths.AddonFolders.Files,
                    ...Paths.getFoldersAfterFolder(file.path, ProjectFolders.Files)
                )

                await Deno.mkdir(path, { recursive: true });
                await Deno.copyFile(join(file.path, file.name), join(path, file.name));
            })
        }
    }

    static async #copyUserScripts() {
        const files = this.addon._files.filter(file => file.type === 'script');

        if (files.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.Scripts);

            files.forEach(async file => {
                const path = join(
                    Paths.AddonFolders.Scripts,
                    ...Paths.getFoldersAfterFolder(file.path, ProjectFolders.Scripts)
                )

                if (file.isTypescript) {
                    const fileContent = await transpileTs(join(file.path, file.name)) || '';

                    await Deno.mkdir(path, { recursive: true });
                    await Deno.writeTextFile(join(path, file.name), fileContent);
                } else {
                    await Deno.mkdir(path, { recursive: true });
                    await Deno.copyFile(join(file.path, file.name), join(path, file.name.replace('.ts', '.js')));
                }
            })
        }
    }

    static async #copyUserModules() {
        const files = this.addon._files.filter(file => file.type === 'module-script');

        if (files.length > 0) {
            await Deno.mkdir(Paths.AddonFolders.Modules);

            files.forEach(async file => {
                const path = join(
                    Paths.AddonFolders.Modules,
                    ...Paths.getFoldersAfterFolder(file.path, ProjectFolders.Modules)
                )

                if (file.isTypescript) {
                    const fileContent = await transpileTs(join(file.path, file.name)) || '';

                    await Deno.mkdir(path, { recursive: true });
                    await Deno.writeTextFile(join(path, file.name.replace('.ts', '.js')), fileContent);
                } else {
                    await Deno.mkdir(path, { recursive: true });
                    await Deno.copyFile(join(file.path, file.name), join(path, file.name.replace('.ts', '.js')));
                }
            })
        }
    }

    static async #createC3RuntimeFiles() {
        switch (this.addon._config.type) {
            case 'plugin':
                await AddonFileManager.createRuntimeScript(RuntimeScriptType.Plugin);
                break;
            case 'behavior':
                await AddonFileManager.createRuntimeScript(RuntimeScriptType.Behavior);
                break;
        }

        await AddonFileManager.createRuntimeScript(RuntimeScriptType.Instance);
        await AddonFileManager.createRuntimeScript(RuntimeScriptType.Type);

        await AddonFileManager.createRuntimeScript(RuntimeScriptType.Actions);
        await AddonFileManager.createRuntimeScript(RuntimeScriptType.Conditions);
        await AddonFileManager.createRuntimeScript(RuntimeScriptType.Expressions);

        const moduleFiles = this.addon._files.filter(file => file.type === 'module-script');
        if (moduleFiles.length > 0) {
            await AddonFileManager.createRuntimeScript(RuntimeScriptType.Module);
        }
    }

    static async #createC3EditorFiles() {
        await AddonFileManager.createEditorScript(EditorScriptType.Type);
        await AddonFileManager.createEditorScript(EditorScriptType.Instance);

        switch (this.addon._config.type) {
            case "plugin":
                await AddonFileManager.createEditorScript(EditorScriptType.Plugin);
                break;
            case "behavior":
                await AddonFileManager.createEditorScript(EditorScriptType.Behavior);
                break;
        }
    }

    static async #createC3JsonFiles() {
        await AddonFileManager.createJson(JsonFileType.Language);
        await AddonFileManager.createJson(JsonFileType.Aces);
        await AddonFileManager.createJson(JsonFileType.AddonMetadata);
    }
}
import { dedent, isDirectoryExists, isFileExists } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";
import { IAddonIconFile, IAddonModuleScriptFile, IAddonScriptFile, ICopyToOutputAddonFile, IExternalCSSAddonFile, MimeType, type AddonFile } from "../shared/types/AddonFile.ts";
import { Logger } from "../shared/logger.ts";
import { Colors, join } from "../deps.ts";
import type { Addon } from "./new-addon.ts";
import { AddonCategoriesManager } from "./managers/categories-manager.ts";
import { MIME } from "../shared/mime.ts";
import { AddonFileManager } from "./managers/addon-file-manager.ts";
import { EditorScriptType, JsonFileType, RuntimeScriptType } from "../shared/paths/addon-files.ts";
import { ProjectFolders } from "../shared/paths/project-folders.ts";
import { transpileTs } from "../shared/transpile-ts.ts";
import checkAddonBaseExists from "../cli/check-addon-base-exists.ts";


type BuildOptions = {
    readonly watch: boolean;
    readonly minify: boolean;
}

export abstract class LostAddonProject {
    static addon: Addon;
    static buildOptions: BuildOptions;

    static async build(opts: BuildOptions) {
        this.buildOptions = opts;
        this.addon = await this.#getAddonModule();

        await checkAddonBaseExists();
        
        this.addon._files.push(
            ...await this.#getAllFiles()
        );
        this.addon._categories.push(
            ...await AddonCategoriesManager.getCategories()
        );

        this.#createAddon();
    }

    static async #getAddonModule() {
        return (await import(`${Paths.ProjectFiles.AddonModule}?t=${Date.now()}`)).default as Addon;
    }

    static async #getAllFiles(): Promise<AddonFile[]> {
        const icon = await this.#getIcon();
        const files: AddonFile[] = [
            ...await this.#getScripts(),
            ...await this.#getModuleScripts(),
            ...await this.#getFiles()
        ];

        if (icon) files.push(icon);

        return files;
    }

    static async #getIcon(): Promise<IAddonIconFile | null> {
        if (await isFileExists(join(Paths.Root, 'icon.svg'))) {
            return {
                type: 'icon',
                name: 'icon.svg',
                path: join(Paths.Root, 'icon.svg'),
                iconType: MimeType.SVG
            }
        } else if (await isFileExists(join(Paths.Root, 'icon.png'))) {
            return {
                type: 'icon',
                name: 'icon.png',
                path: join(Paths.Root, 'icon.png'),
                iconType: MimeType.SVG
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
                            dependencyType: 'external-dom-script'
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

                        const dependencyType = (entry.name.endsWith('.css')) ? 'external-css' : 'copy-to-output';

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
                                dependencyType: 'external-css'
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
    }

    static async #createAddonStructure() {
        if (await isDirectoryExists(Paths.ProjectFolders.Build)) {
            await Deno.remove(Paths.ProjectFolders.Build, { recursive: true });
        }

        await Deno.mkdir(Paths.ProjectFolders.Build);
        await Deno.mkdir(Paths.AddonFolders.Runtime);
        await Deno.mkdir(Paths.AddonFolders.Lang)

        await this.#createIcon();
        if (
            this.addon._config.type === 'plugin' &&
            this.addon._config.pluginType === 'world'
        ) {
            await this.#copyDefaultImageFile();
        }
        await this.#copyUserFiles();
        await this.#copyUserScripts();
        await this.#copyUserModules();
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
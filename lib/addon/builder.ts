import { Colors, join } from "../../deps.ts";
import { LostCompiler } from "../lost-compiler.ts";
import { Logger } from "../../shared/logger.ts";
import { Paths, ProjectPaths } from "../../shared/paths.ts";
import { LostProject } from "../lost-project.ts";
import { AddonFileManager } from "./file-manager.ts";
import { Addon } from "./index.ts";
import { Property } from "../entities/plugin-property.ts";
import { dedent } from "../../shared/misc.ts";

type StartOptions = {

}

export abstract class AddonBuilder {
    static isBuildError: boolean = false;
    static isBuilding: boolean = false;

    /** Starts build system */
    static async start(opts?: StartOptions) {
        if (!this.isBuilding) {
            this.isBuildError = false
            this.isBuilding = true;
            Logger.Clear();

            try {
                const instance = (await import(`${Paths.AddonModuleFile}?t=${Date.now()}`)).default as (Addon);
                Addon.reset();
                await Addon.load(instance);

            } catch (_e) {
                Logger.Error('build', `Main addon module file ${Colors.bold(Colors.dim(ProjectPaths.AddonModuleFile))} not found!`);
                Deno.exit(1);
            }

            const config = Addon.getConfig();

            Paths.updateBuildPath(
                `${config.addonId}_${config.version}`
            );
            
            if (!this.isBuildError) {
                await LostProject.checkAddonBaseExists(config.type);

                await AddonFileManager.clear();

                await this.#createPropertiesDeclaration();

                const startTime = performance.now();
                Logger.LogBetweenLines('🚀 Starting build process...');

                await this.#createAddonFiles();

                const elapsedTime = (performance.now()) - startTime;
                Logger.LogBetweenLines(
                    '✅', `Addon [${Colors.yellow(config.addonId)}] has been ${Colors.green('successfully')} built`,
                    '\n⏱️ ', `Addon build time: ${Colors.bold(Colors.yellow(String(elapsedTime.toFixed(2))))} ms!`
                );

                if (LostProject.buildOptions.watch) {
                    Logger.Log(
                        '\n👀', Colors.blue('Watching for file changes...\n')
                    );
                }
            }

            this.isBuilding = false;
        }
    }

    /** Ends addon builder process and clears final build addon folder */
    static async end() {
        await AddonFileManager.clear();
        Deno.exit(1)
    }

    /** Creates all addon files */
    static async #createAddonFiles() {
        const config = Addon.getConfig();

        await AddonFileManager.createFolders();

        await AddonFileManager.createIcon();

        await this.#createUserFiles();

        await AddonFileManager.createEditorScript('type.js');
        await AddonFileManager.createEditorScript('instance.js');


        if (config.type === 'plugin') {
            await AddonFileManager.createEditorScript('plugin.js');
            await AddonFileManager.createRuntimeScript('plugin.js');
        }

        if (config.type === 'behavior') {
            await AddonFileManager.createEditorScript('behavior.js');
            await AddonFileManager.createRuntimeScript('behavior.js');
        }

        if (Addon.filesCollection.modules.length > 0) {
            await AddonFileManager.createRuntimeScript('main.js');
        }

        await AddonFileManager.createRuntimeScript('type.js');
        await AddonFileManager.createRuntimeScript('instance.js');
        await AddonFileManager.createRuntimeScript('actions.js');
        await AddonFileManager.createRuntimeScript('conditions.js');
        await AddonFileManager.createRuntimeScript('expressions.js');

        await AddonFileManager.createJsonFile('aces.json')
        await AddonFileManager.createJsonFile('en-US.json');
        await AddonFileManager.createJsonFile('addon.json');
    }

    /** Creates all user files */
    static async #createUserFiles() {
        const files = Addon.filesCollection.files;
        const modules = Addon.filesCollection.modules;
        const scripts = Addon.filesCollection.scripts;

        for await (const file of files) {
            if (file.localPath && file.localName) {
                await Deno.copyFile(join(file.path, file.name), join(file.localPath, file.localName));
            }
        }

        for await (const module of modules) {
            if (module.localPath && module.localName) {
                if (!module.isTypescript) {
                    await Deno.copyFile(join(module.path, module.name), join(module.localPath, module.localName));
                } else {
                    const content = LostCompiler.compile(join(module.path, module.name), 'module') || '';
                    await Deno.writeTextFile(join(module.localPath, module.localName), content)
                }
            }
        }

        for await (const script of scripts) {
            if (script.localPath && script.localName) {
                if (!script.isTypescript) {
                    await Deno.copyFile(join(script.path, script.name), join(script.localPath, script.localName));
                } else {
                    const content = LostCompiler.compile(join(script.path, script.name)) || '';
                    await Deno.writeTextFile(join(script.localPath, script.localName), content)
                }
            }
        }

    }

    /** Creates *properties.d.ts* of user plugin properties */
    static async #createPropertiesDeclaration() {
        enum StringPropertyType {
            Boolean = 'boolean',
            Number = 'number',
            String = 'string',
            Color = '[number, number, number]',
            Unknown = 'unknown'
        }
        const properties = Addon.getProperties();

        if (properties.length > 0) {
            const types: string[] = [];

            properties.forEach((property, i) => {
                const type = property.opts.type;

                let symbol: StringPropertyType = StringPropertyType.Unknown;

                if (type !== Property.Group) {
                    switch (property.opts.type) {
                        case Property.Integer:
                            symbol = StringPropertyType.Number
                            break;
                        case Property.Float:
                            symbol = StringPropertyType.Number
                            break;
                        case Property.Percent:
                            symbol = StringPropertyType.Number
                            break;
                        case Property.Text:
                            symbol = StringPropertyType.String
                            break;
                        case Property.LongText:
                            symbol = StringPropertyType.String
                            break;
                        case Property.Checkbox:
                            symbol = StringPropertyType.Boolean
                            break;
                        case Property.Font:
                            symbol = StringPropertyType.String
                            break;
                        case Property.Combo:
                            symbol = StringPropertyType.Number
                            break;
                        case Property.Color:
                            symbol = StringPropertyType.Color
                            break;
                        case Property.Object:
                            symbol = StringPropertyType.Number
                            break;
                        case Property.Info:
                            symbol = StringPropertyType.Unknown
                            break;
                        case Property.Link:
                            symbol = StringPropertyType.Unknown
                            break;
                    }

                    types.push(symbol);
                }
            })

            const content = dedent`
                declare type PluginProperties = [
                    ${types.join(', ')}
                ]
            `

            await Deno.mkdir(Paths.AddonTypes, { recursive: true });

            await Deno.writeTextFile(Paths.PluginPropertiesTypesFile, content);
        }
    }

}
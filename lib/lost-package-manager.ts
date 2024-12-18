import * as esbuild from './esbuild/mod.js';
import { Logger } from '../shared/logger.ts';
import { join, type PackageJson, Colors } from "../deps.ts";
import { isDirectoryExists, isFileExists } from "../shared/misc.ts";
import { Paths } from "../shared/paths.ts";

type FullPackageJson = {
    readonly types?: string;
    readonly typings?: string;
} & PackageJson

type BundleOptions = {
    /** NPM Package name */
    readonly name: string;
    /** If *true* the package will be minified */
    readonly minify?: boolean;
    /** ESBuild format */
    readonly format?: 'esm' | 'cjs' | 'iife';
}

export abstract class LostBundler {
    static #packageName: string;
    static #packagePath: string;
    static #packageJson: FullPackageJson;

    static async bundle(opts: BundleOptions) {
        this.#packageName = opts.name;
        Logger.Loading(`Creating bundle for "${Colors.dim(Colors.bold(this.#packageName))}"`);
        this.#packageJson = await this.#installPackage();

        const entryFile = this.#getEntryFile();

        await this.#copyTypes();

        const outputDir = Paths.AddonModules;

        if (!(await isDirectoryExists(outputDir))) {
            await Deno.mkdir(outputDir, { recursive: true });
        }

        esbuild
            .build({
                entryPoints: [entryFile],
                bundle: true,
                outfile: join(outputDir, `${this.#packageName}.bundle.js`),
                minify: opts.minify || false,
                format: opts.format || 'esm', // Формат для браузера
                // globalName: opts.packageName.replace(/[^a-zA-Z0-9]/g, ''), // Глобальное имя
            })
            .then(async () => {
                Logger.Success(`Bundle successfully created at path: ${Colors.dim(Colors.bold(`Addon/Modules/${this.#packageName}.bundle.js`))}`);
                await this.#clear();
                Deno.exit(0);
            })
            .catch(async (error) => {
                console.error(`Error while creating bundle:`, error);
                await this.#clear();
                Deno.exit(1);
            });
    }

    static #getEntryFile() {
        if (this.#packageJson.main) {
            return join(this.#packagePath, this.#packageJson.main);
        } else {
            Deno.exit(1);
        }

    }

    static async #installPackage() {

        const command = new Deno.Command('npm', {
            args: ['install', this.#packageName],
            stdin: 'inherit',
            stdout: 'inherit'
        })

        const { code, success } = await command.output();

        if (success) {
            this.#packagePath = join(Paths.Root, 'node_modules', this.#packageName);

            if (await isDirectoryExists(this.#packagePath)) {
                const packageJsonPath = join(this.#packagePath, 'package.json');

                if (await isFileExists(packageJsonPath)) {
                    const packageJson: FullPackageJson = JSON.parse(await Deno.readTextFile(packageJsonPath));

                    return packageJson;
                } else {
                    Logger.Error('bundle', `Package 'package.json' does not exist at path: ${this.#packagePath}`);
                    Deno.exit(1);
                }
            } else {
                Logger.Error('bundle', `Package folder not found at path: ${this.#packagePath}`);
                Deno.exit(1);
            }
        } else {
            Logger.Error('bundle', `Package installation failed: ${this.#packageName}`);
            Deno.exit(1);
        }
    }

    static async #copyTypes() {

        const typesFile = this.#packageJson.types || this.#packageJson.typings;
        if (typesFile) {
            const typesPath = join(this.#packagePath, typesFile);
            if (await isFileExists(typesPath)) {

                await Deno.copyFile(
                    typesPath,
                    join(Paths.AddonModules, `${this.#packageName}.bundle.d.ts`)
                )

            }
        }
    }

    static async #clear() {
        await Deno.remove(join(Paths.Root, 'node_modules'), { recursive: true });
        await Deno.remove(join(Paths.Root, 'package.json'), { recursive: true });
        await Deno.remove(join(Paths.Root, 'package-lock.json'), { recursive: true });
    }

}
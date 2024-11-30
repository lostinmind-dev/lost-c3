// deno-lint-ignore-file no-case-declarations
import type { Plugin } from "../lib/plugin.ts";
import type { Behavior } from "../lib/behavior.ts";
import { join } from "../deps.ts";
import { Paths } from "../shared/paths.ts";

import Icon from './defaults/addon-icon.ts';
import { transpileTs } from "../shared/transpile-ts.ts";

export default async function createAddonStructure(addon: Plugin | Behavior) {
    try {
        await Deno.remove(Paths.Build, { recursive : true });
    } catch (e) {
        //return;
    }

    await Deno.mkdir(Paths.Build);
    await Deno.mkdir(join(Paths.Build, 'c3runtime'));
    await Deno.mkdir(join(Paths.Build, 'lang'));

    await copyIcon();

    if (
        addon._type === 'plugin' ||
        addon._type === 'behavior'
    ) {
        await copyUserFiles();
        await copyUserScripts();
        await copyUserModules();
    }

    async function copyIcon() {
        if (
            addon._icon.path !== '-'
        ) {
            await Deno.copyFile(addon._icon.path, join(Paths.Build, addon._icon.fileName));
        } else {
            await Deno.writeTextFile(join(Paths.Build, addon._icon.relativePath), Icon())
        }
    }

    async function copyUserFiles() {
        if (addon._userFiles.length > 0) {
            await Deno.mkdir(join(Paths.Build, 'files'));

            addon._userFiles.forEach(async file => {
                const destinationPath = join(Paths.Build, 'files', file.relativePath);
                const normalizedPath = destinationPath.replace(/\\/g, '/');
                const destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                await Deno.mkdir(destinationDir, { recursive: true });

                await Deno.copyFile(file.path, join(Paths.Build, 'files', file.relativePath));
            })
        }
    }

    async function copyUserScripts() {
        if (addon._userScripts.length > 0) {
            await Deno.mkdir(join(Paths.Build, 'scripts'));

            addon._userScripts.forEach(async file => {
                let destinationPath: string;
                let destinationDir: string;
                let normalizedPath: string;

                switch (file.isTypescript) {
                    case false:
                        destinationPath = join(Paths.Build, 'scripts', file.relativePath);
                        normalizedPath = destinationPath.replace(/\\/g, '/');
                        destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                        await Deno.mkdir(destinationDir, { recursive: true });

                        await Deno.copyFile(file.path, join(Paths.Build, 'scripts', file.relativePath));
                        break;
                    // deno-lint-ignore no-case-declarations
                    case true:
                        const newFilePath = file.relativePath.replace('.ts', '.js');

                        destinationPath = join(Paths.Build, 'scripts', newFilePath);
                        normalizedPath = destinationPath.replace(/\\/g, '/');
                        destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                        await Deno.mkdir(destinationDir, { recursive: true });

                        const fileContent = await transpileTs(file.path) as string || '';
                        await Deno.writeTextFile(join(Paths.Build, 'scripts', newFilePath), fileContent);
                        break;
                }
            })
        }
    }

    async function copyUserModules() {
        if (addon._userModules.length > 0) {
            await Deno.mkdir(join(Paths.Build, 'c3runtime', 'modules'));

            addon._userModules.forEach(async file => {
                let destinationPath: string;
                let destinationDir: string;
                let normalizedPath: string;

                switch (file.isTypescript) {
                    case false:
                        destinationPath = join(Paths.Build, 'c3runtime', 'modules', file.relativePath);
                        normalizedPath = destinationPath.replace(/\\/g, '/');
                        destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));

                        await Deno.mkdir(destinationDir, { recursive: true });

                        await Deno.copyFile(file.path, join(Paths.Build, 'c3runtime', 'modules', file.relativePath));
                        break;
                    // deno-lint-ignore no-case-declarations
                    case true:
                        const newFilePath = file.relativePath.replace('.ts', '.js');

                        destinationPath = join(Paths.Build, 'c3runtime', 'modules', newFilePath);
                        normalizedPath = destinationPath.replace(/\\/g, '/');
                        destinationDir = destinationPath.substring(0, normalizedPath.lastIndexOf('/'));
                    
                        await Deno.mkdir(destinationDir, { recursive: true });
                
                        const fileContent = await transpileTs(file.path) as string || '';

                        await Deno.writeTextFile(join(Paths.Build, 'c3runtime', 'modules', newFilePath), fileContent);
                        break;
                }
            })
        }
    }
}
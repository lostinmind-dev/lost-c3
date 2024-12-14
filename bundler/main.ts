import { Logger, esbuild, execSync, fs, join, path } from "../deps.ts";
import { Paths } from "../shared/paths.ts";

type BundlePackageOptions = {
    readonly type: 'npm' | 'jsr';
    readonly packageName: string;
}
export default async function bundlePackage(opts: BundlePackageOptions) {

    if (opts.type === 'npm') {
        // Logger.Loading(`Bundling NPM package [${Colors.yellow(opts.packageName)}] and adding to project`);

        Logger.Loading(`Installing NPM package: ${opts.packageName}`);

        execSync(`npm install ${opts.packageName}`, { stdio: 'inherit' });

        /** Определение пути к установленной библиотеке */
        const libPath = path.resolve('node_modules', opts.packageName);
        if (!fs.existsSync(libPath)) {
            console.error(`Библиотека ${opts.packageName} не найдена.`);
            Deno.exit(1);
        }

        /** Попытка найти входной файл */
        let entryFile;
        const packageJsonPath = join(libPath, 'package.json');

        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(await Deno.readTextFile(packageJsonPath));

            /** Проверяем `main` или `exports` в package.json */
            entryFile =
                packageJson.main || (packageJson.exports && packageJson.exports['.']) || null;

            if (typeof entryFile === 'object') {
                entryFile = entryFile.require || entryFile.default || null;
            }

            if (entryFile) {
                entryFile = path.resolve(libPath, entryFile);
            }

            const typesPath = packageJson.types || packageJson.typings;
            if (typesPath) {
                const absoluteTypesPath = path.resolve(libPath, typesPath);
                const distTypesPath = join(Paths.ProjectFolders.Modules, `${opts.packageName}.d.ts`);
                if (fs.existsSync(absoluteTypesPath)) {
                    fs.copyFileSync(absoluteTypesPath, distTypesPath);
                    console.log(`Скопированы типы: ${absoluteTypesPath} -> ${distTypesPath}`);
                } else {
                    console.warn(`Типы не найдены по пути: ${absoluteTypesPath}`);
                }
            }
        }

        /** Если entryFile не найден, ищем вручную */
        if (!entryFile || !fs.existsSync(entryFile)) {
            console.warn(
                `Не удалось найти входной файл через package.json. Попытка использовать index.js...`
            );
            entryFile = path.join(libPath, 'index.js');
        }

        /** Проверка существования файла */
        if (!fs.existsSync(entryFile)) {
            console.error(
                `Входной файл для библиотеки ${opts.packageName} не найден. Попробуйте указать его вручную.`
            );
            Deno.exit(1);
        }

        /** Сборка с помощью esbuild */
        const outputDir = Paths.ProjectFolders.Modules;
        if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

        console.log(`Создаю бандл для ${opts.packageName} из файла: ${entryFile}`);
        esbuild
            .build({
                entryPoints: [entryFile],
                bundle: true,
                outfile: join(outputDir, `${opts.packageName}.bundle.js`),
                minify: true,
                format: 'esm', // Формат для браузера
                // globalName: opts.packageName.replace(/[^a-zA-Z0-9]/g, ''), // Глобальное имя
            })
            .then(async () => {
                console.log(`Бандл для ${opts.packageName} создан в dist/${opts.packageName}.bundle.js`);
                await clear();
                Deno.exit(0);
            })
            .catch(async (error) => {
                console.error(`Ошибка при создании бандла:`, error);
                await clear();
                Deno.exit(1);
            });
    } else {

    }

}

async function clear() {
    await Deno.remove(join(Paths.Root, 'node_modules'), { recursive: true });
    await Deno.remove(join(Paths.Root, 'package.json'), { recursive: true });
    await Deno.remove(join(Paths.Root, 'package-lock.json'), { recursive: true });
}
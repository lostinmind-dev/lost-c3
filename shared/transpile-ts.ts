import { Project, Node } from "../deps.ts";
import { Property } from "../lib/entities/plugin-property.ts";

export async function transpileTs(filePath: string): Promise<string | null> {
    const project = new Project({
        compilerOptions: {
            target: 8,
            module: 7,
            preserveConstEnums: false,
            isolatedModules: false,
            strict: true
        }
    });
    const sourceFile = project.addSourceFileAtPath(filePath);

    const enumValues = new Map<string, string>();
    Object.entries(Property).forEach(([key, value]) => {
        enumValues.set(key, value.toString());
    });

    sourceFile.forEachDescendant(node => {
        if (Node.isPropertyAccessExpression(node)) {
            const identifier = node.getExpression().getText();
            const property = node.getName();

            if (identifier === 'Property' && enumValues.has(property)) {
                const value = enumValues.get(property)!
                node.replaceWithText(`"${value}"`);
            }
        }
    });

    const importDeclarations = sourceFile.getImportDeclarations();

    importDeclarations.forEach(importDeclaration => {
        const moduleSpecifier = importDeclaration.getModuleSpecifier().getText().slice(1, -1); // Убираем кавычки

        // Проверяем, что путь заканчивается на .ts
        if (moduleSpecifier.endsWith('.js')) {

            const newPath = moduleSpecifier.replace(/\/Modules\//, '/modules/');

            // Заменяем старый путь новым
            importDeclaration.getModuleSpecifier().replaceWithText(`'${newPath}'`);
        }

        if (moduleSpecifier.endsWith('.ts')) {
            // Преобразуем путь, заменяя расширение на .js
            let newPath = moduleSpecifier.replace(/\.ts$/, '.js');

            // Преобразуем только папку Modules в нижний регистр
            newPath = newPath.replace(/\/Modules\//, '/modules/');

            // Заменяем старый путь новым
            importDeclaration.getModuleSpecifier().replaceWithText(`'${newPath}'`);
        }
    });

    sourceFile.fixUnusedIdentifiers();


    const transpiled = sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();
    return transpiled || null;
}
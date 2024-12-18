
import { Project, Node, ModuleKind, ScriptTarget, Colors } from "../deps.ts";
import { Property } from "../lib/entities/plugin-property.ts";
import type { DenoJson } from "../shared/deno-json.ts";
import { Logger } from "../shared/logger.ts";

type AddonScriptType =
    | 'runtime'
    | 'editor'
;

export abstract class LostCompiler {
    static #denoJson: DenoJson | null = null;
    static #project: Project;

    /**
     * Initialize
     * @param denoJson 
     */
    static init(denoJson?: DenoJson) {
        if (denoJson) {
            this.#denoJson = denoJson;
        }
    }

    /** @returns compiled javascript file content */
    static compile(filePath: string, addonScriptType?: AddonScriptType): string | null {
        this.#project = new Project({
            compilerOptions: {
                target: ScriptTarget.ES2021,
                module: ModuleKind.ES2022,
                preserveConstEnums: false,
                isolatedModules: false,
                strict: true
            }
        });
        
        const sourceFile = this.#project.addSourceFileAtPath(filePath);
        const enumValues = new Map<string, string>();
        Object.entries(Property).forEach(([key, value]) => {
            enumValues.set(key, value.toString());
        });

        /** Replace *Property* enum (used in addon base compilation) */
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

            importDeclaration.getModuleSpecifier().replaceWithText(this.#transformImport(moduleSpecifier, addonScriptType));
        });

        sourceFile.fixUnusedIdentifiers();


        const transpiled = sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();
        return transpiled || null;
    }
    
    /** @returns path by alias if alias exist in Deno JSON OR @returns *null* if not found in Deno JSON  */
    static #getImportFromDenoJson(importText: string) {
        if (this.#denoJson && this.#denoJson.imports) {
            const imports = this.#denoJson.imports;

            if (imports[importText]) {
                return imports[importText];
            } else {
                for (const [alias, path] of Object.entries(imports)) {
                    if (importText.includes(alias)) {
                        return `${path}${importText.replace(alias, '')}`
                    }
                }
            } 
        }
    }

    static #transformImport(importTextOrAlias: string, addonScriptType?: AddonScriptType): string {
        let newImportText = '';
        const foundImport = this.#getImportFromDenoJson(importTextOrAlias);

        if (foundImport) {
            newImportText = foundImport
                .replace(/\.ts$/, '.js')
                .replace(/\/Modules\//, '/modules/')
                // .replace(/\/Scripts\//, '/scripts/')
            ;

            if (addonScriptType && addonScriptType === 'editor') {
                newImportText = newImportText.replace(/\/Addon\//, '/');
            } else if (addonScriptType === 'runtime') {
                newImportText = newImportText.replace(/\/Addon\//, './');
            }

        } else {
            newImportText = importTextOrAlias
                .replace(/\.ts$/, '.js')
            ;

            if (addonScriptType && addonScriptType === 'editor') {
                newImportText = newImportText
                    .replace(/.\/Modules\//, '/modules/')
                    // .replace(/.\/Scripts\//, '/scripts/')
            } else if (addonScriptType === 'runtime') {
                newImportText = newImportText
                    .replace(/\/Modules\//, '/modules/')
                    // .replace(/\/Scripts\//, '/scripts/')
            }
        }

        return `'${newImportText}'`;
    }
}
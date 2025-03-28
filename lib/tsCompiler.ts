import { join, ts } from "./deps.ts";

const defaultCompilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2021,
    module: ts.ModuleKind.ES2022,
    verbatimModuleSyntax: true,
    esModuleInterop: false,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true
}

const compileTargets = {
    editor: ['type.ts', 'instance.ts'],
    runtime: ['type.ts', 'behavior.ts', 'plugin.ts', 'instance.ts']
} as const;

type CompileTargets = typeof compileTargets;

type CompileResult<Target extends keyof CompileTargets> = {
    readonly name: ReplaceTsToJs<CompileTargets[Target][number]>;
    readonly content: string;
}

export class TsCompiler {
    private project: ts.Project | null = null;

    init(compilerOptions?: ts.CompilerOptions) {
        if (compilerOptions) {
            this.project = new ts.Project({ compilerOptions });
        } else {
            this.project = new ts.Project({ compilerOptions: defaultCompilerOptions });
        }
    }

    compileTs(path: string) {
        if (!this.project) {
            console.error('Project was not initialized!');
            Deno.exit(9);
        };

        const sourceFile = this.project.addSourceFileAtPath(path);

        sourceFile.fixUnusedIdentifiers();

        for (const importDeclaration of sourceFile.getImportDeclarations()) {
            const moduleSpecifier = importDeclaration.getModuleSpecifier().getText().slice(1, -1);

            importDeclaration.getModuleSpecifier().replaceWithText(`'${moduleSpecifier.replace('.ts', '.js')}'`)
        }

        return sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();
    }

    compile<
        Target extends keyof CompileTargets,
        File extends CompileTargets[Target][number]
    >(
        target: Target, 
        file: File
    ): CompileResult<Target> {
        if (!this.project) {
            console.error('Project was not initialized!');
            Deno.exit(9);
        };

        const filePath = join(Deno.cwd(), 'addon', target, file);
        
        const sourceFile = this.project.addSourceFileAtPath(`${filePath}`);

        sourceFile.fixUnusedIdentifiers();

        for (const importDeclaration of sourceFile.getImportDeclarations()) {
            const moduleSpecifier = importDeclaration.getModuleSpecifier().getText().slice(1, -1);

            importDeclaration.getModuleSpecifier().replaceWithText(`'${moduleSpecifier.replace('.ts', '.js')}'`)
        }

        const content = sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();

        return {
            //@ts-ignore
            name: file.replace('.ts', '.js'),
            content
        };
    }
}
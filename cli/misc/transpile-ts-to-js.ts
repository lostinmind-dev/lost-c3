import { Project } from "../cli-deps.ts";

export async function transpileTsToJs(filePath: string): Promise<string | null> {
    const project = new Project({
        compilerOptions: {
            target: 8,
            module: 7   
        }
    });
    const sourceFile = project.addSourceFileAtPath(filePath);
    const transpiled = sourceFile.getEmitOutput().getOutputFiles()[0]?.getText();
    return transpiled || null;
}
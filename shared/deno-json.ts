export type DenoJson = {
    /** The name of this JSR package. Must be scoped */
    readonly name?: string;
    /** The version of this JSR package. */
    readonly version?: string;
    /** Configuration for deno task */
    readonly tasks?: {
        [key: string]: string;
    };
    /** Instructs the TypeScript compiler how to compile .ts files. */
    readonly compilerOptions?: {};
    /** A map of package exports to files in this JSR package. */
    readonly exports?: {
        [key: string]: string;
    };
    /** A map of specifiers to their remapped specifiers. */
    readonly imports?: {
        readonly [key: string]: string | undefined;
    }
    /**
     * The location of an import map to be used when resolving modules.
     * If an import map is specified as an `--importmap` flag or using "imports" and "scopes" properties, they will override this value.
     */
    readonly importsMap?: string;
}
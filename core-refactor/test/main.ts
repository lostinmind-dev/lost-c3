import { build } from '@c3-lost/core';

await build({
    watch: true,
    bundle: {
        compilerOptions: {
            inlineSourceMap: true
        }
    }
})
/** @link https://github.com/hazae41/foras/tree/1.2.1 */
export {
    deflate,
    inflate,
    gzip,
    gunzip,
    zlib,
    unzlib,
} from "./pkg/denoflate.js";

import init from "./pkg/denoflate.js";
import { wasm } from "./pkg/denoflate_bg.wasm.js";

await init(wasm);
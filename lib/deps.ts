import type { UglifyJs } from './types/uglifyJs.ts';
import * as uglifyjs from 'npm:uglify-js@3.19.3';
export const uglifyJs: UglifyJs = uglifyjs;

export * as ts from 'jsr:@ts-morph/ts-morph@24.0.0';
export * as bundler from "jsr:@deno/emit@0.46.0";

export * as prettier from 'npm:prettier@4.0.0-alpha.10';


export { join } from 'jsr:@std/path@1.0.8';

export * as colors from 'jsr:@std/fmt@1.0.2/colors';

export { Md5 } from 'npm:ts-md5@1.3.1';

import * as _zipJs from 'jsr:@zip-js/zip-js@2.7.53';
export const zipJs = _zipJs;



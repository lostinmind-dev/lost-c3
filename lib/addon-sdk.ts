import { _C3 } from './mocks/runtime/AddonSDK.ts';
import { ISDKInstanceBase } from "./mocks/runtime/ISDKInstanceBase.ts";

export const C3 = new _C3();

export const Lost = {
    SDKInstanceBase: ISDKInstanceBase
}


class LostInstance extends Lost.SDKInstanceBase {
    constructor() {
        super();
    }

    _release() {
        super._release();
    }
}

export type { LostInstance as Instance };
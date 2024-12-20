import type { LostConfig } from "../../lost-config.ts";
import type { AddonType } from "../../types/index.ts";
import { Addon } from "../index.ts";

export class Behavior<A extends AddonType = 'behavior'> extends Addon<A> {
    constructor(config: LostConfig<A>) {
        super(config);
    }
}
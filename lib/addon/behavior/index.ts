import type { BehaviorConfig } from "../../lost-config.ts";
import { Addon } from "../index.ts";

export class Behavior extends Addon {
    constructor(config: BehaviorConfig) {
        super(config);
    }
}
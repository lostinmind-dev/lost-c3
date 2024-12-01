import { Effect } from "../../lib/effect.ts";
import { EProperty } from "../../mod.ts";
import config from './lost.config.ts';

const Addon = new Effect(config);

Addon
    .addProperty('test', 'Test 1', { type: EProperty.Color, uniform: '' })

export default Addon;
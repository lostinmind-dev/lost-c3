import { Behavior } from "../../lib/behavior.ts";
import { Property } from "../../lib/entities/plugin-property.ts";
import config from './lost.config.ts';

const Addon = new Behavior(config);

Addon
    .addPluginProperty('test', 'Test 1', { type: Property.Text })

export default Addon;
import { Behavior } from "../../lib/behavior.ts";
import { Property } from "../../lib/entities/plugin-property.ts";
import { defineAddon } from "../../lib/index.ts";
import config from './lost.config.ts';

export default defineAddon(
    new Behavior(config)
        .addProperty('test', 'Test 1', { type: Property.Text })
        .addProperty('', '', {
            type: Property.Integer
        })
        // .addProperty('', '', { type: Property.Color })
)

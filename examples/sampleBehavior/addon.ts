import { Behavior } from "../../lib/behavior.ts";
import { Property } from "../../lib/entities/plugin-property.ts";
import { defineAddon } from "../../lib/index.ts";
import type { EditorInstance } from "./Editor/Instance.ts";
import config from './lost.config.ts';

export default defineAddon(
    new Behavior<EditorInstance>(config)
        .addProperty('test', 'Test 1', { type: Property.Text })
        .addProperty('', '', {
            type: Property.Integer
        })
        .addProperty('', '', {
            type: Property.Info,
            callback: (inst) => {
                return String(inst.test);
            }
        })
        // .addProperty('', '', { type: Property.Color })
)

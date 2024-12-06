import { Property } from "../../lib/entities/plugin-property.ts";
import { Plugin } from '../../lib/plugin.ts';
import { defineAddon } from "../../mod.ts";
import type { EditorInstance } from "./Editor/Instance.ts";
import type { EditorType } from "./Editor/Type.ts";
import config from './lost.config.ts';

export default defineAddon(
    new Plugin<EditorInstance, EditorType>(config)

        .addProperty('test', 'Test', {
            type: Property.Link,
            callbackType: 'for-each-instance',
            callback: (i) => {
                i.
            }
        })

        .addProperty('', '', {
            type: Property.Link,
            callbackType: 'once-for-type',
            callback: (i) => {
                
            }
        })
)
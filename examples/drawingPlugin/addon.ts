import { Property } from "../../lib/entities/plugin-property.ts";
import { Plugin } from '../../lib/plugin.ts';
import { defineAddon } from "../../mod.ts";
import type { EditorWorldInstance } from "./Editor/Instance.ts";
import type { EditorType } from "./Editor/Type.ts";
import config from './lost.config.ts';

export default defineAddon<'plugin'>(
    new Plugin<EditorWorldInstance, EditorType>(config)
        .addProperty('test1', 'Test 1', { type: Property.Text })
        .addProperty('test2', 'test 2', {
            type: Property.Combo,
            items: [
                ['id1', 'Test1'],
                ['id2', 'Test2']
            ],
            initialValue: 'id1'
        })
        .addProperty('', '', {
            type: Property.Info,
            callback: (i) => {
                return '';
            }
        })
        .addProperty('test', 'Test', {
            type: Property.Link,
            callbackType: 'for-each-instance',
            callback: (i) => {

            }
        })
        .addProperty('test', 'Hello', {
            type: Property.Link,
            callbackType: 'once-for-type',
            callback: (a) => {
                
            }
        })
)
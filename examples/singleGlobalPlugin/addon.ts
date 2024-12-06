import { Property } from "../../lib/entities/plugin-property.ts";
import { defineAddon } from "../../lib/index.ts";
import { Plugin } from '../../lib/plugin.ts';
import type { EditorInstance } from "./Editor/Instance.ts";
import type { EditorType } from "./Editor/Type.ts";
import config from './lost.config.ts';



export default defineAddon(
    new Plugin<EditorInstance, EditorType>(config)
        .setRuntimeScripts('index.ts')
        .addProperty('test1', 'Test 1', { type: Property.Text })
        .addProperty('test2', 'test 2', {
            type: Property.Combo,
            items: [
                ['id1', 'Test1'],
                ['id2', 'Test2']
            ],
            initialValue: 'id1'
        })
        .addProperty('12', 'sdf', {
            type: Property.Info,
            callback: (i) => {
                return 'string'
            }
        })
        // .addProperty('', '', {
        //     type: Property.Link,
        //     callbackType: 'for-each-instance',
        //     callback: () => {

        //     }
        // })
        .addProperty('test', 'Hello', {
            type: Property.Link,
            callbackType: 'once-for-type' ,
            callback: (a) => {

            }
        })
)
import { Property } from "../../lib/entities/plugin-property.ts";
import { defineAddon } from "../../lib/index.ts";
import { Plugin } from '../../lib/plugin.ts';
import config from './lost.config.ts';



export default defineAddon<'plugin'>(
    new Plugin(config)
        .addProperty('test', 'Test 1', { type: Property.Text })
        .addProperty<['id1', 'id2']>('test2', 'test 2', {
            type: Property.Combo,
            items: [
                ['id1', 'Test1'],
                ['id2', 'Test2']
            ],
            initialValue: 'id1'
        })
)
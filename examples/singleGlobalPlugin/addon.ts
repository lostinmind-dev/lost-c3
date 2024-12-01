import { Property } from "../../lib/entities/plugin-property.ts";
import { Plugin } from '../../lib/plugin.ts';
import config from './lost.config.ts';

const Addon = new Plugin(config);

Addon
    .addPluginProperty('test', 'Test 1', { type: Property.Text })
    .addPluginProperty<['id1', 'id2']>('test2', 'test 2', {
        type: Property.Combo,
        items: [
            ['id1', 'Test1'],
            ['id2', 'Test2']
        ],
        initialValue: 'id1'
    })

export default Addon;
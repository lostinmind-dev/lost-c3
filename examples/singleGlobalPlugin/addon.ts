import { Property } from "../../lib/entities/plugin-property.ts";
import { Plugin } from '../../lib/plugin.ts';
import config from './lost.config.ts';

const Addon = new Plugin(config);

Addon
    .addPluginProperty('test', 'Test 1', { type: Property.Text })
    .addPluginProperty('test2', 'test 2', {
        type: Property.Combo,
        items: [
            ['test', 'Test1'],
            ['test2', 'Test2']
        ],
        initialValue: ''
    })

export default Addon;
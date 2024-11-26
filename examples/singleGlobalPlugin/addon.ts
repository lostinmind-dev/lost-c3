import { Property } from "../../lib/entities/plugin-property.ts";
import { Plugin } from '../../lib/plugin.ts';
import config from './lost.config.ts';

const Addon = new Plugin(config);

export default Addon;
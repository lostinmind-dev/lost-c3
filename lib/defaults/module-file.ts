import type { AddonType, LostConfig } from "../../lib/config.ts";
import { dedent } from "../../shared/misc.ts";

export default function file(config: LostConfig<AddonType>) {

const Plugin = dedent`
import './plugin.js';
import './type.js';
import './instance.js';
import './conditions.js';
import './actions.js';
import './expressions.js';
`;

const Behavior = dedent`
import './behavior.js';
import './type.js';
import './instance.js';
import './conditions.js';
import './actions.js';
import './expressions.js';
`

switch (config.type) {
    case 'plugin':
        return Plugin;
    case 'behavior':
        return Behavior;
}

}
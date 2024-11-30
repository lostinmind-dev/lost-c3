import type { AddonType } from "../../lib/config.ts";
import { dedent } from "../../shared/misc.ts";

export default function moduleFile(addonType: AddonType) {

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

switch (addonType) {
    case 'plugin':
        return Plugin;
    case 'behavior':
        return Behavior;
        // break;
}

}
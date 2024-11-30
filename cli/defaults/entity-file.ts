import type { AddonType, LostConfig } from "../../lib/config.ts";
import { EntityType } from '../../lib/entities/entity.ts';
import { dedent } from "../../shared/misc.ts";
import Lost from './lost.ts';

type EntityPathType = {
    [key in AddonType]: {
        [key in EntityType]: string;
    }
}

const EntityPath: EntityPathType = {
    plugin: {
        [EntityType.Action]: 'C3.Plugins[Lost.addonId].Acts',
        [EntityType.Condition]: 'C3.Plugins[Lost.addonId].Cnds',
        [EntityType.Expression]: 'C3.Plugins[Lost.addonId].Exps'
    },
    behavior: {
        [EntityType.Action]: 'C3.Behaviors[Lost.addonId].Acts',
        [EntityType.Condition]: 'C3.Behaviors[Lost.addonId].Cnds',
        [EntityType.Expression]: 'C3.Behaviors[Lost.addonId].Exps'
    },
}

export default function entityFile(config: LostConfig<AddonType>, entityType: EntityType) {

const _default = dedent`
${Lost(config.addonId)}
const C3 = globalThis.C3;

${EntityPath[config.type][entityType]} =
`;

return _default;

}
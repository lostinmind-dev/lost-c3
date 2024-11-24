import { EntityType } from '../../lib/entities/entity.ts';
import Lost from './lost.ts';

export default function getDefaultEntityFile(addonId: string, type: EntityType) {
    const _default = `${Lost(addonId)}\n`;
    switch (type) {
        case EntityType.Action:
            return `${_default}\nconst C3 = globalThis.C3;\n C3.Plugins[Lost.addonId].Acts =`
        case EntityType.Condition:
            return `${_default}\nconst C3 = globalThis.C3;\n C3.Plugins[Lost.addonId].Cnds =`
        case EntityType.Expression:
            return `${_default}\nconst C3 = globalThis.C3;\n C3.Plugins[Lost.addonId].Exps =`
    }
}
import type { Addons } from "../config.ts";

type RegistrationType = [
    'actions',
    'conditions',
    'expressions',

    'sdk-type',
    'sdk-instance',

    'runtime-type',
    'runtime-plugin-or-behavior',
    'runtime-instance',
];

export class RegistererSystem {
    for<Type extends keyof Addons>(
        addonType: Type,
        addonId: string,
        type: RegistrationType[number]
    ) {
        if (type === 'actions') {
            return `globalThis.C3.${ addonType === 'plugin' ? 'Plugins' : 'Behaviors' }["${addonId}"].Acts` as const;
        } else if (type === 'conditions') {
            return `globalThis.C3.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"].Cnds` as const;
        } else if (type === 'expressions') {
            return `globalThis.C3.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"].Exps` as const;
        } else if (type === 'sdk-type') {
            return `globalThis.SDK.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"].Type` as const;
        } else if (type === 'sdk-instance') {
            return `globalThis.SDK.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"].Instance` as const;
        } else if (type === 'runtime-type') {
            return `globalThis.C3.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"].Type` as const;
        } else if (type === 'runtime-plugin-or-behavior') {
            return `globalThis.C3.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"]` as const;
        } else if (type === 'runtime-instance') {
            return `globalThis.C3.${addonType === 'plugin' ? 'Plugins' : 'Behaviors'}["${addonId}"].Instance` as const;
        } else {
            Deno.exit(1)
        }
    }
}
import { join } from "../deps.ts";
import { Addon } from "./config/index.ts";

const configPath = ['addon.config.ts'];

export class ConfigLoader {
    async load() {
        try {
            const path = join(Deno.cwd(), ...configPath);

            const data = await import(`file://${path}?t=${Date.now()}`);

            let config: Addon | null = null;
            for (const [prop, value] of Object.entries(data)) {
                if (prop !== 'default') continue;
                if (value instanceof Addon) {
                    config = value;
                } else if (value instanceof Promise) {
                    config = await value;
                }
            }

            if (config instanceof Addon) {
                return config;
            } else {
                console.log(
                    'Error while loading addon config',
                    'Default exported config was not found at file `addon.config.ts`'
                );
                Deno.exit(2);
            }
        } catch (e) {
            // Logger.error()
            console.log('Error while loading addon config', e);
            Deno.exit(1);
        }
    }
}
import type { AddonThemeStyleFile } from './get-addon-theme-style-files.ts';
import type { AddonIcon } from "../get-addon-icon.ts";

import { BUILD_PATH } from "../paths.ts";
import { LOGGER } from '../misc.ts';

interface CreateAddonStructureOptions {
    STYLE_FILES: AddonThemeStyleFile[];
    ICON: AddonIcon;
}

export async function createAddonThemeStructure({STYLE_FILES, ICON}: CreateAddonStructureOptions) {
    try {
        await Deno.remove(BUILD_PATH, { recursive: true });
    } catch (e) {
        //return;
    }
    await Deno.mkdir(BUILD_PATH);
    await Deno.mkdir(`${BUILD_PATH}/lang`);

    if (STYLE_FILES.length > 0) {
        STYLE_FILES.forEach(styleFile => {
            Deno.copyFile(styleFile.path, `${BUILD_PATH}/${styleFile.filename}`);
        })
    }

    if (!ICON.isDefault) {
        await Deno.copyFile(ICON.path, `${BUILD_PATH}/${ICON.filename}`);
    } else {
        const getIcon = await fetch(ICON.path);

        if (!getIcon.ok) {
            // failed to get default icon
            LOGGER.Error('build', `Failed to download default icon from url: ${ICON.path}`)
            Deno.exit();
        } else {
            const iconContent = await getIcon.text();
            await Deno.writeTextFile(`${BUILD_PATH}/${ICON.filename}`, iconContent)
        }
    }
}
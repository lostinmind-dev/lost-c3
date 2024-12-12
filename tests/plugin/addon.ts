import { Property } from "../../lib/entities/plugin-property.ts";
import { defineAddon } from "../../lib/index.ts";
import { Plugin } from '../../lib/plugin.ts';
import type { EditorInstance } from "./Editor/Instance.ts";
import type { EditorType } from "./Editor/Type.ts";
import config from './lost.config.ts';



export default defineAddon(
    new Plugin<EditorInstance, EditorType>(config)
)
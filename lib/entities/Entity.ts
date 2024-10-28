import type { Param, ParamOptions } from "../params/Params.ts";

export type LostEntityType = 'Action' | 'Condition' | 'Expression';

export interface LostEntityOptions {
    ScriptName: string;
    Script: any;
    Highlight: boolean;
    Deprecated: boolean;
}

export interface LostEntity {
    Type: LostEntityType;
    Id: string;
    Name: string;
    Description: string;
    Options: LostEntityOptions,
    Params: Param<ParamOptions>[];
}

export interface LostEntityWithSpecificParams<T extends ParamOptions['Type']> extends LostEntity {
    Params: Param<Extract<ParamOptions, { Type: T }>>[];
}

export interface EntityOptionsBase {
    /**
     * A string specifying a unique ID for the ACE. 
     * @description This is used in the language file. 
     * By convention this is lowercase with dashes for separators
     * @example "my-condition".
     */
    Id: string,
    /**
     * The name that appears in the condition/action picker dialog.
     * @example "Do action"
     */
    Name: string,
    /**
     * Optional. A description of the action or condition, which appears as a tip at the top of the condition/action picker dialog.
     * @example "This action is doing something good."
     */
    Description?: string, 
    /**
     * Optional. Default is **False**. Set to true to highlight the ACE in the condition/action/expression picker dialogs. 
     * @description This should only be used for the most regularly used ACEs, to help users pick them out from the list easily.
     * @example true
     */
    Highlight?: boolean;
    /**
     * Optional. Default is **False**. Set to true to deprecate the ACE. 
     * @description This hides it in the editor, but allows existing projects to continue using it.
     * @example true
     */
    Deprecated?: boolean;
    /**
     * Optional. Array of ACE params.
     * @description Use Param class to define any parameter.
     * @example [new Param({Type: "string", Id: "myNumber", Name: "Number"})]
     */
    Params?: Param<ParamOptions>[];
}

export interface EntityOptionsWithSpecificParams<T extends ParamOptions['Type']> extends EntityOptionsBase {
    Params?: Param<Extract<ParamOptions, { Type: T }>>[];
}
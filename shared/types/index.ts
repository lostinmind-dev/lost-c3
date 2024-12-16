export type AddonBareBonesType =
    | 'plugin'
    | 'drawing-plugin'
    | 'behavior'
;

export type AddonBaseMetadata = {
    readonly download_url: string;
    readonly addon_type: string;
    readonly version: string;
    readonly timestamp: number;
}
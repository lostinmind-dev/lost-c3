import type { Numeric, Options as NumericOptions } from "./properties/numeric.ts";
import type { Percent, Options as PercentOptions } from "./properties/percent.ts";
import type { Text, Options as TextOptions } from "./properties/text.ts";
import type { Check, Options as CheckOptions } from "./properties/check.ts";
import type { Font, Options as FontOptions } from "./properties/font.ts";
import type { Combo, Options as ComboOptions } from "./properties/combo.ts";
import type { Color, Options as ColorOptions } from "./properties/color.ts";
import type { Object, Options as ObjectOptions } from "./properties/object.ts";
import type { Group, Options as GroupOptions } from "./properties/group.ts";
import type { Info, Options as InfoOptions } from "./properties/info.ts";
import type { Link, Options as LinkOptions } from "./properties/link.ts";

export abstract class Property<Type extends keyof Properties> {
    readonly type: Type;

    readonly id: string;
    readonly name: string;
    readonly desc?: string;

    constructor(
        type: Type,
        id: string,
        name: string,
        desc?: string
    ) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.desc = desc;
    }
}

export type NumericProperties = {
    integer: {
        klass: Numeric;
        opts: NumericOptions
    };
    float: {
        klass: Numeric;
        opts: NumericOptions
    };
};

export type TextProperties = {
    text: {
        klass: Text;
        opts: TextOptions
    };
    longtext: {
        klass: Text;
        opts: TextOptions
    };
}

export type Properties = {
    percent: {
        klass: Percent;
        opts: PercentOptions;
    };
    check: {
        klass: Check;
        opts: CheckOptions;
    };
    font: {
        klass: Font;
        opts: FontOptions;
    };
    combo: {
        klass: Combo;
        opts: ComboOptions;
    };
    color: {
        klass: Color;
        opts: ColorOptions;
    };
    object: {
        klass: Object;
        opts: ObjectOptions;
    };
    group: {
        klass: Group;
        opts: GroupOptions;
    };
    info: {
        klass: Info;
        opts: InfoOptions;
    };
    link: {
        klass: Link;
        opts: LinkOptions;
    }
} & NumericProperties & TextProperties;
import * as numeric from "./numeric.ts";
import * as percent from "./percent.ts";
import * as text from "./text.ts";
import * as check from "./check.ts";
import * as font from "./font.ts";
import * as combo from "./combo.ts";
import * as color from "./color.ts";
import * as object from "./object.ts";
import * as group from "./group.ts";
import * as info from "./info.ts";
import * as link from "./link.ts";

export var Property = class <Type extends keyof Properties> {
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
        klass: typeof numeric.NumericProperty;
        opts: numeric.Options;
    };
    float: {
        klass: typeof numeric.NumericProperty;
        opts: numeric.Options;
    };
};

export type TextProperties = {
    text: {
        klass: typeof text.TextProperty;
        opts: text.Options;
    };
    longtext: {
        klass: typeof text.TextProperty;
        opts: text.Options;
    };
}

export type Properties = {
    percent: {
        klass: typeof percent.PercentProperty;
        opts: percent.Options;
    };
    check: {
        klass: typeof check.CheckProperty;
        opts: check.Options;
    };
    font: {
        klass: typeof font.FontProperty;
        opts: font.Options;
    };
    combo: {
        klass: typeof combo.ComboProperty;
        opts: combo.Options;
    };
    color: {
        klass: typeof color.ColorProperty;
        opts: color.Options;
    };
    object: {
        klass: typeof object.ObjectProperty;
        opts: object.Options;
    };
    group: {
        klass: typeof group.GroupProperty;
        opts: group.Options;
    };
    info: {
        klass: typeof info.InfoProperty;
        opts: info.Options;
    };
    link: {
        klass: typeof link.LinkProperty;
        opts: link.Options;
    }
} & NumericProperties & TextProperties;

export { numeric };
export { percent };
export { text };
export { check };
export { font };
export { combo };
export { color };
export { object };
export { group };
export { info };
export { link }; 
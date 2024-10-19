import LangJSON from "lang-json";
export interface ElementData {
    tag: string;
    attributes: Record<string, string | string[] | any>;
    children?: ElementData[];
}
export declare class JSONToHTML {
    langJson: LangJSON;
    constructor();
    compile(template: any, data: any): any;
    convert(elementsArray: ElementData[] | undefined, parentElement: HTMLElement | null): void;
}

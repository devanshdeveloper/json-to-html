type DynamicValues = Record<string, any>;
interface ElementData {
    tag: string;
    attributes: Record<string, string | string[] | any>;
    children?: ElementData[];
}
export declare class JSONToHTML {
    constructor();
    manipulateDOMFromJSON(elementsArray: ElementData[], parentElement: HTMLElement, dynamicValues: DynamicValues): void;
    replacePlaceholders(text: string, dynamicValues: DynamicValues): string;
    convert(json: ElementData, appendTo: HTMLElement, dynamicValues: DynamicValues): void;
}
export {};

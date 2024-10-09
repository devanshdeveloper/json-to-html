import { $$, ExtendedDOMJS } from "extendeddomjs";

type DynamicValues = Record<string, any>;

interface ElementData {
  tag: string;
  attributes: Record<string, string | string[] | any>;
  children?: ElementData[];
}

export class JSONToHTML {
  constructor() {}

  manipulateDOMFromJSON(
    elementsArray: ElementData[],
    parentElement: HTMLElement,
    dynamicValues: DynamicValues
  ): void {
    elementsArray.forEach((elementData) => {
      const newElement: ExtendedDOMJS = $$(elementData.tag);

      for (const method in elementData.attributes) {
        if (Object.hasOwnProperty.call(elementData.attributes, method)) {
          const value = elementData.attributes[method];
          if (typeof value === "string") {
            (newElement as any)[method](
              this.replacePlaceholders(value, dynamicValues)
            );
            continue;
          }

          if (Array.isArray(value)) {
            const replacedValues = value.map((e) =>
              this.replacePlaceholders(e, dynamicValues)
            );
            (newElement as any)[method](...replacedValues);
            continue;
          }

          (newElement as any)[method](value);
        }
      }

      parentElement.appendChild(newElement.el as HTMLElement);
      if (elementData.children && elementData.children.length > 0) {
        this.manipulateDOMFromJSON(
          elementData.children,
          newElement.el as HTMLElement,
          dynamicValues
        );
      }
    });
  }

  replacePlaceholders(text: string, dynamicValues: DynamicValues): string {
    let value: any = dynamicValues;
    if (typeof text !== "string" || !text.includes("{{")) return text;

    text.replace(/{{(.*?)}}/g, (match, key) => {
      const keys = key.trim().split(".");
      for (const nestedKey of keys) {
        if (value && typeof value === "object" && nestedKey in value) {
          value = value[nestedKey];
        } else {
          value = match;
          return value;
        }
      }
    });
    return value;
  }

  convert(
    json: ElementData,
    appendTo: HTMLElement,
    dynamicValues: DynamicValues
  ): void {
    this.manipulateDOMFromJSON([json], appendTo, dynamicValues);
  }
}

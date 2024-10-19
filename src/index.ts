import { $$ } from "extendeddomjs";
import isThis from "@devanshdeveloper/is-this";
import LangJSON from "lang-json";
import unit from "css-unit-manager";

export interface ElementData {
  tag: string;
  attributes: Record<string, string | string[] | any>;
  children?: ElementData[];
}

export class JSONToHTML {
  langJson: LangJSON;

  constructor() {
    this.langJson = new LangJSON();
    this.langJson.registerHelpers({
      cssConvert([string, toUnit]) {
        return unit(string).toUnit(toUnit).toString();
      },
    });
  }

  compile(template: any, data: any) {
    return this.langJson.applyTemplate(template, data);
  }

  convert(
    elementsArray: ElementData[] | undefined,
    parentElement: HTMLElement | null
  ): void {
    if (!elementsArray) return;
    
    if (isThis.isString(elementsArray)) {
      elementsArray = [{ tag: "div", attributes: { html: elementsArray } }];
    }

    if (isThis.isObject(elementsArray)) {
      elementsArray = [elementsArray as any];
    }

    for (let i = 0; i < elementsArray.length; i++) {
      const element = elementsArray[i];
      const newElement = $$(element.tag);

      // looping in attributes
      for (const method in element.attributes) {
        if (Object.hasOwnProperty.call(element.attributes, method)) {
          // args
          const args = element.attributes[method];
          if (isThis.isFunction((newElement as any)[method])) {
            if (isThis.isArray(args)) {
              (newElement as any)[method](...args);
            } else {
              (newElement as any)[method](args);
            }
          } else {
            throw new Error("Method not found : " + method);
          }
        }
      }
      parentElement?.appendChild(newElement.el as HTMLElement);
      if (!isThis.isEmptyArray(element.children)) {
        this.convert(element.children, newElement.el as HTMLElement);
      }
    }
  }
}

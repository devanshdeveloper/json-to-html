import { $$ } from "extendeddomjs";
import isThis from "@devanshdeveloper/is-this";
import LangJSON from "lang-json";
import unit from "css-unit-manager";
export class JSONToHTML {
    langJson;
    constructor() {
        this.langJson = new LangJSON();
        this.langJson.registerHelpers({
            cssConvert([string, toUnit]) {
                return unit(string).toUnit(toUnit).toString();
            },
        });
    }
    compile(template, data) {
        return this.langJson.applyTemplate(template, data);
    }
    convert(elementsArray, parentElement) {
        if (!elementsArray)
            return;
        if (isThis.isString(elementsArray)) {
            elementsArray = [{ tag: "div", attributes: { html: elementsArray } }];
        }
        if (isThis.isObject(elementsArray)) {
            elementsArray = [elementsArray];
        }
        for (let i = 0; i < elementsArray.length; i++) {
            const element = elementsArray[i];
            const newElement = $$(element.tag);
            // looping in attributes
            for (const method in element.attributes) {
                if (Object.hasOwnProperty.call(element.attributes, method)) {
                    // args
                    const args = element.attributes[method];
                    if (isThis.isFunction(newElement[method])) {
                        if (isThis.isArray(args)) {
                            newElement[method](...args);
                        }
                        else {
                            newElement[method](args);
                        }
                    }
                    else {
                        throw new Error("Method not found : " + method);
                    }
                }
            }
            parentElement?.appendChild(newElement.el);
            if (!isThis.isEmptyArray(element.children)) {
                this.convert(element.children, newElement.el);
            }
        }
    }
}
//# sourceMappingURL=index.js.map
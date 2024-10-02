import { $$ } from "extendeddomjs"

export class JSONToHTML {
    constructor() {

    }

    manipulateDOMFromJSON(elementsArray, parentElement, dynamicValues) {
        elementsArray.forEach((elementData) => {
            const newElement = $$(elementData.tag);
            for (const method in elementData.attributes) {
                if (Object.hasOwnProperty.call(elementData.attributes, method)) {
                    const value = elementData.attributes[method];
                    if (typeof value === "string") {
                        newElement[method](this.replacePlaceholders(value, dynamicValues));
                        continue;
                    }
                    if (Array.isArray(value)) {
                        const replacedValues = value.map((e) =>
                            this.replacePlaceholders(e, dynamicValues)
                        );
                        newElement[method](...replacedValues);
                        continue;
                    }

                    newElement[method](value);
                }
            }
            parentElement.appendChild(newElement.el);
            if (elementData.children && elementData.children.length > 0) {
                this.manipulateDOMFromJSON(
                    elementData.children,
                    newElement.el,
                    dynamicValues
                );
            }
        });
    }

    replacePlaceholders(text, dynamicValues) {
        let value = dynamicValues;
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

    convert(json, appendTo, dynamicValues) {
        this.manipulateDOMFromJSON([json], appendTo, dynamicValues)
    }

}
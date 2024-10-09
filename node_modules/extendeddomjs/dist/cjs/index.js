"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendedDOMJS = void 0;
exports.$ = $;
exports.$$ = $$;
class ExtendedDOMJS {
    element;
    elementList;
    eventListenerList;
    constructor(elements) {
        this.element = null;
        this.elementList = [];
        this.eventListenerList = [];
        this.setEls(elements);
    }
    // Utility functions to replace undefined methods
    static isString(value) {
        return typeof value === "string";
    }
    static isValid(value) {
        return value !== null && value !== undefined;
    }
    static isObject(value) {
        return typeof value === "object" && !Array.isArray(value);
    }
    static mapObject(obj, func) {
        Object.keys(obj).forEach((key) => func(key, obj[key]));
    }
    // Looping over elements
    mapElements(func = () => { }) {
        if (this.els.length === 0)
            return [];
        return this.els.map(func);
    }
    forEachElement(func = () => { }) {
        if (this.els.length === 0)
            return this;
        this.els.forEach(func);
        return this;
    }
    everyElement(func) {
        if (this.els.length === 0)
            return false;
        return this.els.every(func);
    }
    filterElements(func = () => true) {
        if (this.els.length === 0)
            return this;
        return new ExtendedDOMJS(this.els.filter(func));
    }
    forEach(func = () => { }) {
        if (this.els.length === 0)
            return this;
        this.els.forEach((e, i) => func(new ExtendedDOMJS([e]), i));
        return this;
    }
    map(func = () => { }) {
        if (this.els.length === 0)
            return [];
        return this.els.map((e, i) => func(new ExtendedDOMJS([e]), i));
    }
    filter(func = () => true) {
        if (this.els.length === 0)
            return [];
        return this.els.filter((e, i) => func(new ExtendedDOMJS([e]), i));
    }
    // Getters
    get el() {
        return this.element;
    }
    get els() {
        return this.elementList;
    }
    get attri() {
        return this.el?.attributes;
    }
    get style() {
        return this.el ? getComputedStyle(this.el) : undefined;
    }
    get HTML() {
        return this.el?.innerHTML || "";
    }
    get Text() {
        return this.el?.innerText || "";
    }
    get classes() {
        return this.el?.classList;
    }
    get length() {
        return this.els.length;
    }
    get isChecked() {
        return this.el ? this.el.checked : undefined;
    }
    // Setters
    set HTML(value) {
        if (this.el)
            this.el.innerHTML = value;
    }
    setEls(elements) {
        if (!elements)
            return this;
        this.elementList = [...elements];
        this.element = this.elementList[0];
        this.eventListenerList = [];
        return this;
    }
    select(...index) {
        if (!index || index.length === 0)
            return this;
        return this.filterElements((el, i) => index.includes(i));
    }
    // Class manipulation
    addClass(...className) {
        return this.forEachElement((e) => e.classList.add(...className));
    }
    removeClass(...classToRemove) {
        return this.forEachElement((e) => e.classList.remove(...classToRemove));
    }
    // Events
    on(type, func) {
        if (ExtendedDOMJS.isString(type)) {
            this.eventListenerList.push({ type, func: func, elementList: this.els });
            return this.forEachElement((e) => e.addEventListener(type, func));
        }
        else {
            return this.forEachElement((e) => {
                ExtendedDOMJS.mapObject(type, (k, v) => e.addEventListener(k, v));
            });
        }
    }
    off(type, func) {
        if (ExtendedDOMJS.isString(type)) {
            return this.forEachElement((e) => e.removeEventListener(type, func));
        }
        else {
            return this.forEachElement((e) => {
                ExtendedDOMJS.mapObject(type, (k, v) => e.removeEventListener(k, v));
            });
        }
    }
    appendTo(to) {
        return this.forEachElement((e) => to.el?.appendChild(e));
    }
    html(value) {
        if (value === undefined) {
            return this.mapElements((e) => e.innerHTML); // Map the elements to get their inner HTML
        }
        else {
            this.forEachElement((e) => {
                e.innerHTML = value; // Set the inner HTML for each element
            });
            return this; // Return 'this' to allow method chaining
        }
    }
    attr(attrName, value) {
        if (ExtendedDOMJS.isString(attrName)) {
            if (value === undefined) {
                return this.mapElements((e) => e.getAttribute(attrName)); // Map the elements to get the attribute values
            }
            else {
                this.forEachElement((e) => {
                    e.setAttribute(attrName, value); // Set the attribute value for each element
                });
                return this; // Return 'this' to allow method chaining
            }
        }
        else {
            // Handle the case when attrName is a Record
            ExtendedDOMJS.mapObject(attrName, (key, val) => {
                this.forEachElement((e) => {
                    e.setAttribute(key, val); // Set the attribute value for each element
                });
            });
            return this; // Return 'this' to allow method chaining
        }
    }
    prop(prop, value) {
        if (ExtendedDOMJS.isString(prop)) {
            if (value === undefined) {
                return this.mapElements((e) => e[prop]); // Map the elements to get the property values
            }
            else {
                this.forEachElement((e) => {
                    e[prop] = value; // Set the property value for each element
                });
                return this; // Return 'this' to allow method chaining
            }
        }
        else {
            // Handle the case when prop is a Record
            ExtendedDOMJS.mapObject(prop, (key, val) => {
                this.forEachElement((e) => {
                    e[key] = val; // Use type assertion here
                });
            });
            return this; // Return 'this' to allow method chaining
        }
    }
    remove() {
        return this.forEachElement((e) => {
            if (e.parentElement)
                e.parentElement.removeChild(e);
        });
    }
    removeLastChild() {
        return this.forEachElement((e) => {
            if (e.children.length > 0) {
                e.removeChild(e.children[e.children.length - 1]);
            }
        });
    }
    isInViewport() {
        if (!this.el)
            return false;
        const rect = this.el.getBoundingClientRect();
        return (rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth));
    }
}
exports.ExtendedDOMJS = ExtendedDOMJS;
// Utility functions with types
function $(...queries) {
    return new ExtendedDOMJS(Array.from(document.querySelectorAll(queries.join(", "))));
}
function $$(tagName, to) {
    const element = document.createElement(tagName);
    return to
        ? new ExtendedDOMJS([element]).appendTo(to)
        : new ExtendedDOMJS([element]);
}
//# sourceMappingURL=index.js.map
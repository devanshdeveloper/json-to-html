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
    addClass(...className) {
        return this.forEachElement((e) => e.classList.add(...className));
    }
    removeClass(...classToRemove) {
        return this.forEachElement((e) => e.classList.remove(...classToRemove));
    }
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
    click(func) {
        return this.on("click", func);
    }
    appendTo(to) {
        return this.forEachElement((e) => to.el?.appendChild(e));
    }
    html(value) {
        if (value === undefined) {
            return this.mapElements((e) => e.innerHTML);
        }
        else {
            this.forEachElement((e) => {
                e.innerHTML = value;
            });
            return this;
        }
    }
    attr(attrName, value) {
        if (ExtendedDOMJS.isString(attrName)) {
            if (value === undefined) {
                return this.mapElements((e) => e.getAttribute(attrName));
            }
            else {
                this.forEachElement((e) => {
                    e.setAttribute(attrName, value);
                });
                return this;
            }
        }
        else {
            ExtendedDOMJS.mapObject(attrName, (key, val) => {
                this.forEachElement((e) => {
                    e.setAttribute(key, val);
                });
            });
            return this;
        }
    }
    prop(prop, value) {
        if (ExtendedDOMJS.isString(prop)) {
            if (value === undefined) {
                const values = this.mapElements((e) => e[prop]);
                // If accessing a property, return the first element's value only if it's a single-element selection
                return values.length === 1 ? values[0] : values;
            }
            else {
                this.forEachElement((e) => {
                    e[prop] = value;
                });
                return this;
            }
        }
        else {
            ExtendedDOMJS.mapObject(prop, (key, val) => {
                this.forEachElement((e) => {
                    e[key] = val;
                });
            });
            return this;
        }
    }
    styles(styles) {
        if (!styles) {
            return this.mapElements((e) => getComputedStyle(e));
        }
        this.forEachElement((e) => {
            Object.entries(styles).forEach(([key, value]) => {
                if (key in e.style) {
                    e.style[key] = value || "";
                }
                else {
                    console.warn(`Invalid CSS property: ${key}`);
                }
            });
        });
        return this;
    }
    remove() {
        return this.forEachElement((e) => {
            if (e.parentElement)
                e.parentElement.removeChild(e);
        });
    }
    hide(boolean = true, prop = "block") {
        return this.forEachElement((e) => {
            e.style.display = boolean ? "none" : prop;
        });
    }
    disable(boolean) {
        return this.prop("disabled", boolean.toString());
    }
    child() {
        return this.setEls(this.mapElements((e) => Array.from(e.children)).flat());
    }
    removeLastChild() {
        return this.forEachElement((e) => {
            if (e.children.length > 0) {
                e.removeChild(e.children[e.children.length - 1]);
            }
        });
    }
    data(key, value) {
        if (!ExtendedDOMJS.isValid(key))
            return;
        if (ExtendedDOMJS.isValid(value)) {
            this.forEachElement((e) => (e.dataset[key] = value));
        }
        else {
            if (ExtendedDOMJS.isObject(key)) {
                this.forEachElement((e) => {
                    ExtendedDOMJS.mapObject(key, (k, v) => {
                        e.dataset[k] = v;
                    });
                });
            }
            else {
                return this.mapElements((e) => e.dataset[key]);
            }
        }
    }
    appendHTML(string) {
        return this.forEachElement((e) => (e.innerHTML += string));
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
function $(...queries) {
    return new ExtendedDOMJS(Array.from(document.querySelectorAll(queries.join(", "))));
}
function $$(tagName, to) {
    const element = document.createElement(tagName);
    return to
        ? new ExtendedDOMJS([element]).appendTo(to)
        : new ExtendedDOMJS([element]);
}
export { ExtendedDOMJS, $, $$ };
//# sourceMappingURL=index.js.map
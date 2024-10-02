class ExtendedDOMJS {
    constructor(elements, queries) {
        this.setEls(elements, queries);
    }

    // Utility functions to replace undefined methods
    static isString(value) {
        return typeof value === 'string';
    }

    static isValid(value) {
        return value !== null && value !== undefined;
    }

    static isObject(value) {
        return typeof value === 'object' && !Array.isArray(value);
    }

    static mapObject(obj, func) {
        Object.keys(obj).forEach((key) => func(key, obj[key]));
    }



    // Looping over elements
    mapElements(func = () => { }) {
        if (this.els.length === 0) return [];
        return [...this.els.map(func)];
    }

    forEachElement(func = () => { }) {
        if (this.els.length === 0) return this;
        this.els.forEach(func);
        return this;
    }

    everyElement(func) {
        if (this.els.length === 0) return false;
        return this.els.every(func);
    }

    filterElements(func = () => { }) {
        if (this.els.length === 0) return [];
        return new ExtendedDOMJS(this.els.filter(func));
    }

    forEach(func = () => { }) {
        if (this.els.length === 0) return this;
        this.els.forEach((e, i) => func(new ExtendedDOMJS([e]), i));
        return this;
    }

    map(func = () => { }) {
        if (this.els.length === 0) return [];
        return this.els.map((e, i) => func(new ExtendedDOMJS([e]), i));
    }

    filter(func = () => { }) {
        if (this.els.length === 0) return [];
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
        return this.element.attributes;
    }

    get styles() {
        return getComputedStyle(this.el);
    }

    get HTML() {
        return this.el.innerHTML;
    }

    get Text() {
        return this.el.innerText;
    }

    get classes() {
        return this.el.classList;
    }

    get length() {
        return this.els.length;
    }

    get isChecked() {
        return this.el.checked;
    }

    // Setters
    set HTML(value) {
        this.el.innerHTML = value;
    }

    setEls(elements, queries) {
        if (!elements) return this;
        this.elementList = [...elements];
        this.element = this.elementList[0];
        if (queries) this.queries = queries;
        else if (elements.length !== 0) {
            this.queries = [];
            this.forEachElement((e) => {
                let query = e.tagName.toLowerCase();
                if (e.id) query += `#${e.id}`;
                if (e.className) query += `.${e.className}`;
                if (!this.queries.includes(query)) {
                    this.queries.push(query);
                }
            });
        }
        this.eventListenerList = [];
        return this;
    }

    select(...index) {
        if (!index || index.length === 0) return this;
        if (index.length === 1) return new ExtendedDOMJS([this.els[index[0]]]);
        return this.filterElements((e, i) => index.includes(i));
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
            this.eventListenerList.push({ type, func, elementList: this.els });
            return this.forEachElement((e) => e.addEventListener(type, func));
        }
        return this.forEachElement((e) => {
            ExtendedDOMJS.mapObject(type, (x, y) => {
                this.eventListenerList.push({
                    type: x,
                    func: y,
                    elementList: this.els,
                });
                e.addEventListener(x, y);
            });
        });
    }

    click(func = () => { }) {
        return this.on("click", func);
    }

    prop(propertyName, value) {
        if (!ExtendedDOMJS.isValid(propertyName)) return;
        if (ExtendedDOMJS.isValid(value)) {
            return this.forEachElement((e) => {
                e[propertyName] = value;
            });
        } else if (ExtendedDOMJS.isObject(propertyName)) {
            return this.forEachElement((e) => {
                ExtendedDOMJS.mapObject(propertyName, (key, value) => {
                    e[key] = value;
                });
            });
        }
        return this.mapElements((e) => e[propertyName]);
    }

    html(innerHTML) {
        return this.prop("innerHTML", innerHTML);
    }

    hide(boolean = true, prop = "block") {
        return this.forEachElement((e) => {
            e.style.display = boolean ? "none" : prop;
        });
    }

    disable(boolean) {
        return this.prop("disabled", boolean);
    }

    // Document
    appendTo(el) {
        return this.forEachElement((e) => el.el.append(e));
    }

    child() {
        return new ExtendedDOMJS(
            this.mapElements((e) => [...e.children]).flat()
        );
    }

    styles(styles) {
        if (!styles) return this.mapElements((e) => getComputedStyle(e));
        return this.forEachElement((e) => {
            ExtendedDOMJS.mapObject(styles, (key, value) => {
                e.style[key] = value;
            });
        });
    }

    attr(name, value) {
        if (!ExtendedDOMJS.isValid(name)) return;
        if (ExtendedDOMJS.isValid(value)) {
            return this.forEachElement((e) => e.setAttribute(name, value));
        } else if (ExtendedDOMJS.isObject(name)) {
            return this.forEachElement((e) => {
                ExtendedDOMJS.mapObject(name, (key, value) => {
                    e.setAttribute(key, value);
                });
            });
        }
        return this.mapElements((e) => e.getAttribute(name));
    }

    data(key, value) {
        if (!ExtendedDOMJS.isValid(key)) return;
        if (ExtendedDOMJS.isValid(value)) {
            return this.forEachElement((e) => (e.dataset[key] = value));
        } else if (ExtendedDOMJS.isObject(key)) {
            return this.forEachElement((e) => {
                ExtendedDOMJS.mapObject(key, (key, value) => {
                    e.dataset[key] = value;
                });
            });
        }
        return this.mapElements((e) => e.dataset[key]);
    }

    appendHTML(string) {
        return this.forEachElement((e) => (e.innerHTML += string));
    }

    removeLastChild() {
        return this.mapElements((e) => {
            e.removeChild(e.children[e.children.length - 1]);
        });
    }

    isInViewport({ prop }) {
        const isVisibleObj = {};
        const isVisibleArray = this.mapElements((e) => {
            const rect = e.getBoundingClientRect();
            const isVisible =
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <=
                (window.innerWidth || document.documentElement.clientWidth);
            if (prop) {
                return (isVisibleObj[e.dataset[prop]] = isVisible);
            }
        });
        return prop ? isVisibleObj : isVisibleArray;
    }
}

function $(...queries) {
    if (ExtendedDOMJS.isString(queries[0]))
        return new ExtendedDOMJS(document.querySelectorAll(queries), queries);
    return new ExtendedDOMJS(queries);
}

function $$(tagName, to) {
    return to
        ? new ExtendedDOMJS([document.createElement(tagName)]).appendTo(to)
        : new ExtendedDOMJS([document.createElement(tagName)]);
}


module.exports = {
    ExtendedDOMJS,
    $, $$
}
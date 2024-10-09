type HTMLElementProps = keyof HTMLElement;
type Styles = { [key in keyof CSSStyleDeclaration]?: string };
type DataKey = string;
type DataValue = string | undefined;

class ExtendedDOMJS {
  private element: HTMLElement | null;
  private elementList: HTMLElement[];
  private eventListenerList: Array<{
    type: string;
    func: EventListenerOrEventListenerObject;
    elementList: HTMLElement[];
  }>;

  constructor(elements: HTMLElement[]) {
    this.element = null;
    this.elementList = [];
    this.eventListenerList = [];
    this.setEls(elements);
  }

  static isString(value: any): value is string {
    return typeof value === "string";
  }

  static isValid(value: any): boolean {
    return value !== null && value !== undefined;
  }

  static isObject(value: any): value is Record<string, any> {
    return typeof value === "object" && !Array.isArray(value);
  }

  static mapObject(
    obj: Record<string, any>,
    func: (key: string, value: any) => void
  ): void {
    Object.keys(obj).forEach((key) => func(key, obj[key]));
  }

  mapElements(func: (el: HTMLElement) => any = () => {}): any[] {
    if (this.els.length === 0) return [];
    return this.els.map(func);
  }

  forEachElement(func: (el: HTMLElement) => void = () => {}): this {
    if (this.els.length === 0) return this;
    this.els.forEach(func);
    return this;
  }

  everyElement(func: (el: HTMLElement) => boolean): boolean {
    if (this.els.length === 0) return false;
    return this.els.every(func);
  }

  filterElements(
    func: (el: HTMLElement, i: number) => boolean = () => true
  ): ExtendedDOMJS {
    if (this.els.length === 0) return this;
    return new ExtendedDOMJS(this.els.filter(func));
  }

  forEach(func: (el: ExtendedDOMJS, index: number) => void = () => {}): this {
    if (this.els.length === 0) return this;
    this.els.forEach((e, i) => func(new ExtendedDOMJS([e]), i));
    return this;
  }

  map(func: (el: ExtendedDOMJS, index: number) => any = () => {}): any[] {
    if (this.els.length === 0) return [];
    return this.els.map((e, i) => func(new ExtendedDOMJS([e]), i));
  }

  filter(
    func: (el: ExtendedDOMJS, index: number) => boolean = () => true
  ): HTMLElement[] {
    if (this.els.length === 0) return [];
    return this.els.filter((e, i) => func(new ExtendedDOMJS([e]), i));
  }

  get el(): HTMLElement | null {
    return this.element;
  }

  get els(): HTMLElement[] {
    return this.elementList;
  }

  get attri(): NamedNodeMap | undefined {
    return this.el?.attributes;
  }

  get style(): CSSStyleDeclaration | undefined {
    return this.el ? getComputedStyle(this.el) : undefined;
  }

  get HTML(): string {
    return this.el?.innerHTML || "";
  }

  get Text(): string {
    return this.el?.innerText || "";
  }

  get classes(): DOMTokenList | undefined {
    return this.el?.classList;
  }

  get length(): number {
    return this.els.length;
  }

  get isChecked(): boolean | undefined {
    return this.el ? (this.el as HTMLInputElement).checked : undefined;
  }

  set HTML(value: string) {
    if (this.el) this.el.innerHTML = value;
  }

  setEls(elements: HTMLElement[]): this {
    if (!elements) return this;
    this.elementList = [...elements];
    this.element = this.elementList[0];
    this.eventListenerList = [];
    return this;
  }

  select(...index: number[]): ExtendedDOMJS {
    if (!index || index.length === 0) return this;
    return this.filterElements((el: HTMLElement, i) => index.includes(i));
  }

  addClass(...className: string[]): this {
    return this.forEachElement((e) => e.classList.add(...className));
  }

  removeClass(...classToRemove: string[]): this {
    return this.forEachElement((e) => e.classList.remove(...classToRemove));
  }

  on(
    type: string | Record<string, EventListenerOrEventListenerObject>,
    func?: EventListenerOrEventListenerObject
  ): this {
    if (ExtendedDOMJS.isString(type)) {
      this.eventListenerList.push({ type, func: func!, elementList: this.els });
      return this.forEachElement((e) => e.addEventListener(type, func!));
    } else {
      return this.forEachElement((e) => {
        ExtendedDOMJS.mapObject(type, (k, v) => e.addEventListener(k, v));
      });
    }
  }

  off(
    type: string | Record<string, EventListenerOrEventListenerObject>,
    func?: EventListenerOrEventListenerObject
  ): this {
    if (ExtendedDOMJS.isString(type)) {
      return this.forEachElement((e) => e.removeEventListener(type, func!));
    } else {
      return this.forEachElement((e) => {
        ExtendedDOMJS.mapObject(type, (k, v) => e.removeEventListener(k, v));
      });
    }
  }

  click(func: EventListenerOrEventListenerObject) {
    return this.on("click", func);
  }

  appendTo(to: ExtendedDOMJS): this {
    return this.forEachElement((e) => to.el?.appendChild(e));
  }
  html(): string[];
  html(value: string): this;

  html(value?: string): string[] | this {
    if (value === undefined) {
      return this.mapElements((e) => e.innerHTML) as string[];
    } else {
      this.forEachElement((e) => {
        e.innerHTML = value;
      });
      return this;
    }
  }

  attr(attrName: Record<string, any>): this[];
  attr(attrName: string, value?: string): this;
  attr(attrName: string, value?: undefined): any[];

  attr(
    attrName: string | Record<string, any>,
    value?: string | undefined
  ): any[] | this {
    if (ExtendedDOMJS.isString(attrName)) {
      if (value === undefined) {
        return this.mapElements((e) => e.getAttribute(attrName));
      } else {
        this.forEachElement((e) => {
          e.setAttribute(attrName, value);
        });
        return this;
      }
    } else {
      ExtendedDOMJS.mapObject(attrName, (key, val) => {
        this.forEachElement((e) => {
          e.setAttribute(key, val);
        });
      });
      return this;
    }
  }



  prop(
    prop: string | Record<string, any>,
    value?: string | undefined
  ): any | this {
    if (ExtendedDOMJS.isString(prop)) {
      if (value === undefined) {
        const values = this.mapElements((e) => e[prop as HTMLElementProps]);
        // If accessing a property, return the first element's value only if it's a single-element selection
        return values.length === 1 ? values[0] : values;
      } else {
        this.forEachElement((e) => {
          (e as HTMLElement & Record<string, any>)[prop] = value;
        });
        return this;
      }
    } else {
      ExtendedDOMJS.mapObject(prop, (key, val) => {
        this.forEachElement((e) => {
          (e as HTMLElement & Record<string, any>)[key] = val;
        });
      });
      return this;
    }
  }
  
  
  styles(): CSSStyleDeclaration[];
  styles(styles: Styles): this;

  styles(styles?: Styles): CSSStyleDeclaration[] | this {
    if (!styles) {
      return this.mapElements((e) => getComputedStyle(e));
    }

    this.forEachElement((e) => {
      Object.entries(styles).forEach(([key, value]) => {
        if (key in e.style) {
          e.style[key as any] = value || "";
        } else {
          console.warn(`Invalid CSS property: ${key}`);
        }
      });
    });
    return this;
  }

  remove(): this {
    return this.forEachElement((e) => {
      if (e.parentElement) e.parentElement.removeChild(e);
    });
  }

  hide(boolean = true, prop = "block") {
    return this.forEachElement((e) => {
      e.style.display = boolean ? "none" : prop;
    });
  }

  disable(boolean: boolean) {
    return this.prop("disabled", boolean.toString());
  }

  child() {
    return this.setEls(this.mapElements((e) => Array.from(e.children)).flat());
  }

  removeLastChild(): this {
    return this.forEachElement((e) => {
      if (e.children.length > 0) {
        e.removeChild(e.children[e.children.length - 1]);
      }
    });
  }
  data(
    key: DataKey | Record<DataKey, DataValue>,
    value?: DataValue
  ): void | string | void[] {
    if (!ExtendedDOMJS.isValid(key)) return;
    if (ExtendedDOMJS.isValid(value)) {
      this.forEachElement((e) => (e.dataset[key as string] = value));
    } else {
      if (ExtendedDOMJS.isObject(key)) {
        this.forEachElement((e) => {
          ExtendedDOMJS.mapObject(key, (k: DataKey, v: DataValue) => {
            e.dataset[k] = v;
          });
        });
      } else {
        return this.mapElements((e) => e.dataset[key]);
      }
    }
  }

  appendHTML(string: string) {
    return this.forEachElement((e) => (e.innerHTML += string));
  }

  isInViewport(): boolean {
    if (!this.el) return false;
    const rect = this.el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}

function $(...queries: string[]): ExtendedDOMJS {
  return new ExtendedDOMJS(
    Array.from(document.querySelectorAll(queries.join(", ")))
  );
}

function $$(tagName: string, to?: ExtendedDOMJS): ExtendedDOMJS {
  const element = document.createElement(tagName);
  return to
    ? new ExtendedDOMJS([element]).appendTo(to)
    : new ExtendedDOMJS([element]);
}

export { ExtendedDOMJS, $, $$ };

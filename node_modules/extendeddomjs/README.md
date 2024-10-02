# ExtendedDOMJS

`ExtendedDOMJS` is a lightweight and flexible JavaScript utility class that enhances DOM manipulation by providing a more functional and chainable API. It's designed to simplify common DOM-related tasks, allowing developers to interact with elements more easily and efficiently.

## Installation

You can install the package via npm:

```bash
npm install extended-domjs
```

## Usage

### Importing

You can import ExtendedDOMJS and its utility functions into your project:

```js 
const { ExtendedDOMJS, $, $$ } = require('extended-domjs');
```


### Basic Example
```javascript
// Select an element by CSS selector
const el = $('div#myElement');
// Add a class to the element
el.addClass('new-class');

// Set inner HTML
el.html('<p>Hello, world!</p>');

// Add a click event listener
el.click(() => {
  alert('Element clicked!');
});

// Hide the element
el.hide();

// Create a new element and append it to another element
$$('p').html('This is a new paragraph').appendTo(el);
```

## API Reference

### Constructor
```js
new ExtendedDOMJS(elements, queries);
```

 - elements: The list of elements to be managed by the instance.
 - queries: CSS selectors or queries associated with the elements (optional).
### Utility Functions
 
 - isString(value): Returns true if the given value is a string.
 - isValid(value): Checks if the value is not null or undefined.
 - isObject(value): Returns true if the given value is an object.
 - mapObject(obj, func): Iterates over an object's keys and values and applies a function.
### Element Manipulation
 - mapElements(func): Applies a function to all elements and returns an array of results.
 - forEachElement(func): Iterates over each element and applies the given function.
 - everyElement(func): Checks if every element satisfies a given condition.
 - filterElements(func): Filters elements based on a given condition.
### Getters
 - el: Returns the first element in the list.
 - els: Returns the list of elements.
 - attri: Returns the attributes of the first element.
 - styles: Returns the computed styles of the first element.
 - HTML: Gets or sets the inner HTML of the first element.
 - Text: Gets the inner text of the first element.
 - classes: Returns the class list of the first element.
 - length: Returns the number of elements.
 - isChecked: Returns whether the first element is checked (if it's an input).
### Setters
 - setEls(elements, queries): Updates the element list and queries.
 - select(...index): Select elements by index.
 - Class Manipulation
 - addClass(...className): Adds the given classes to each element.
 - removeClass(...classToRemove): Removes the given classes from each element.
### Events
 - on(type, func): Adds an event listener for each element.
 - click(func): Adds a click event listener to each element.
### Property and Attribute Manipulation
 - prop(propertyName, value): Gets or sets a property for each element.
 - html(innerHTML): Sets the innerHTML of each element.
 - hide(boolean, prop): Hides or shows each element based on a boolean value.
 - disable(boolean): Disables or enables each element based on a boolean value.
 - attr(name, value): Gets or sets an attribute for each element.
 - data(key, value): Gets or sets a data attribute for each element.
 - Element Creation and Appending
 - appendTo(el): Appends the current elements to another element.
 - child(): Returns the child elements as a new ExtendedDOMJS instance.
### Miscellaneous
 - styles(styles): Gets or sets the styles of each element.
 - appendHTML(string): Appends HTML to each element.
 - removeLastChild(): Removes the last child element.
 - isInViewport({ prop }): Checks if the elements are in the viewport.

### Utility Functions

#### $
```js 
$(...queries);
```
A selector function that returns an ExtendedDOMJS instance with the elements matching the given CSS query.

#### $$
```js
$$(tagName, to);
```
Creates a new element with the specified tag name. Optionally appends it to another element.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.
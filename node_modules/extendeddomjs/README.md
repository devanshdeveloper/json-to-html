# ExtendedDOMJS

`ExtendedDOMJS` is a lightweight and flexible JavaScript utility class that enhances DOM manipulation by providing a more functional and chainable API. It's designed to simplify common DOM-related tasks, allowing developers to interact with elements more easily and efficiently.

## Installation

You can install the package via npm:

```bash
npm install extendeddomjs
```

## Usage

### Importing

You can import ExtendedDOMJS and its utility functions into your project:

```js
const { ExtendedDOMJS, $, $$ } = require("extendeddomjs");
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

// chaining
$("#element")
  .addClass("new-class")
  .html("<p>Hello, world!</p>")
  .click(() => {
    alert("Element clicked!");
  })
  .hide();


// Create a new element and append it to another element
$$('p').html('This is a new paragraph').appendTo(el);

```
### Complex Example
```js
import { ExtendedDOMJS, $, $$ } from "extendeddomjs";

// Create a shopping cart system
const cartContainer = $$("div")
  .addClass("cart-container")
  .styles({
    width: "300px",
    padding: "20px",
    border: "1px solid #ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  });

// Cart items container
const itemsContainer = $$("div", cartContainer)
  .addClass("items-container")
  .styles({
    maxHeight: "200px",
    overflowY: "auto",
    marginBottom: "15px",
  });

// Total price display
const totalDisplay = $$("div", cartContainer)
  .addClass("total-display")
  .html("Total: $0")
  .styles({
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
  });

// Checkout button
const checkoutButton = $$("button", cartContainer)
  .addClass("checkout-button")
  .html("Checkout")
  .styles({
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  })
  .disable(true); // Initially disabled since the cart is empty

// Append the cart to the body
cartContainer.appendTo($("body"));

// List of available products
const products = [
  { name: "Apple", price: 1.5 },
  { name: "Banana", price: 1.0 },
  { name: "Orange", price: 2.0 },
];

// Add products to the page
const productContainer = $$("div")
  .addClass("product-container")
  .styles({
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
  });

products.forEach((product) => {
  const productCard = $$("div", productContainer)
    .addClass("product-card")
    .styles({
      border: "1px solid #ccc",
      padding: "10px",
      borderRadius: "5px",
      backgroundColor: "#fff",
    });

  $$("p", productCard).html(`${product.name}: $${product.price}`);
  $$("button", productCard)
    .html("Add to Cart")
    .styles({
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "5px",
      border: "none",
      borderRadius: "3px",
      cursor: "pointer",
    })
    .click(() => addToCart(product));
});

// Append products to the body
productContainer.appendTo($("body"));

// Cart state
let cart: { name: string; price: number; quantity: number }[] = [];
let total = 0;

// Function to add product to the cart
function addToCart(product: { name: string; price: number }) {
  const existingProduct = cart.find((item) => item.name === product.name);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

// Function to remove product from the cart
function removeFromCart(productName: string) {
  cart = cart.filter((item) => item.name !== productName);
  updateCart();
}

// Function to update the cart UI and total
function updateCart() {
  // Clear the items container
  itemsContainer.html("");

  // Calculate total and populate cart items
  total = 0;
  cart.forEach((item) => {
    total += item.price * item.quantity;
    const itemRow = $$("div", itemsContainer)
      .addClass("item-row")
      .styles({
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
      });

    $$("span", itemRow).html(`${item.name} x${item.quantity}`);
    $$("span", itemRow).html(`$${(item.price * item.quantity).toFixed(2)}`);

    $$("button", itemRow)
      .html("Remove")
      .styles({
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "3px",
        cursor: "pointer",
      })
      .click(() => removeFromCart(item.name));
  });

  // Update total display
  totalDisplay.html(`Total: $${total.toFixed(2)}`);

  // Enable checkout button if there are items in the cart
  checkoutButton.disable(cart.length === 0);
}

// Handle checkout
checkoutButton.click(() => {
  alert(`Checking out with a total of $${total.toFixed(2)}!`);
  cart = [];
  updateCart();
});

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

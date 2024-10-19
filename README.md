# @devanshdeveloper/json-to-html

`@devanshdeveloper/json-to-html` is an npm package that allows you to dynamically create and manipulate the DOM using JSON-like data structures. It simplifies the creation of HTML elements, applying attributes, styles, event listeners, and more—all based on JSON objects. This package is ideal for generating HTML content from dynamic data and injecting it directly into the DOM.

## Installation

You can install the package via npm:

```bash
npm install @devanshdeveloper/json-to-html
```

## Usage

`@devanshdeveloper/json-to-html` enables you to describe the structure, attributes, and children of elements in JSON format and convert them into HTML. You can dynamically populate and manage the DOM using this structured data.

## Importing

To use the package, import it as follows:

```typescript
import { JSONToHTML } from "@devanshdeveloper/json-to-html";
```

## Example Usage

### 1. Basic Example: Creating Simple HTML Structure

This example demonstrates how to create a simple HTML structure with a div and child elements like h1 and p:

```typescript
import { JSONToHTML } from "@devanshdeveloper/json-to-html";

const jsonToHtml = new JSONToHTML();

const productCardTemplate = {
  "{{#each products}}": {
    tag: "div",
    attributes: {
      styles: {
        width: "300px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        transition: "0.3s",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      },
      addClass: "product-card",
    },
    children: [
      {
        tag: "img",
        attributes: {
          attr: {
            src: "{{#var item.imageUrl}}",
            alt: "{{#var item.imageAlt}}",
          },
          styles: { width: "100%", height: "auto" },
        },
      },
      {
        tag: "div",
        attributes: { styles: { padding: "16px" } },
        children: [
          {
            tag: "h2",
            attributes: {
              html: "{{#var item.title}}",
              styles: { fontSize: "1.2em", marginBottom: "10px" },
            },
          },
          {
            tag: "p",
            attributes: {
              html: "{{#var item.description}}",
              styles: {
                fontSize: "0.9em",
                color: "#666",
                marginBottom: "10px",
              },
            },
          },
          {
            tag: "p",
            attributes: {
              html: "${{#var item.price}}",
              styles: {
                fontSize: "1.1em",
                fontWeight: "bold",
                color: "#1a1a1a",
                marginBottom: "15px",
              },
            },
          },
          {
            tag: "button",
            attributes: {
              html: "Buy Now",
              styles: {
                padding: "10px",
                backgroundColor: "#4CAF50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              },
            },
          },
        ],
      },
    ],
  },
};

const products = [
  {
    title: "Wireless Headphones",
    description: "Noise-canceling headphones",
    price: 99.99,
    imageUrl: "https://via.placeholder.com/300x200?text=Headphones",
    imageAlt: "Wireless Headphones",
  },
  {
    title: "Smartphone Stand",
    description: "Adjustable smartphone stand",
    price: 14.99,
    imageUrl: "https://via.placeholder.com/300x200?text=Smartphone+Stand",
    imageAlt: "Smartphone Stand",
  },
  // Other products here...
];

const compiledTemplate = jsonToHtml.compile(
  {
    tag: "div",
    attributes: {
      styles: { display: "flex", gap: "20px", flexWrap: "wrap" },
    },
    children: productCardTemplate,
  },
  { products }
);
jsonToHtml.convert(compiledTemplate, document.querySelector("#app"));
```

### 2. Handling Conditional Rendering

This example demonstrates conditional rendering within the JSON structure. Let's say you only want to show the "Out of Stock" message if the product is not available.

```typescript
const jsonToHtml = new JSONToHTML();

const conditionalTemplate = {
  tag: "div",
  attributes: {
    addClass: "product-card",
    styles: {
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      marginBottom: "20px",
    },
  },
  children: [
    {
      tag: "h2",
      attributes: {
        html: "{{#var item.name}}",
        styles: {
          fontSize: "18px",
          color: "#333",
        },
      },
    },
    {
      tag: "p",
      attributes: {
        html: "{{#var item.description}}",
        styles: {
          fontSize: "14px",
          color: "#666",
        },
      },
    },
    {
      tag: "p",
      attributes: {
        html: "{{#if item.inStock 'In Stock' 'Out of Stock'}}",
        styles: {
          color: "{{#if item.inStock 'green' 'red'}}",
          fontWeight: "bold",
        },
      },
    },
  ],
};

// Single product data
const productData = {
  item: {
    name: "Gaming Laptop",
    description: "High-performance laptop",
    inStock: false,
  },
};

const compiledTemplate = jsonToHtml.compile(conditionalTemplate, productData);
jsonToHtml.convert(compiledTemplate, document.querySelector("#app"));
```

### 3. Unit Conversion Helper

You can also use the custom helper cssConvert for unit conversion within your styles:

```typescript
const jsonToHtml = new JSONToHTML();

const unitConversionTemplate = {
  tag: "div",
  attributes: {
    styles: {
      height: "{{#cssConvert '150px' 'em'}}",
      width: "{{#cssConvert '300px' 'em'}}",
      backgroundColor: "lightblue",
      textAlign: "center",
      padding: "10px",
    },
    html: "This div has dynamic unit conversion",
  },
};

const compiledTemplate = jsonToHtml.compile(unitConversionTemplate, {});

jsonToHtml.convert(compiledTemplate, document.querySelector("#app"));
```

This example dynamically converts the height and width of the div from px to em.

### Functions

- convert(json: ElementData[], parentElement: HTMLElement | null) : Converts a JSON into DOM elements and appends them to the specified parent element.
  -- json: A JSON array describing the HTML structure.
  -- parentElement: The parent DOM element where the generated elements will be appended.

- compile(template: any, data: any) : Applies dynamic data to a template containing placeholders ({{}}) and returns a populated JSON structure.
  -- template: A JSON object describing the HTML structure.
  -- data: Dynamic data to replace placeholders.

## License

This project is licensed under the MIT License.

## Contributing

We welcome contributions! If you’d like to contribute to @devanshdeveloper/json-to-html, please submit a pull request or file an issue on the GitHub repository.

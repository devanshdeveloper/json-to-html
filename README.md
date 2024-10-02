# json-to-html

json-to-html is an npm package that allows you to dynamically manipulate the DOM using JSON-like data structures. It enables the creation and customization of HTML elements, applying styles, attributes, and event listeners based on JSON objects. This package can be used to generate HTML content from dynamic data and inject it directly into the DOM.

## Installation
To install the package, use npm:

```bash
npm install json-to-html

```

## Usage
You can use json-to-html to dynamically generate HTML content by providing JSON objects that describe the structure, attributes, and children of elements.

## Importing
You can import the package using:

```js
import { JSONToHTML } from "json-to-html";
```

## Example Usage

Here's a basic example of how to use json-to-html to dynamically generate HTML content using native DOM methods like document.querySelector.
```js 
import { JSONToHTML } from "json-to-html";

const jsonToHtml = new JSONToHTML();

const dynamicData = {
  "tag": "div",
  "attributes": {
    "data": ["dish_id", "{{item.id}}"],
    "styles": {
      "display": "flex",
      "flexDirection": "column",
      "gap": "100px"
    }
  },
  "children": [
    {
      "tag": "div",
      "attributes": {
        "html": "{{item.name}}",
        "addClass" : "container",
        "styles": {
          "fontSize": "12px",
          "textAlign": "center"
        }
      }
    },
    {
      "tag": "div",
      "attributes": {
        "html": "{{item.description}}",
        "styles": {
          "fontSize": "12px",
          "textAlign": "center"
        }
      }
    },
    {
      "tag": "div",
      "attributes": {
        "styles": {
          "display": "flex",
          "justifyContent": "space-between"
        }
      },
      "children": [
        {
          "tag": "div",
          "attributes": {
            "styles": {
              "fontSize": "10px"
            },
            "html": "{{item.availability}}"
          }
        },
        {
          "tag": "div",
          "attributes": {
            "styles": {
              "fontSize": "10px"
            },
            "html": "{{item.price}}"
          }
        }
      ]
    }
  ]
};

jsonToHtml.convert(dynamicData, document.querySelector("#app"), { item: { name: "Dish", description: "A delicious dish", availability: "Available", price: "$10.00" } });

```

This example generates a structure with a div container that contains elements for name, description, availability, and price. It uses dynamic placeholders like {{item.name}}, which are replaced with the actual values passed in the dynamicValues parameter.

## Functions

 - convert(json, appendTo, dynamicValues)
  - json: A JSON object that defines the HTML structure and attributes.
  - appendTo: The parent element to which the generated HTML will be appended (e.g., document.querySelector("#app")).
  - dynamicValues: An object containing dynamic data to replace placeholders in the JSON structure (e.g., {{item.name}}).
 - replacePlaceholders(text, dynamicValues): Replaces placeholder values inside strings with actual dynamic data.

 - manipulateDOMFromJSON(elementsArray, parentElement, dynamicValues) 
 Generates HTML elements from a JSON array and appends them to the parent element.

## JSON Structure
 - tag: The HTML tag name (e.g., "div", "span", "h1").
 - attributes: An object containing the attributes or methods to be applied to the element (e.g., "html", "styles", "data", etc.).
 - children: An optional array containing child elements, each represented by a similar JSON structure.

## Example JSON
```json
{
  "tag": "div",
  "attributes": {
    "html": "This is a sample div",
    "styles": {
      "color": "blue",
      "fontSize": "16px"
    }
  },
  "children": [
    {
      "tag": "span",
      "attributes": {
        "html": "Child element"
      }
    }
  ]
}
```
## License
This project is licensed under the MIT License.

## Contributing
Contributions are welcome! If you would like to contribute to json-to-html, feel free to submit a pull request or file an issue.

## Contact
If you have any questions or issues, feel free to reach out via the GitHub repository or open an issue.
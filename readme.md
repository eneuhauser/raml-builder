# RAML Builder

This tool builds separate RAML, YAML, Schema, and JSON files into a single RAML and generates it to HTML.

For reusability, it's nice for one schema to reference an existing schema's definition, but as you're reading through the API document, it's cumbersome to pull in the external definitions. Additionally, it's nice to be able to validate the example output against the schema using tools like [JSON Schema Lint](http://jsonschemalint.com/draft4/), but it does not support external files. By concatenating schema definitions into a self-contained schema, it improves readability, validation, and maintainability.

Example requests / responses could also contain reusable sections that could be shared across multiple responses. This tool enables building example snippets, like a particular resource, that could be embedded in other examples.

## Conventions

RAML Builder follows the following conventions:

* Single `index.raml` at root of the source (additional `*.yaml` files if needed).
* Each schema referenced as `*.schma.json`. These files can reference other `*.schema.def.json` files.
    * `*.schema.def.json` files represent a reusable schema definition.
* Each example referenced as `*.exmample.json`. These files can reference other `*.example.res.json` files.
    * `*.example.res.json` files represent reusable example resources. These can have conditional statements. For example, wrap ID in a conditional so the same example can be used for the creation of a resource and existing resources.

These conventions are part of the `gulpfile.js`. Both the watchers and builders will need to be modified to modify these conventions.

## Usage

1. Run `npm install` to install dependencies (note: `npm run build` also runs `npm install`).
2. Run `npm run start` to enable automatic compilation on save.
    1. Open `./dist/index.html` in a browser to see the generated docs.
    2. Refresh the browser after each save to see the changes.
3. Modify the `index.raml` to add endpoints.
4. Include schemas as you normally would through RAML: `schema: !include resources/resource.schema.json`
5. Within schemas and JSON, reference snippets: `"!include('resources/definitions/resource.schema.def.json')"`
# schematron-runner
[![Build Status](https://travis-ci.org/TimLuq/schematron-runner.svg?branch=master)](https://travis-ci.org/TimLuq/schematron-runner)
[![npm version](https://img.shields.io/npm/v/schematron-runner.svg)](https://npm.im/schematron-runner)
[![license](https://img.shields.io/npm/l/schematron-runner.svg)](https://npm.im/schematron-runner)
[![dependencies Status](https://david-dm.org/TimLuq/schematron-runner/status.svg)](https://david-dm.org/TimLuq/schematron-runner)
[![Coverage Status](https://coveralls.io/repos/github/TimLuq/schematron-runner/badge.svg?branch=master)](https://coveralls.io/github/TimLuq/schematron-runner?branch=master)

A javascript implementation of schematron testing for XML documents. This specifically resolves a need for a package that allows a quick, reliable install for validating HL7 clinical documents, such as C-CDA.

Due to `schematron-runner` being written in TypeScript. This grants typing and typechecking possibilities if this project is used as a libary.

## Table of Contents

* [Install](#install)
  * [Prebuilt files](#prebuilt-files)
* [CLI](#cli)
* [API](#api)
  * [Example](#example-validating-xml)
  * [Interface: Options](#interface-options)
  * [Interface: Results](#interface-results)
  * [clearCache()](#clearcache)
  * [validate(xml, schematron[, options])](#validate-xml-schematron-options)
  * [validateFocused(xml, schematron, defaults[, options])](#validatefocused-xml-schematron-defaults-options)
  * [parseSchematron(document)](#parseschematron-document)
  * [polymorphicDefaults(field, type)](#polymorphicDefaults-field-type)
  * [throwDefaults(field, type)](#throwdefaults-field-type)
  * [webDefaults(field, type)](#webDefaults-field-type)
* [License (MIT)](#license-mit)

## Install

For the CLI application to be available system wide you may wish to install globally.
If you wish to use it for a project a module installation is recommended.

Using `npm`:
```shell
npm install schematron-runner # project
npm install -g schematron-runner # global
```

Using `yarn`:
```shell
yarn add schematron-runner # global
yarn global add schematron-runner #project
```

Building from source:
```shell
git clone git+https://github.com/TimLuq/schematron-runner.git
cd schematron-runner
npm install
```

### Prebuilt files

The published packages includes a number of files in the `build` directory. I recommend you to use a bundler, such as `rollup` or `webpack`, if your project is an end product. But these files are provided for other uses.

- `build/bin.js`
    This file is the CLI program. When installing the package using `yarn` or `npm` this is registerad as te application `schematron-runner`.
- `build/schematron-browser.js`
    This file is a prebuilt UMD version for web use. It removes the polymorphic options and only exposes web compatible versions of all exposed APIs.
- `build/schematron-runner.js`
    This file is a CommonJS module optimized for Node 8+.
- `build/schematron-runner.mjs`
    This file is a ES6 module additionally featuring dynamic imports. This may be used by bundlers, Node's ES module loader or modern browsers using `<script type="module" src="schematron-runner.mjs"></script>`.

## CLI

After installation (or by running `npx`) an executable program named `schematron-runner` is available.

For information about CLI usage run `schematron-runner --help`.

## API

The following APIs are available.

### Example: Validating xml
```javascript
import { validate, validateFocused, webDefaults } from "schematron-runner";
import { promises as fs } from "fs";

const xmlPath = 'someFile.xml';
const schematronPath = 'someFile.sch';

(async () => {
    const xml = await fs.readFile(xmlPath, "utf8");
    const schematron = await fs.readFile(schematronPath, "utf8");

    const results = await validate(xml, schematron);
    // do stuff with results
})();
```
File paths can also be passed to the validator directly. The following lines all return the same results:
```javascript
const results0 = await validate(xml, schematronPath);
const results1 = await validate(xmlPath, schematron);
const results2 = await validate(xmlPath, schematronPath);
```

### Interface: Options

- `options.excludeWarnings` [&lt;boolean&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Determines whether or not warnings should be tested and returned. If this is set to `true` the `result.warnings` array will be empty and the assertions that are detected as warnings will not be included in `result.passed`. *Defaults to `false`.*
- `options.resourceDir` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The path to a directory containing resource files (eg. `voc.xml`) which may be necessary for some schematron tests. *Defaults to `'./'`, the current directory.*
- `options.xmlSnippetMaxLength` [&lt;number&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) An integer which is the maximum length of the `xml` field in validation results. Set to `0` for unlimited length. *Defaults to `200`.*
- `options.DOMParser` [&lt;Promise&lt;class DOMParser&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [&lt;class DOMParser&gt;](https://developer.mozilla.org/en-US/docs/Web/API/DOMParser) Class to use to parse XML documents. *Defaults to global `DOMParser` or one provided by the `xmldom` package.*
- `options.hashFunction` [&lt;Promise&lt;(string) => Promise&lt;string&gt;&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) | [&lt;(string) => Promise&lt;string&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Function used to hash content to a key representing the data. Used for creating caching keys. *Defaults to an SHA1 implementation using `crypto.subtle` or the `crypto` package.*
- `options.loadXMLFile` [&lt;(options, string) => Promise&lt;Document&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Function used to load file paths. Will throw when using the `webDefaults`. *Using `polymorphicDefaults` the default is to use the `fs` package.*
- `options.loadXMLUrl` [&lt;(options, string) => Promise&lt;Document&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Function used to load URL documents. *Defaults to using global `fetch` and `polymorphicDefaults` falls back upon the `node-fetch` package.*


The [`validate`](#validate-xml-schematron-options) and [`validateFocused`](#validatefocused-xml-schematron-defaults-options) functions takes an `options` object as an optional argument. These options may be used to change the behavior of the validation.

Below is an example with warnings disabled and using web compatible defaults:

```javascript
const results = await validateFocused(xml, schematron, webDefaults(), {
    excludeWarnings: true
});
```

### Interface: Results

- `results.errors` [&lt;Object[]&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An array of error objects.
- `results.ignored` [&lt;Object[]&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An array of ingored objects.
- `results.passed` [&lt;Object[]&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An array of passed objects.
- `results.warnings` [&lt;Object[]&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) An array of warning objects.

The `results` object contains arrays `errors`, `warnings`, `passed` and `ignored`.

The `errors`, `passed`, and `warnings` arrays are reported as determined by the schematron and test descriptions.
They are instances of the following form:
```javascript
{
    type: type,                     // "error", "warning" or "info"
    test: test,                     // xpath test
    simplifiedTest: simplifiedTest, // xpath test with resource values included, if applicable, null otherwise
    description: description,       // schematron description of the test case
    line: line,                     // line number of the violating context
    path: path,                     // xpath path of the violating context
    patternId: patternId,           // schematron-assigned pattern id
    ruleId: ruleId,                 // schematron-assigned rule id
    assertionId: assertionId,       // schematron-assigned assertion id
    context: context,               // xpath context of the rule
    xml: xml                        // xml snippet of the violating context
}
```

The `ignored` tests are those that resulted in an exception while running (eg. the test is invalid xpath and could not be parsed properly) and require manual inspection. They are of the following form:
```javascript
{
    errorMessage: errorMessage,     // reason for the exception/ignoring the test
    type: type,                     // "error", "warning" or "info"
    test: test,                     // xpath test
    simplifiedTest: simplifiedTest, // xpath test with resource values included, if applicable, null otherwise
    description: description,       // schematron description of the test case
    patternId: patternId,           // schematron-assigned pattern id
    ruleId: ruleId,                 // schematron-assigned rule id
    assertionId: assertionId,       // schematron-assigned assertion id
    context: context,               // xpath context of the rule
}
```

### clearCache ()

The validator uses a cache to store parsed schematrons, an intermediate data structure used to store revelant schematron information. This reduces the runtime of the validator when validating against the same schematron multiple times.

### validate (xml, schematron[, options])

- `xml` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The string path, url or contents representing an XML document to be validated.
- `schematron` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The string path, url or contents representing a Schematron XML document to use for validation.
- `options` [&lt;Options&gt;](#interface-options) Optional options object overriding default processing.
- Returns: [&lt;Promise&lt;Results&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Equivalent of calling `validateFocused(xml, schematron, polymorphicDefaults(), options)`. See [Interface: Results](#interface-results) for description of the results object.

### validateFocused (xml, schematron, defaults[, options])

- `xml` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The string path, url or contents representing an XML document to be validated.
- `schematron` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The string path, url or contents representing a Schematron XML document to use for validation.
- `defaults` [&lt;Function&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) Function used to fill default options where nothing is provided. See [polymorphicDefaults](#polymorphicdefaults-field-type), [throwDefaults](#throwdefaults-field-type), and [webDefaults](#webdefaults-field-type). Custom functions should fallback upon one of the three provided functions.
- `options` [&lt;Options&gt;](#interface-options) Optional options object overriding default processing.
- Returns: [&lt;Promise&lt;Results&gt;&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Validates a document against a schematron ruleset.
See [Interface: Results](#interface-results) for description of the results object.

### parseSchematron (document)

- `document` [&lt;Document&gt;](https://developer.mozilla.org/en-US/docs/Web/API/Document) Schematron DOM document.
- Returns: [&lt;Object&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) The parsed information representing the schematron document.

Parse a schematron document to an internal representation. Might be usefull for displaying the discovered parts of a schematron file.

### polymorphicDefaults (field, type)

- `field` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the option to provide a default value for.
- `type` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The type of the option provided by the base options object.

The provider will prefer gobal objects as if in a web context. If the global objects are not set it will load external packages to provide the functionality.

For the prebuilt `build/schematron-browser.js` this is an alias for [webDefaults](#webdefaults-field-type).

### throwDefaults (field, type)

- `field` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the option to provide a default value for.
- `type` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The type of the option provided by the base options object.

The provider will throw when called. A full options object must have been used.

### webDefaults (field, type)

- `field` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of the option to provide a default value for.
- `type` [&lt;string&gt;](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The type of the option provided by the base options object.

The provider will use gobal objects as if in a web context. If the global objects are not set it will throw or result in an undefined state.

---
## License (MIT)

Copyright &copy; 2017 [Eric Wadkins](http://www.ericwadkins.com/), 2018-2019 [Tim Lundqvist](https://github.com/TimLuq/).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

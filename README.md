# schematron-runner
[![Build Status](https://travis-ci.org/TimLuq/schematron-runner.svg?branch=master)](https://travis-ci.org/TimLuq/schematron-runner)
[![npm version](https://img.shields.io/npm/v/schematron-runner.svg)](https://npm.im/schematron-runner)
[![license](https://img.shields.io/npm/l/schematron-runner.svg)](https://npm.im/schematron-runner)
[![dependencies Status](https://david-dm.org/TimLuq/schematron-runner/status.svg)](https://david-dm.org/TimLuq/schematron-runner)
[![Coverage Status](https://coveralls.io/repos/github/TimLuq/schematron-runner/badge.svg?branch=master)](https://coveralls.io/github/TimLuq/schematron-runner?branch=master)

A javascript implementation of schematron testing for XML documents. This specifically resolves a need for a package that allows a quick, reliable install for validating HL7 clinical documents, such as C-CDA.

### Install
```
npm install schematron-runner
```

### Validating xml
```javascript
import validator from "schematron-runner";
import { promises as fs } from "fs";

const xmlPath = 'someFile.xml';
const schematronPath = 'someFile.sch';

(async () => {
    const xml = await fs.readFile(xmlPath, "utf8");
    const schematron = await fs.readFile(schematronPath, "utf8");

    const results = await validator.validate(xml, schematron);
    // do stuff with results
})();
```
File paths can also be passed to the validator directly. The following lines all return the same results:
```javascript
const results = await validator.validate(xml, schematronPath);
```
```javascript
const results = await validator.validate(xmlPath, schematron);
```
```javascript
const results = await validator.validate(xmlPath, schematronPath);
```

### Results
`results` is an object containing arrays  `errors`, `warnings`, and `ignoreds`.

**Errors**, **warnings**, and **passed** are reported as determined by the schematron and test descriptions. They are of the following form:
```javascript
{
    type: type,                     // "error" or "warning"
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

**Ignored** tests are those that resulted in an exception while running (eg. the test is invalid xpath and could not be parsed properly) and require manual inspection. They are of the following form:
```javascript
{
    errorMessage: errorMessage,     // reason for the exception/ignoring the test
    type: type,                     // "error" or "warning"
    test: test,                     // xpath test
    simplifiedTest: simplifiedTest, // xpath test with resource values included, if applicable, null otherwise
    description: description,       // schematron description of the test case
    patternId: patternId,           // schematron-assigned pattern id
    ruleId: ruleId,                 // schematron-assigned rule id
    assertionId: assertionId,       // schematron-assigned assertion id
    context: context,               // xpath context of the rule
}
```

### Options
The `validate` function takes in an `options` object as an optional third argument. The three fields that can be included in `options` are as follows:

* **`includeWarnings`**: `true` or `false`, this determines whether or not warnings should be tested and returned. Defaults to `true`.

* **`resourceDir`**: the path to a directory containing resource files (eg. voc.xml) which may be necessary for some schematron tests. Defaults to `'./'`, the current directory.

* **`xmlSnippetMaxLength`**: an integer, which is the maximum length of the `xml` field in validation results. Defaults to `200`. Set to `0` for unlimited length.

Here is an example with warnings disabled:

```javascript
const results = await validator.validate(xml, schematron, { includeWarnings: false });
```

### Cache
The validator uses a cache to store parsed schematrons, an intermediate data structure used to store revelant schematron information. This reduces the runtime of the validator when validating against the same schematron multiple times. You can clear the cache at any time with:
```javascript
validator.clearCache();
```

---
## License (MIT)

Copyright &copy; 2017 [Eric Wadkins](http://www.ericwadkins.com/), 2018 [Tim Lundqvist](https://github.com/TimLuq/).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import test from "ava";

import { validate } from "../../";

// Which xml file to test
const xmlPath = "./test/fixtures/test-2.xml";
// Which schematron to test against
const schematronPath = "./test/fixtures/test-2.sch";
// Which schematron to test against
const schematronPathFunc = "./test/fixtures/test-2-func.sch";

test("schematron include support", async (t) => {
    const results = await validate(xmlPath, schematronPath);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    for (const ig of results.ignored) {
        t.fail("[" + ig.assertionId + "]: " + JSON.stringify(ig.errorMessage));
    }

    t.is(results.errors.length, 1, "return correct number of errors");
    t.is(results.ignored.length, 0, "return correct number of ignored");
    t.is(results.passed.length, 5, "return correct number of passed assertions");
    t.is(results.warnings.length, 0, "return correct number of warnings");
});

test("schematron function support", async (t) => {
    const results = await validate(xmlPath, schematronPathFunc);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    for (const ig of results.ignored) {
        t.fail("[" + ig.assertionId + "]: " + JSON.stringify(ig.errorMessage));
    }

    t.is(results.errors.length, 0, "return correct number of errors");
    t.is(results.ignored.length, 0, "return correct number of ignored");
    t.is(results.passed.length, 6, "return correct number of passed assertions");
    t.is(results.warnings.length, 0, "return correct number of warnings");
});

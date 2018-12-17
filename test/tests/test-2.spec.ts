import test from "ava";

import { validate } from "../../";

// Which xml file to test
const xmlPath = "./test/fixtures/test-2.xml";
// Which schematron to test against
const schematronPath = "./test/fixtures/test-2.sch";

test("schematron include support", async (t) => {
    const results = await validate(xmlPath, schematronPath);

    t.is(typeof results, "object", "return results as an object");

    t.is(typeof results.errorCount, "number", "return errorCount");
    t.is(typeof results.warningCount, "number", "return warningCount");
    t.is(typeof results.ignoredCount, "number", "return ignoredCount");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.warnings), "return warnings array");
    t.true(Array.isArray(results.ignored), "return ignored array");

    t.is(results.errorCount, results.errors.length, "return matching errorCount");
    t.is(results.warningCount, results.warnings.length, "return matching warningCount");
    t.is(results.ignoredCount, results.ignored.length, "return matching ignoredCount");

    t.is(results.errorCount, 1, "return correct number of errors");
    t.is(results.warningCount, 0, "return correct number of warnings");
    t.is(results.ignoredCount, 0, "return correct number of ignored");
});

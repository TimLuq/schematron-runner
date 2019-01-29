import { default as anyTest, TestInterface } from "ava";

import { readFile } from "../helpers/fs.js";

import { validate } from "../../";

interface ITestContext {
    contentXML: string;
    contentSchematron: string;
}

const test = anyTest as TestInterface<ITestContext>;

// Which xml file to test
const xmlPath = "./test/fixtures/test-1.xml";
// Which schematron to test against
const schematronPath = "./test/fixtures/test-1.sch";

test.before(async (t) => {
    const r = await Promise.all([
        readFile(xmlPath, "utf-8"),
        readFile(schematronPath, "utf-8"),
    ]);
    t.context.contentXML = r[0];
    t.context.contentSchematron = r[1];
});

test("structure of validator result containing warnings", async (t) => {
    const results = await validate(t.context.contentXML, t.context.contentSchematron);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 16, "return correct number of errors");
    t.is(results.ignored.length, 1, "return correct number of ignored");
    t.is(results.passed.length, 25, "return correct number of passed assertions");
    t.is(results.warnings.length, 15, "return correct number of warnings");
});

test("structure of validator result without warnings", async (t) => {
    const results = await validate(t.context.contentXML, t.context.contentSchematron, { excludeWarnings: true });

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 16, "return correct number of errors");
    t.is(results.ignored.length, 1, "return correct number of ignored");
    t.is(results.passed.length, 22, "return correct number of passed assertions");
    t.is(results.warnings.length, 0, "return correct number of warnings");
});

test("structure of validator result using XML filepath", async (t) => {
    const results = await validate(xmlPath, t.context.contentSchematron);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 16, "return correct number of errors");
    t.is(results.ignored.length, 1, "return correct number of ignored");
    t.is(results.passed.length, 25, "return correct number of passed assertions");
    t.is(results.warnings.length, 15, "return correct number of warnings");
});

test("structure of validator result using schematron filepath", async (t) => {
    const results = await validate(t.context.contentXML, schematronPath);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 16, "return correct number of errors");
    t.is(results.ignored.length, 1, "return correct number of ignored");
    t.is(results.passed.length, 25, "return correct number of passed assertions");
    t.is(results.warnings.length, 15, "return correct number of warnings");
});

test("structure of validator result using both filepaths", async (t) => {
    const results = await validate(xmlPath, schematronPath);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 16, "return correct number of errors");
    t.is(results.ignored.length, 1, "return correct number of ignored");
    t.is(results.passed.length, 25, "return correct number of passed assertions");
    t.is(results.warnings.length, 15, "return correct number of warnings");

    if (results.ignored && results.ignored.length) {
        for (const ign of results.ignored) {
            t.log("Ignored:", ign.errorMessage);
        }
    }
});

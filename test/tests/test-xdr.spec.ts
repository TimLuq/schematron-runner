import { default as anyTest, TestInterface } from "ava";

import { readFile } from "../helpers/fs.js";

import { IValidateOptions, validate } from "../../";

interface ITestContext {
    contentXML: [string, string];
    contentSchematron: string;
}

const test = anyTest as TestInterface<ITestContext>;

// Which xml file to test
const xmlPath: [string, string] = ["./test/fixtures/xdr/xdrtest1.xml", "./test/fixtures/xdr/xdrtest2.xml"];
// Which schematron to test against
const schematronPath = "./test/fixtures/xdr/ccda.sch";

test.before(async (t) => {
    const r = await Promise.all([
        readFile(schematronPath, "utf-8"),
        readFile(xmlPath[0], "utf-8"),
        readFile(xmlPath[1], "utf-8"),
    ]);
    t.context.contentSchematron = r[0];
    t.context.contentXML = [r[1], r[2]];
});

const options: Partial<IValidateOptions> = {
    resourceDir: "./test/fixtures/xdr/",
};

test("ccda xdr test 1", async (t) => {
    const results = await validate(t.context.contentXML[0], t.context.contentSchematron, options);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 0, "return correct number of errors");
    if (results.ignored.length !== 0) {
        for (const ig of results.ignored) {
            t.log("Ignored: ", ig);
        }
    }
    t.is(results.ignored.length, 0, "return correct number of ignored");
    t.is(results.passed.length, 68, "return correct number of passed assertions");
    t.is(results.warnings.length, 15, "return correct number of warnings");
});

test("ccda xdr test 2", async (t) => {
    const results = await validate(t.context.contentXML[1], t.context.contentSchematron, options);

    t.is(typeof results, "object", "return results as an object");

    t.true(Array.isArray(results.errors), "return errors array");
    t.true(Array.isArray(results.ignored), "return ignored array");
    t.true(Array.isArray(results.passed), "return passed array");
    t.true(Array.isArray(results.warnings), "return warnings array");

    t.is(results.errors.length, 7, "return correct number of errors");
    t.is(results.ignored.length, 0, "return correct number of ignored");
    t.is(results.passed.length, 25, "return correct number of passed assertions");
    t.is(results.warnings.length, 15, "return correct number of warnings");
});

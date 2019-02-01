import test from "ava";

import { ISchematronTestInterface, polymorphicDefaults, testSchematron } from "../../";

// Which xml file to test
const xmlPath = "./test/fixtures/test-2.xml";
// Which schematron to test against
const schematronPath = "./test/fixtures/test-2-xpath.sch";

test("schematron xpath function support", async (t: ISchematronTestInterface) => {
    if (!t.context) {
        t.context = {};
    }
    t.context.schematronOptions = {
        callbackError(code: string, description?: string, errorObject?: any): any {
            if (code === "{http://www.w3.org/2005/xqt-errors}FOER0000" ||
                code === "{urn:dh}expected-error") {
                return true;
            }
        },
    };
    await testSchematron(xmlPath, schematronPath, polymorphicDefaults, t);
});

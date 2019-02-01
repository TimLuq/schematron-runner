import { IValidateOptions } from "./common";
import { CheckOptionsHandler, validateFocused } from "./validator";

export interface ISchematronTestInterface {
    context?: {
        schematronOptions?: Partial<IValidateOptions>;
    };

    pass(label: string): any;
    fail(label: string): any;
    log(text: string): any;
}

/**
 * Run a Schematron ruleset against XML using a testing framework.
 *
 * @param {string} xml XML contents, path or URI to test
 * @param {string} sch Schematron ruleset; contents, path or URI
 * @param {Function} defaults Function to handle defaults (recommendation `polymorphicDefaults`)
 * @param {Object} t test context provided by testing framework, for example AVA
 * @param {string?} prefix optional prefix to add to each line (file path by default if XML is a path)
 */
export async function testSchematron(
    xml: string, sch: string, defaults: CheckOptionsHandler,
    t: ISchematronTestInterface, prefix?: string,
) {
    const defs: CheckOptionsHandler = (a, b, c) => {
        const v = defaults(a, b, c);
        if (v !== undefined) {
            return v;
        }
        if (a === "callbackTrace") {
            return (o: any, l?: string) => {
                t.log(((l || "") + " " + JSON.stringify(o)).trim());
            };
        }
    };
    const r = await validateFocused(xml, sch, defs, t.context && t.context.schematronOptions);
    if (!prefix && typeof prefix !== "string") {
        // tslint:disable-next-line:no-bitwise
        if ((xml.length & 0xFFFFFE00) === 0 && xml.indexOf("\n") === -1 && xml.indexOf("<") === -1) {
            prefix = xml;
        } else {
            prefix = "";
        }
    }

    for (const v of r.passed) {
        const id = (v.assertionId && "[" + v.assertionId + "] ") || "[]";
        t.pass(`${prefix}:${v.line} ${id}${v.description}`);
    }

    for (const v of r.warnings) {
        const id = (v.assertionId && "[" + v.assertionId + "] ") || "[]";
        t.fail(`${prefix}:${v.line} ${id}${v.description}`);
    }

    for (const v of r.ignored) {
        const id = (v.assertionId && " [" + v.assertionId + "]") || " []";
        const e = typeof v.errorMessage === "string" ? v.errorMessage : JSON.stringify(v.errorMessage);
        t.fail(`${prefix}:0 ${id}${e}`);
    }

    for (const v of r.errors) {
        const id = (v.assertionId && "E[" + v.assertionId + "] ") || "E[]";
        t.fail(`${prefix}:${v.line} ${id}${v.description}`);
    }
}

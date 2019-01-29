import { default as anyTest, ExecutionContext } from "ava";

import { IValidateOptions, validate } from "../../";

import cachingFetch from "../helpers/caching-fetch";

// tslint:disable-next-line:no-empty-interface
interface ITestContext {}

interface IExpectedStateCount {
    errors: number;
    warnings: number;
    ignored: number;
    passed: number;
}
interface IExpectedState {
    cc: IExpectedStateCount;
    cu: IExpectedStateCount;
    pc: IExpectedStateCount;
    pu: IExpectedStateCount;
}

const test = anyTest as ((macro: typeof bisValidation, href: string, expected: IExpectedState) => void) & {
    failing: (macro: typeof bisValidation, href: string, expected: IExpectedState) => void;
};

const options: Partial<IValidateOptions> = {
    loadXMLUrl: cachingFetch,
};

const schRepo = "https://raw.githubusercontent.com/OpenPEPPOL/peppol-bis-invoice-3/master";

async function bisValidation(t: ExecutionContext<ITestContext>, href: string, expected: IExpectedState) {
    const startTime = Date.now();
    try {

    const cc = await validate(href, schRepo + "/rules/sch/CEN-EN16931-CII.sch", options);
    t.is(cc.errors.length, expected.cc.errors,
        `Expected number of errors for CEN-EN16931-CII to be ${expected.cc.errors}`);
    t.is(cc.warnings.length, expected.cc.warnings,
        `Expected number of warnings for CEN-EN16931-CII to be ${expected.cc.warnings}`);
    t.is(cc.ignored.length, expected.cc.ignored,
        `Expected number of ignored for CEN-EN16931-CII to be ${expected.cc.ignored}`);
    t.is(cc.passed.length, expected.cc.passed,
        `Expected number of passed for CEN-EN16931-CII to be ${expected.cc.passed}`);

    const cu = await validate(href, schRepo + "/rules/sch/CEN-EN16931-UBL.sch", options);
    t.is(cu.errors.length, expected.cu.errors,
        `Expected number of errors for CEN-EN16931-UBL to be ${expected.cu.errors}`);
    t.is(cu.warnings.length, expected.cu.warnings,
        `Expected number of warnings for CEN-EN16931-UBL to be ${expected.cu.warnings}`);
    t.is(cu.ignored.length, expected.cu.ignored,
        `Expected number of ignored for CEN-EN16931-UBL to be ${expected.cu.ignored}`);
    t.is(cu.passed.length, expected.cu.passed,
        `Expected number of passed for CEN-EN16931-UBL to be ${expected.cu.passed}`);

    const pc = await validate(href, schRepo + "/rules/sch/PEPPOL-EN16931-CII.sch", options);
    t.is(pc.errors.length, expected.pc.errors,
        `Expected number of errors for PEPPOL-EN16931-CII to be ${expected.pc.errors}`);
    t.is(pc.warnings.length, expected.pc.warnings,
        `Expected number of warnings for PEPPOL-EN16931-CII to be ${expected.pc.warnings}`);
    t.is(pc.ignored.length, expected.pc.ignored,
        `Expected number of ignored for PEPPOL-EN16931-CII to be ${expected.pc.ignored}`);
    t.is(pc.passed.length, expected.pc.passed,
        `Expected number of passed for PEPPOL-EN16931-CII to be ${expected.pc.passed}`);

    const pu = await validate(href, schRepo + "/rules/sch/PEPPOL-EN16931-UBL.sch", options);
    t.is(pu.errors.length, expected.pu.errors,
        `Expected number of errors for PEPPOL-EN16931-UBL to be ${expected.pu.errors}`);
    t.is(pu.warnings.length, expected.pu.warnings,
        `Expected number of warnings for PEPPOL-EN16931-UBL to be ${expected.pu.warnings}`);
    t.is(pu.ignored.length, expected.pu.ignored,
        `Expected number of ignored for PEPPOL-EN16931-UBL to be ${expected.pu.ignored}`);
    t.is(pu.passed.length, expected.pu.passed,
        `Expected number of passed for PEPPOL-EN16931-UBL to be ${expected.pu.passed}`);

    } finally {
        t.log(t.title + " time: " + ((startTime - Date.now()) / 1000) + "s");
    }
}

// tslint:disable-next-line:no-namespace
(bisValidation as any).title = (title: string | undefined, href: string) => {
    return `Validate PEPPOL BIS3: ${title || href.replace(/^.*\//, "")}`;
};

const fileRepo = "https://raw.githubusercontent.com/OpenPEPPOL/peppol-bis-invoice-3/master";

test.failing(bisValidation, `${fileRepo}/rules/examples/Allowance-example.xml`, {
    cc: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
    cu: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
    pc: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
    pu: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
});

test.failing(bisValidation, `${fileRepo}/rules/examples/Vat-category-S.xml`, {
    cc: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
    cu: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
    pc: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
    pu: { errors: 0, warnings: 0, ignored: 0, passed: 0 },
});

import { ICompletedValidation, polymorphicDefaults, validateFocused } from "./validator";

const xmls: string[] = [];
const schs: string[] = [];

let state: undefined | boolean;

const processing = {
    ignoredAsErrors: false,
    warningsAsErrors: false,

    showErrors: true,
    showPassed: false,
    showWarnings: true,
};

function runValidation<T extends string = string>(sch: string, xml: T): Promise<[T, ICompletedValidation]> {
    return validateFocused(xml, sch, polymorphicDefaults).then<[T, ICompletedValidation]>((x) => [xml, x]);
}

function main(argv: string[]): Promise<boolean> {

    for (const arg of argv) {
        if (state === undefined) {
            if (arg === "--ignored-as-errors") {
                processing.ignoredAsErrors = true;
                continue;
            } else if (arg === "--warnings-as-errors") {
                processing.warningsAsErrors = true;
                continue;
            } else if (arg === "--show-passed") {
                processing.showPassed = true;
                continue;
            } else if (arg === "--hide-passed") {
                processing.showPassed = false;
                continue;
            } else if (arg === "--show-errors") {
                processing.showErrors = true;
                continue;
            } else if (arg === "--hide-errors") {
                processing.showErrors = false;
                continue;
            } else if (arg === "--show-warnings") {
                processing.showWarnings = true;
                continue;
            } else if (arg === "--hide-warnings") {
                processing.showWarnings = false;
                continue;
            } else if (arg === "--help") {
                const options = {
                    "--ignored-as-errors": "Generate an exit code failiure if any ignored rule are encountered.",
                    "--warnings-as-errors": "Generate an exit code failiure if any warnings are encountered.",

                    "--hide-passed": "Hide all passed rules.",
                    "--show-passed": "Show all passed rules.",

                    "--hide-errors": "Hide all failed rules.",
                    "--show-errors": "Show all failed rules.",

                    "--hide-warnings": "Hide all warnings from rules.",
                    "--show-warnings": "Show all warnings from rules.",

                    "--sch": "The rest of the arguments (or until `--xml` is found) are counted as schematron files.",
                    "--xml": "The rest of the arguments (or until `--sch` is found) are counted as xml files.",
                };

                // tslint:disable-next-line:no-console
                console.log(`
Usage:   schematron-runner [OPTIONS...] FILE...

## FILES
Many files may be specified. If neither \`--xml\` or \`--sch\` has been encountered previously ${""
}the file is interpreted as an XML file unless it has the extension \`.sch\`.

## OPTIONS
${(Object.keys(options) as Array<keyof typeof options>).map((option) =>
    `- ${option}${"                    ".substring(option.length)}${options[option]}`)
    .join("\n")}
`.trim());
                return Promise.resolve(true);
            }
        }
        if (arg === "--sch") {
            state = true;
        } else if (arg === "--xml") {
            state = false;
        } else {
            let curr: boolean = state || false;
            if (state === undefined) {
                const lc = arg.substring(arg.length - 4).toLowerCase();
                if (lc === ".sch") {
                    curr = true;
                } else if (lc === ".xml") {
                    curr = false;
                }
            }
            if (state) {
                schs.push(arg);
            } else {
                xmls.push(arg);
            }
        }
    }

    const res: Array<Promise<boolean>> = [];

    for (const sch of schs) {
        res.push(Promise.all(xmls.map((xml) => runValidation(sch, xml)))
            .then((results) => {
                return results.reduce((s, [xml, r]) => {
                    const ret = r.errors.length !== 0 ||
                        (processing.warningsAsErrors && r.warnings.length !== 0) ||
                        (processing.ignoredAsErrors && r.ignored.length !== 0);

                    if (processing.showPassed) {
                        for (const v of r.passed) {
                            const id = (v.assertionId && "[" + v.assertionId + "] ") || "";
                            // tslint:disable-next-line:no-console
                            console.log("%s:%s ✓ %s%s", xml, v.line, id, v.description);
                        }
                    }

                    if (processing.showWarnings) {
                        for (const v of r.warnings) {
                            const id = (v.assertionId && "[" + v.assertionId + "] ") || "";
                            // tslint:disable-next-line:no-console
                            console.warn("%s:%s 🔸 %s%s", xml, v.line, id, v.description);
                        }
                    }

                    for (const v of r.ignored) {
                        const id = (v.assertionId && " [" + v.assertionId + "]") || "";
                        // tslint:disable-next-line:no-console
                        console.error("%s:%s ⚠%s", xml, "", id, v.errorMessage);
                    }

                    if (processing.showErrors) {
                        for (const v of r.errors) {
                            const id = (v.assertionId && "[" + v.assertionId + "] ") || "";
                            // tslint:disable-next-line:no-console
                            console.error("%s:%s 🔴 %s%s", xml, v.line, id, v.description);
                        }
                    }

                    return ret && s;
                }, true);
            }));
    }

    return Promise.all(res).then((rs) => rs.reduce((s, v) => s && v, true));
}

main(process.argv.slice(2)).then((r) => {
    if (!r) {
        process.exitCode = 1;
    }
}, (e) => {
    // tslint:disable-next-line:no-console
    console.error(e);
    process.exitCode = 2;
});

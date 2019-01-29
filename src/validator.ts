
import parseSchematron, { IAssertion, IFunction, IParsedSchematron, IRule } from "./parse-schematron";
import testAssertion, { ITestAssertionError, ITestAssertionResult } from "./test-assertion";

import {
    loadXML, loadXmlFilePoly, loadXmlUrlPoly,
    replaceTestWithExternalDocument, schematronIncludes,
} from "./include-external-document";

import xpath, { createOptionsEvaluator } from "./xpath-helper";

import { IValidateOptions } from "./common";

import sha1 from "./sha1";

let dom: Promise<{ new(): DOMParser }>;

// Parsed object cache
const parsedMap = new Map<string, Promise<IParsedSchematron>>();

export function clearCache() {
    parsedMap.clear();
}

interface IContextState extends IValidateOptions {
    contexts: Map<string, Node[]>;
    document: Document;
    DOM: { new(): DOMParser; };
    select: xpath.IXPathSelect;
}

interface IRuleResult {
    assertionId: string;
    description: string;
    results: ITestAssertionResult[] | ITestAssertionError;
    simplifiedTest: null | string;
    test: string;
    type: "warning" | "error";
}

interface IRuleIgnored {
    assertionId: string;
    ignored: true;
    errorMessage: string;
    simplifiedTest: null | string;
    test: string;
    type: "warning" | "error";
}

export interface IValidationResult {
    type: "error" | "warning";
    test: string;
    simplifiedTest: string | null;
    description: string;
    line: number | null;
    path: string;
    patternId: string;
    ruleId?: string;
    assertionId: string;
    context: string;
    xml: string | null;
}

export interface IIgnoredResult {
    type: "error" | "warning";
    test: string;
    simplifiedTest: string | null;
    patternId: string;
    ruleId?: string;
    errorMessage: string | ITestAssertionError | ITestAssertionError[];
    assertionId: string;
    context: string;
}

export interface ICompletedValidation {
    errors: IValidationResult[];
    ignored: IIgnoredResult[];
    passed: IValidationResult[];
    warnings: IValidationResult[];
}

function isRuleIgnored(result: IRuleResult | IRuleIgnored): result is IRuleIgnored {
    return (result as IRuleIgnored).ignored || false;
}

function isAssertionIgnored(results: ITestAssertionResult[] | ITestAssertionError): results is ITestAssertionError {
    return (results as ITestAssertionError).ignored || false;
}

function processFunction(t: IFunction): (c: xpath.XPathContext, ...r: xpath.XPathType[]) => xpath.XPathType {
    return (c, ...args) => {
        if (args.length !== t.params.length) {
            throw new Error("Argument length mismatch of function " + t.name
                + ". Actual: " + args.length + ", expected: " + t.params.length);
        }

        // cast parameters types
        for (let i = 0; i < args.length; i++) {
            const p = t.params[i];
            if (p.type) {
                const pos = p.type.indexOf(":");
                const ns = pos === -1 ? "" : c.namespaceResolver.getNamespace(
                    p.type.substring(0, pos),
                    c.contextNode as Node,
                );
                const ln = pos === -1 ? p.type : p.type.substring(pos + 1);
                const fn = c.functionResolver.getFunction(ln, ns || "");
                if (!fn) {
                    throw new Error("Can not find parameter cast function " + JSON.stringify(p.type));
                }
                args[i] = fn(c, args[i]).evaluate(c) as xpath.XPathType;
            }
        }

        // create a copy of the context
        const c2 = {
            ...c,
        };

        // the new context should handle local variables
        const computedVars = new Map<string, xpath.XPathType>();
        c2.variableResolver = new (class extends xpath.VariableResolver {
            public getVariable(ln: string, ns: string): xpath.XPathType | null {
                let ret: xpath.XPathType | undefined = computedVars.get(ln);
                if (ret) {
                    return ret;
                }

                // resolve locally defined variables
                for (const v of t.variables) {
                    if (v.name === ln) {
                        const e = xpath.parse(v.select);
                        ret = e.evaluate({
                            functions: c2.functionResolver,
                            namespaces: c2.namespaceResolver,
                            variables: c2.variableResolver,

                            node: c2.contextNode,
                        }) as xpath.XPathType;
                        computedVars.set(ln, ret);
                        return ret;
                    }
                }

                // resolve to function parameters
                for (let i = 0; i < t.params.length; i++) {
                    if (t.params[i].name === ln) {
                        ret = args[i];
                        return ret;
                    }
                }

                // fallback to global values
                return c.variableResolver.getVariable(ln, ns);
            }
        })();

        { // evaluate the function body
            const e = xpath.parse(t.select);
            let ret = e.evaluate({
                functions: c2.functionResolver,
                namespaces: c2.namespaceResolver,
                variables: c2.variableResolver,

                node: c2.contextNode,
            });
            if (ret && t.type) {
                const pos = t.type.indexOf(":");
                const ns = pos === -1 ? "" : c.namespaceResolver.getNamespace(
                    t.type.substring(0, pos),
                    c.contextNode as Node,
                );
                const ln = pos === -1 ? t.type : t.type.substring(pos + 1);
                const fn = c.functionResolver.getFunction(ln, ns || "");
                if (!fn) {
                    throw new Error("Can not find return cast function " + JSON.stringify(t.type));
                }
                ret = fn(c, ret).evaluate(c);
            }
            return ret as xpath.XPathType;
        }
    };
}

const defaultOptionsBase = Object.freeze({
    excludeWarnings: false,
    resourceDir: "./",
    xmlSnippetMaxLength: 200,
});

type SchematronDefaultOptions = Readonly<Partial<IValidateOptions> & typeof defaultOptionsBase>;

const defaultOptionsPartial: SchematronDefaultOptions = defaultOptionsBase;

function tc(o: any) { return typeof o; }

function checkOptions(options: Partial<IValidateOptions>, handler: CheckOptionsHandler): IValidateOptions {
    const f = <T extends keyof IValidateOptions>(k: T) => handler<T>(k, typeof options[k], options[k]);
    if (typeof options.DOMParser !== "function" &&
            !(typeof options.DOMParser === "object" &&
                typeof (options.DOMParser as any).then === "function")) {
        options.DOMParser = f("DOMParser");
    }
    if (typeof options.loadXMLFile !== "function") {
        options.loadXMLFile = f("loadXMLFile");
    }
    if (typeof options.loadXMLUrl !== "function") {
        options.loadXMLUrl = f("loadXMLUrl");
    }
    if (typeof options.resourceDir !== "string") {
        options.resourceDir = f("resourceDir");
    }
    if (typeof options.excludeWarnings !== "boolean") {
        options.excludeWarnings = f("excludeWarnings");
    }
    if (typeof options.xmlSnippetMaxLength !== "number" || isNaN(options.xmlSnippetMaxLength)) {
        options.xmlSnippetMaxLength = f("xmlSnippetMaxLength");
    }
    return options as IValidateOptions;
}

export function polymorphicDefaults<T extends keyof IValidateOptions>(field: T, type: ReturnType<typeof tc>):
        IValidateOptions[T] {
    if (field in defaultOptionsBase) {
        return (defaultOptionsBase as any)[field];
    }
    if (field === "DOMParser") {
        if (!dom) {
            if (typeof DOMParser === "undefined") {
                dom = import("xmldom").then((x) => x.DOMParser);
            } else {
                dom = Promise.resolve(DOMParser);
            }
        }
        return dom;
    }
    if (field === "loadXMLFile") {
        return loadXmlFilePoly;
    }
    if (field === "loadXMLUrl") {
        return loadXmlUrlPoly;
    }
}

export function webDefaults<T extends keyof IValidateOptions>(field: T, type: ReturnType<typeof tc>):
        IValidateOptions[T] {
    if (field in defaultOptionsBase) {
        return (defaultOptionsBase as any)[field];
    }
    if (field === "DOMParser") {
        if (!dom) {
            if (typeof DOMParser === "undefined") {
                dom = import("xmldom").then((x) => x.DOMParser);
            } else {
                dom = Promise.resolve(DOMParser);
            }
        }
        return dom;
    }
    if (field === "loadXMLFile") {
        return function loadXMLFile() {
            throw new Error([
                "No implementation file loader by default.",
                "Implement a custom loadXMLFile.",
            ].join(" "));
        };
    }
    if (field === "loadXMLUrl") {
        return async function loadXMLUrl(options, url) {
            if (typeof fetch === "undefined") {
                throw new Error([
                    "No global fetch implementation found.",
                    "Use a newer context or implement a custom loadXMLUrl.",
                ].join(" "));
            }
            const f = fetch(url);
            const d = await options.DOMParser;
            const r = await f;
            const t = await r.text();
            return new d().parseFromString(t, "application/xml");
        };
    }
}

export function throwDefaults<T extends keyof IValidateOptions>(
    field: T, type: ReturnType<typeof tc>, value: any,
): IValidateOptions[T] {
    // tslint:disable-next-line:no-console
    console.error("Unexpected value of type %s for option field %s:", type, JSON.stringify(field), value);
    throw new TypeError("Unexpected value of type " + type + " for option field " + JSON.stringify(field));
}

export async function validate(xml: string, schematron: string, options?: Partial<IValidateOptions>) {
    return validateFocused(xml, schematron, polymorphicDefaults, options);
}

export async function validateFocused(
    xml: string, schematron: string, defaults: CheckOptionsHandler, options?: Partial<IValidateOptions>,
) {
    const opts: IValidateOptions = checkOptions(checkOptions({ ...(options || {}) }, defaults), throwDefaults);

    const DOM = opts.DOMParser = await opts.DOMParser;

    //// read xml
    let xmlDoc: Document;

    if (xml.trim().indexOf("<") !== 0) {
        // If not valid xml, it might be a URI or filepath
        try {
            xmlDoc = await loadXML(opts, opts.resourceDir, xml);
        } catch (err) {
            // tslint:disable-next-line:max-line-length
            const ne = new Error("Detected URL as xml parameter, but file " + JSON.stringify(xml) + " could not be read: " + err);
            (ne as any).innerError = err;
            throw ne;
        }
    } else {
        xmlDoc = new DOM().parseFromString(xml, "application/xml");
    }

    //// read schematron
    let parsedSchematron: Promise<IParsedSchematron>;

    // If not validate xml, it might be a filepath
    if (schematron.trim().indexOf("<") !== 0) {
        try {
            const lookupKey = ">>" + opts.resourceDir + ">>" + schematron;
            const schCch = parsedMap.get(lookupKey);
            if (schCch) {
                parsedSchematron = schCch;
            } else {
                parsedSchematron = Promise.resolve(loadXML(opts, opts.resourceDir, schematron, []))
                    .then(parseSchematron);
                parsedMap.set(lookupKey, parsedSchematron);
            }
        } catch (err) {
            // tslint:disable-next-line:max-line-length
            const ne = new Error("Detected URL as schematron parameter, but file " + JSON.stringify(schematron) + " could not be read: " + err);
            (ne as any).innerError = err;
            throw ne;
        }
    } else {
        const hash = await sha1(schematron);
        parsedSchematron = parsedMap.get(hash) || (() => {
            // Load schematron doc
            // tslint:disable-next-line:max-line-length
            const d = schematronIncludes(opts, new DOM().parseFromString(schematron, "application/xml"), opts.resourceDir).then(parseSchematron);

            // Cache parsed schematron
            parsedMap.set(hash, d);
            return d;
        })();
    }

    const { namespaceMap, patternRuleMap, ruleMap, functions } = await parsedSchematron;

    // Create selector object, initialized with namespaces
    const nsObj = new Map<string, string[]>();
    for (const [nspf, uri] of namespaceMap.entries()) {
        let a = nsObj.get(uri);
        if (!a) {
            nsObj.set(uri, a = []);
        }
        a.push(nspf);
    }

    const errors: IValidationResult[] = [];
    const warnings: IValidationResult[] = [];
    const ignored: IIgnoredResult[] = [];
    const passed: IValidationResult[] = [];

    const evaluatorOptions: xpath.IXPathEvaluatorOptions = {
        namespaces(prefix) {
            return namespaceMap.get(prefix) || null;
        },
    };
    // tslint:disable-next-line:max-classes-per-file
    evaluatorOptions.functions = new (class extends xpath.FunctionResolver {
        public constructor() {
            super();
            this.addStandardFunctions();
        }
        public getFunction(ln: string, ns: string) {
            const prefs = (ns && nsObj.get(ns)) || [];
            for (const p of prefs) {
                const t = functions.get(p + ":" + ln);
                if (t) {
                    return processFunction(t);
                }
            }
            return super.getFunction(ln, ns);
        }
    })();

    const sel = createOptionsEvaluator(evaluatorOptions);

    const state: IContextState = {
        ...opts,
        DOM,
        contexts: new Map<string, any>(),
        document: xmlDoc,
        select: sel as xpath.IXPathSelect,
    };

    for (const [patternId, rules] of patternRuleMap.entries()) {
        for (const ruleAssertion of rules) {
            if (!ruleAssertion.abstract) {
                const context = ruleAssertion.context as string;
                const assertionResults = await checkRule(state, ruleAssertion, ruleMap);

                for (const asserRes of assertionResults) {
                    if (isRuleIgnored(asserRes)) {
                        const { type, test, simplifiedTest, assertionId } = asserRes;
                        ignored.push({
                            assertionId,
                            context,
                            errorMessage: asserRes.errorMessage,
                            patternId,
                            ruleId: ruleAssertion.id,
                            simplifiedTest,
                            test,
                            type,
                        });
                    } else {
                        const { type, test, simplifiedTest, description, assertionId } = asserRes;
                        if (isAssertionIgnored(asserRes.results)) {
                            ignored.push({
                                assertionId,
                                context,
                                errorMessage: asserRes.results,
                                patternId,
                                ruleId: ruleAssertion.id,
                                simplifiedTest,
                                test,
                                type,
                            });
                        } else {
                            for (const res of asserRes.results) {
                                const { result, line, path, xml: xmlSnippet } = res;
                                const obj: IValidationResult = {
                                    assertionId,
                                    context,
                                    description,
                                    line,
                                    path,
                                    patternId,
                                    ruleId: ruleAssertion.id,
                                    simplifiedTest,
                                    test,
                                    type,
                                    xml: xmlSnippet,
                                };
                                if (!result) {
                                    if (type === "error") {
                                        errors.push(obj);
                                    } else {
                                        warnings.push(obj);
                                    }
                                } else {
                                    passed.push(obj);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    const ret: ICompletedValidation = {
        errors,
        ignored,
        passed,
        warnings,
    };
    return ret;
}

// tslint:disable-next-line:max-line-length
async function checkRule(state: IContextState, rule: IRule, ruleMap: Map<string, IRule>, contextOverride?: string) {
    const results: Array<IRuleResult | IRuleIgnored> = [];
    const assertionsAndExtensions = rule.assertionsAndExtensions;
    const context = contextOverride || rule.context as string;

    // Determine the sections within context, load selected section from cache if possible
    let selected = state.contexts.get(context) as Node[];
    let contextModified = context;
    if (!selected) {
        if (context) {
            if (context.indexOf("/") !== 0) {
                contextModified = "//" + context;
            }
            selected = state.select(contextModified, state.document) as Node[];
        } else {
            selected = [state.document];
        }
        state.contexts.set(context, selected);
    }

    for (const assorext of assertionsAndExtensions) {
        if (assorext.type === "assertion") {
            const level = assorext.level;
            let test = assorext.test;

            // Extract values from external document and modify test if a document call is made
            const originalTest = test;
            if (/=document\((\'[-_.A-Za-z0-9]+\'|\"[-_.A-Za-z0-9]+\")\)/.test(test)) {
                try {
                    test = await replaceTestWithExternalDocument(state, test, state.resourceDir);
                } catch (err) {
                    // console.warn("SCHEMATRON->checkRule:", err.message);
                    results.push({
                        assertionId: assorext.id,
                        errorMessage: err.message,
                        ignored: true,
                        simplifiedTest: null,
                        test: originalTest,
                        type: level,
                    });
                    continue;
                }
            }

            let simplifiedTest = null;
            if (originalTest !== test) {
                simplifiedTest = test;
            }
            if (level === "error" || !state.excludeWarnings) {
                const result = testAssertion(test, selected, state.select,
                        state.document, state.resourceDir, state.xmlSnippetMaxLength);
                results.push({
                    assertionId: assorext.id,
                    description: getDescription(assorext, result),
                    results: result,
                    simplifiedTest,
                    test: originalTest,
                    type: level,
                } as IRuleResult);
            }
        } else {
            const extrule = ruleMap.get(assorext.rule);
            if (!extrule) {
                // tslint:disable-next-line:no-console
                console.error("SCHEMATRON->checkRule: Missing extension rule: %s", assorext.rule);
            } else {
                results.push(...await checkRule(state, extrule, ruleMap, context));
            }
        }
    }
    return results;
}

function getDescription(assorext: IAssertion, result: ITestAssertionError | ITestAssertionResult[]): string {
    return assorext.description.map((d) => {
        if (typeof d === "string") {
            return d;
        }
        if (d.tag === "name") {
            if (isAssertionIgnored(result)) {
                return "<name />";
            } else {
                return result[0].path.replace(/^.*\//, "").replace(/\[.*$/, "");
            }
        }
        return "";
    }).join(" ");
}

export type CheckOptionsHandler =
    <T extends keyof IValidateOptions>(field: T, type: ReturnType<typeof tc>, value: any) => IValidateOptions[T];

import xpath, { createOptionsEvaluator } from "./xpath-helper";

function* getNamedChildren(parent: Element, localName: string, ns?: string): IterableIterator<Element> {
    const children = parent.childNodes;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < children.length; i++) {
        const child = children[i] as Element;
        if (child.localName === localName && (ns === undefined || ns === child.namespaceURI)) {
            yield child;
        }
    }
}

export interface IDescriptionName {
    tag: "name";
}
export interface IDescriptionValueOf {
    tag: "value-of";
}

export type IDescription = string | IDescriptionName | IDescriptionValueOf;

export type IAssertionOrExtension = IAssertion | IExtension;

export interface IExtension {
    type: "extension";
    rule: string;
}

export type IAssertionLevel = "error" | "warning" | "info";

export interface IAssertion {
    type: "assertion";
    level: IAssertionLevel;
    id: string;
    test: string;
    description: IDescription[];
}

export interface IFunction {
    name: string;
    type: string;
    params: Array<{ name: string; type?: string; }>;
    variables: Array<{ name: string; select: string; }>;
    select: string;
}

export interface IRule {
    abstract: boolean;
    assertionsAndExtensions: IAssertionOrExtension[];
    context: null | string;
    id?: string;
}

export interface IParsedSchematron {
    functions: Map<string, IFunction>;
    namespaceMap: Map<string, string>;
    patternRuleMap: Map<string, IRule[]>;
    ruleMap: Map<string, IRule>;
}

function getVal<O extends object, A1 extends keyof O>(o: O, a1: A1): O[A1] | undefined;
// tslint:disable-next-line:max-line-length
function getVal<O extends object, A1 extends keyof O, A2 extends keyof O[A1]>(o: O, a1: A1, a2: A2): O[A1][A2] | undefined;
// tslint:disable-next-line:max-line-length
function getVal<O extends object, A1 extends keyof O, A2 extends keyof O[A1], A3 extends keyof O[A1][A2]>(o: O, a1: A1, a2: A2, a3: A3): O[A1][A2][A3] | undefined;
// tslint:disable-next-line:max-line-length
function getVal<O extends object>(o: O, ...args: Array<string | number | symbol>): any {
    let v: any = o;
    for (const a of args) {
        if (!v) {
            return undefined;
        }
        v = v[a];
    }
    return v;
}

let gEvalOpts: xpath.IXPathEvaluatorOptions | undefined;

function getEvalOptions() {
    if (gEvalOpts) {
        return gEvalOpts;
    }
    const func = new xpath.FunctionResolver();
    func.addStandardFunctions();
    gEvalOpts = {
        functions: func,
    };
    return gEvalOpts;
}

export default function parseSchematron(doc: Document) {
    const namespaceMap = new Map<string, string>();
    const abstractPatterns = new Set<string>();
    const patternInstances = new Map<string, { isA: string; params: Map<string, string>; }>();
    const patternLevelMap = new Map<string, IAssertionLevel>();
    const patternRuleMap = new Map<string, IRule[]>();
    const ruleMap = new Map<string, IRule>();
    const functions = new Map<string, IFunction>();

    const sel = createOptionsEvaluator(getEvalOptions());

    //// Namespace mapping
    const namespaces = sel('//*[local-name()="ns"]', doc) as Element[];
    for (const namespace of namespaces) {
        const pf = namespace.getAttribute("prefix");
        const ns = namespace.getAttribute("uri");
        if (pf && ns) {
            namespaceMap.set(pf, ns);
        }
    }

    //// Function definitions
    const functionList = sel('//*[local-name()="function"]', doc) as Element[];
    for (const func of functionList) {
        const select = sel('//*[local-name()="value-of"]/@select', func) as Attr[];
        const f: IFunction = {
            name: func.getAttribute("name") as string,
            params: (xpath.select('//*[local-name()="param"]', func) as Element[]).map((e) => {
                return {
                    name: e.getAttribute("name") as string,
                    type: e.getAttribute("as") || undefined,
                };
            }),
            select: getVal(select, 0, "value") as string,
            type: func.getAttribute("as") as string,
            variables: (xpath.select('//*[local-name()="variable"]', func) as Element[]).map((e) => {
                return {
                    name: e.getAttribute("name") as string,
                    select: e.getAttribute("select") as string,
                };
            }),
        };
        if (f.select && f.name) {
            functions.set(f.name, f);
        }
    }

    //// Pattern to level mapping

    const findPhase = (id: string, level: IAssertionLevel) => {
        // Find phases
        const phase = sel(`//*[local-name()="phase" and @id="${id}"]`, doc) as Element[];

        // Store patterns
        if (phase.length) {
            for (const child of getNamedChildren(phase[0], "active")) {
                const patt = child.getAttribute("pattern");
                if (patt) {
                    patternLevelMap.set(patt, level);
                }
            }
        }
    }

    // Collect phases in order of increasing severity,
    // in case assertions are found at multiple levels
    findPhase("info", "info")
    findPhase("warnings", "warning")
    findPhase("errors", "error")

    //// Pattern to rule and rule to assertion mapping

    // Find patterns
    const patterns = sel('//*[local-name()="pattern"]', doc) as Element[];
    const unnamedRules: IRule[] = [];

    // Map patterns to rules
    for (const pattern of patterns) {
        const patternId = pattern.getAttribute("id");
        const defaultLevel = (patternId && patternLevelMap.get(patternId)) || "warning";
        const parsedRules: IRule[] = patternId ? [] : unnamedRules;
        if (patternId) {
            if (parseAbstract(pattern.getAttribute("abstract"))) {
                abstractPatterns.add(patternId);
            }
            const isA = pattern.getAttribute("is-a");
            if (isA) {
                const params = (sel('./*[local-name()="param"]', pattern) as Element[]).reduce((m, e) => {
                    const n = e.getAttribute("name");
                    if (n) {
                        m.set(n, e.getAttribute("value") || "");
                    }
                    return m;
                }, new Map<string, string>());
                patternInstances.set(patternId, { isA, params });
                continue;
            }
            patternRuleMap.set(patternId, parsedRules);
        }
        const rules = sel('./*[local-name()="rule"]', pattern) as Element[];
        for (const rule of rules) {
            const ruleId = rule.getAttribute("id") || undefined;
            const obj = {
                abstract: parseAbstract(rule.getAttribute("abstract")),
                assertionsAndExtensions: getAssertionsAndExtensions(rule, defaultLevel),
                context: parseContext(rule.getAttribute("context")),
                id: ruleId,
            };
            if (ruleId) {
                ruleMap.set(ruleId, obj);
            }
            parsedRules.push(obj);
        }
    }

    for (const [ patternId, { isA, params } ] of patternInstances.entries()) {
        const base = patternRuleMap.get(isA);
        if (!base) {
            continue;
        }
        patternRuleMap.set(patternId, base.map((rule) => {
            return {
                ...rule,
                assertionsAndExtensions: rule.assertionsAndExtensions.map((aoe) => {
                    if (aoe.type === "assertion") {
                        return {
                            ...aoe,
                            test: replaceParams(params, aoe.test),
                        };
                    }
                    return aoe;
                }),
                context: rule.context && replaceParams(params, rule.context),
            };
        }));
    }

    for (const patternId of abstractPatterns) {
        patternRuleMap.delete(patternId);
    }

    if (unnamedRules.length) {
        patternRuleMap.set("", unnamedRules);
    }

    const ret: IParsedSchematron = {
        functions,
        namespaceMap,
        patternRuleMap,
        ruleMap,
    };

    return ret;
}

function replaceParams(params: Map<string, string>, content: string) {
    const pat = /\$[^,\s\(\)\+\/\*\\]+/;
    return content.replace(pat, (a) => {
        const d = params.get(a.substring(1));
        if (d === undefined) {
            throw new Error("Undefined parameter: " + a);
        }
        return d;
    });
}

function getAssertionsAndExtensions(rule: Element, defaultLevel: IAssertionLevel): IAssertionOrExtension[] {
    const assertionsAndExtensions: IAssertionOrExtension[] = [];

    // Find and store assertions
    const assertions = xpath.select('./*[local-name()="assert"]', rule) as Element[];
    for (const assertion of assertions) {
        const description = getDescription(assertion.childNodes);
        let level = defaultLevel;
        if (description.indexOf("SHALL") !== -1
            && (description.indexOf("SHOULD") === -1 || description.indexOf("SHALL") < description.indexOf("SHOULD"))) {
            level = "error";
        }
        const role = rule.getAttribute("role");
        if (role) {
            const rolelc = role.toLowerCase();
            if (rolelc === "fatal" || rolelc === "error") {
                level = "error";
            } else if (rolelc === "warning" || rolelc === "obsolete" || rolelc === "obsolescent") {
                level = "warning";
            } else if (rolelc === "info") {
                level = "info";
            }
        }
        assertionsAndExtensions.push({
            description,
            id: assertion.getAttribute("id") as string,
            level,
            test: assertion.getAttribute("test") as string,
            type: "assertion",
        });
    }

    // Find and store extensions
    const extensions = xpath.select('./*[local-name()="extends"]', rule) as Element[];
    for (const extension of extensions) {
        assertionsAndExtensions.push({
            rule: extension.getAttribute("rule") as string,
            type: "extension",
        });
    }

    return assertionsAndExtensions;
}

function getDescription(nodeList: NodeList) {
    const desc: IDescription[] = [];
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        if (node.nodeType === 3) {
            const v = node.nodeValue && node.nodeValue.trim();
            if (v) {
                desc.push(v);
            }
        } else if (node.nodeType === 4) {
            const v = node.nodeValue && node.nodeValue.trim();
            if (v) {
                desc.push(v);
            }
        } else if (node.nodeType === 1 && node.namespaceURI === null) {
            const e = node as Element;
            const n = e.localName;
            if (n === "name") {
                desc.push({tag: "name"});
            } else if (n === "value-of") {
                desc.push({ tag: "value-of" });
            }
        }
    }

    return desc;
}

function parseAbstract(str: string | null) {
    if (str === "true" || str === "yes") {
        return true;
    }
    return false;
}

function parseContext(str: string | null) {
    return str || null;
}

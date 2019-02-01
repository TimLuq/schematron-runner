
// tslint:disable:max-classes-per-file

import * as hiddenXpath from "xpath";

// tslint:disable-next-line:no-namespace
export namespace xpath {
    const src = ((hiddenXpath as any).default as typeof hiddenXpath) || hiddenXpath;
    for (const s of Object.keys(src) as Array<keyof typeof hiddenXpath>) {
        (xpath as any)[s] = src[s];
    }
    // Object.assign(xpath, hiddenXpath as any);
}

// tslint:disable-next-line:no-namespace
export declare namespace xpath {

    export type XPathType = XString | XNumber | XNodeSet | XBoolean | XSequence<IValueExpression>;

    // tslint:disable-next-line:interface-name
    export interface XPathFunction {
        <R extends XPathType>(c: XPathContext): R;
        <P0 extends IValueExpression, R extends XPathType>(c: XPathContext, p0: P0): R;
        // tslint:disable-next-line:max-line-length
        <P0 extends IValueExpression, P1 extends IValueExpression, R extends XPathType>(c: XPathContext, p0: P0, p1: P1): R;
        // tslint:disable-next-line:max-line-length
        <P0 extends IValueExpression, P1 extends IValueExpression, P2 extends IValueExpression, R extends XPathType>(c: XPathContext, p0: P0, p1: P2, p2: P2): R;

        <P extends IValueExpression, R extends XPathType>(c: XPathContext, ...r: P[]): R;
        // tslint:disable-next-line:max-line-length
        <P0 extends IValueExpression, P extends IValueExpression, R extends XPathType>(c: XPathContext, p0: P0, ...r: P[]): R;
        // tslint:disable-next-line:max-line-length
        <P0 extends IValueExpression, P1 extends IValueExpression, P extends IValueExpression, R extends XPathType>(c: XPathContext, p0: P0, p1: P1, ...r: P[]): R;
        // tslint:disable-next-line:max-line-length
        <P0 extends IValueExpression, P1 extends IValueExpression, P2 extends IValueExpression, P extends IValueExpression, R extends XPathType>(c: XPathContext, p0: P0, p1: P1, p2: P2, ...r: P[]): R;
    }

    export interface IXPathNSResolver {
        lookupNamespaceURI(prefix: string): string | null;
    }

    export class NamespaceResolver {
        public constructor();
        public getNamespace(prefix: string, n: Node): string | null;
    }

    export class VariableResolver {
        public constructor();
        public getVariable(ln: string, ns: string): XPathType | null;
    }

    export class FunctionResolver {
        public static getFunctionFromContext(qName: string, context: XPathContext): XPathFunction | undefined;

        protected functions: { [k: string]: XPathFunction; };

        public constructor(thisArgs?: any);

        public addFunction(ns: string, ln: string, f: XPathFunction): void;
        public addStandardFunctions(): void;
        public getFunction(localName: string, namespace: string): XPathFunction | undefined;
    }

    export class XPath {
        public static readonly XML_NAMESPACE_URI: string;
        public static readonly XMLNS_NAMESPACE_URI: string;

        public readonly expression: XPathExpression;

        constructor(expression: XPathExpression);
        public evaluate(context: XPathContext): XPathResult;
    }

    export class XPathParser {

        public static readonly DOUBLEDOT: 2;
        public static readonly DOUBLECOLON: 3;
        public static readonly DOUBLESLASH: 4;
        public static readonly NOTEQUAL: 5;
        public static readonly LESSTHANOREQUAL: 6;
        public static readonly GREATERTHANOREQUAL: 7;
        public static readonly AND: 8;
        public static readonly OR: 9;
        public static readonly MOD: 10;
        public static readonly DIV: 11;
        public static readonly MULTIPLYOPERATOR: 12;
        public static readonly FUNCTIONNAME: 13;
        public static readonly AXISNAME: 14;
        public static readonly LITERAL: 15;
        public static readonly NUMBER: 16;
        public static readonly ASTERISKNAMETEST: 17;
        public static readonly QNAME: 18;
        public static readonly NCNAMECOLONASTERISK: 19;
        public static readonly NODETYPE: 20;
        public static readonly PROCESSINGINSTRUCTIONWITHLITERAL: 21;
        public static readonly EQUALS: 22;
        public static readonly LESSTHAN: 23;
        public static readonly GREATERTHAN: 24;
        public static readonly PLUS: 25;
        public static readonly MINUS: 26;
        public static readonly BAR: 27;
        public static readonly SLASH: 28;
        public static readonly LEFTPARENTHESIS: 29;
        public static readonly RIGHTPARENTHESIS: 30;
        public static readonly COMMA: 31;
        public static readonly AT: 32;
        public static readonly LEFTBRACKET: 33;
        public static readonly RIGHTBRACKET: 34;
        public static readonly DOT: 35;
        public static readonly DOLLAR: 36;

        public constructor();

        public tokenize(input: string): [number[], string[]];
        public parse(input: string): XPath;

        private init(): void;
    }

    export class XPathResult {
        /** `ANY_TYPE = 0` */
        public static readonly ANY_TYPE: 0;
        /** `NUMBER_TYPE = 1` */
        public static readonly NUMBER_TYPE: 1;
        /** `STRING_TYPE = 2` */
        public static readonly STRING_TYPE: 2;
        /** `BOOLEAN_TYPE = 3` */
        public static readonly BOOLEAN_TYPE: 3;
        /** `UNORDERED_NODE_ITERATOR_TYPE = 4` */
        public static readonly UNORDERED_NODE_ITERATOR_TYPE: 4;
        /** `ORDERED_NODE_ITERATOR_TYPE = 5` */
        public static readonly ORDERED_NODE_ITERATOR_TYPE: 5;
        /** `UNORDERED_NODE_SNAPSHOT_TYPE = 6` */
        public static readonly UNORDERED_NODE_SNAPSHOT_TYPE: 6;
        /** `ORDERED_NODE_SNAPSHOT_TYPE = 7` */
        public static readonly ORDERED_NODE_SNAPSHOT_TYPE: 7;
        /** `ANY_UNORDERED_NODE_TYPE = 8` */
        public static readonly ANY_UNORDERED_NODE_TYPE: 8;
        /** `FIRST_ORDERED_NODE_TYPE = 9` */
        public static readonly FIRST_ORDERED_NODE_TYPE: 9;

        public readonly resultType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        public readonly invalidIteratorState?: false;
        public readonly snapshotLength?: number;

        public readonly numberValue?: number;
        public readonly stringValue?: string;
        public readonly booleanValue?: boolean;
        public readonly singleNodeValue?: Node;

        protected readonly nodes?: Node[];
        protected iteratorIndex: number;

        public constructor(v: any /* TODO */, t: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);

        public iterateNext(): Node;
        public snapshotItem(index: number): Node;
    }

    export class XPathContext {
        public variableResolver: VariableResolver;
        public namespaceResolver: NamespaceResolver;
        public functionResolver: FunctionResolver;

        public contextNode?: Node;
        public contextSize?: number;
        public contextPosition?: number;
        public caseInsensitive?: boolean;
        public allowAnyNamespaceForNoPrefix?: boolean;

        public constructor(vr?: VariableResolver, nr?: NamespaceResolver, fr?: FunctionResolver);

        public extend<T extends object>(newProps: T): XPathContext & T;
    }

    export interface IExpression {
        toString(): string;
        evaluate(c?: XPathContext): IValueExpression;
    }

    export interface IValueExpression {
        toString(): string;
        evaluate(c?: XPathContext): IValueExpression;

        string(): XString;
        number(): XNumber;
        bool(): XBoolean;
        nodeset(): XNodeSet;
        stringValue(): string;
        numberValue(): number;
        booleanValue(): boolean;
        equals(r: ITypeExpression): XBoolean;
        notequal(r: ITypeExpression): XBoolean;
    }

    abstract class ITypeExpression implements IValueExpression {
        public toString(): string;
        public evaluate(c?: XPathContext): this;

        public string(): XString;
        public number(): XNumber;
        public bool(): XBoolean;
        public nodeset(): XNodeSet;
        public stringValue(): string;
        public numberValue(): number;
        public booleanValue(): boolean;
        public equals(r: ITypeExpression): XBoolean;
        public notequal(r: ITypeExpression): XBoolean;
        public lessthan(r: ITypeExpression): XBoolean;
        public greaterthan(r: ITypeExpression): XBoolean;
        public lessthanorequal(r: ITypeExpression): XBoolean;
        public greaterthanorequal(r: ITypeExpression): XBoolean;

        protected init(): void;
    }

    export class XString extends ITypeExpression {
        protected str: string;
        public constructor(s?: string | number | boolean);
    }
    export class XBoolean extends ITypeExpression {
        public constructor(s?: string | number | boolean);
        public not(): XBoolean;
    }
    export class XNumber extends ITypeExpression {
        protected num: number;
        public constructor(s?: string | number | boolean);
        public negate(): XNumber;
        public plus(r: XNumber): XNumber;
        public minus(r: XNumber): XNumber;
        public multiply(r: XNumber): XNumber;
        public div(r: XNumber): XNumber;
        public mod(r: XNumber): XNumber;
    }
    export class XNodeSet extends ITypeExpression {
        public readonly size: number;

        protected nodes: Node[];

        public stringForNode(node: Node): string;
        public stringForContainerNode(node: Node): string;
        public first(): Node | null;
        public add(node: Node): void;
        public addArray(nodes: ArrayLike<Node>): void;
        public toArray(): Node[];
        public toUnsortedArray(): Node[];
        public compareWithString(ref: XString, comparator: (v: XString, r: XString) => XBoolean): XBoolean;
        public compareWithNumber(ref: XNumber, comparator: (v: XNumber, r: XNumber) => XBoolean): XBoolean;
        public compareWithBoolean(ref: XBoolean, comparator: (v: XBoolean, r: XBoolean) => XBoolean): XBoolean;
        public compareWithNodeSet(ref: XNodeSet, comparator: (v: XNodeSet, r: XNodeSet) => XBoolean): XBoolean;
        // tslint:disable-next-line:max-line-length
        public compareWith(ref: ITypeExpression, comparator: (v: ITypeExpression, r: ITypeExpression) => XBoolean): XBoolean;
    }

    export interface IXPathSelect {
        (expression: string, node: Node, single?: false): string | number | boolean | Array<Node | Attr>;
        (expression: string, node: Node, single: true): Node | Attr | string | number | boolean | undefined;
    }
    export const select: IXPathSelect;
    export function selectWithResolver(
        expression: string, node: Node,
        resolver: IXPathNSResolver | null | undefined, single?: false,
    ): string | number | boolean | Array<Node | Attr>;
    export function selectWithResolver(
        expression: string, node: Node,
        resolver: IXPathNSResolver | null | undefined, single: true,
    ): Node | Attr | string | number | boolean | undefined;
    export function select1(expression: string, node?: Node): Node | Attr | string | number | boolean | undefined;
    export function evaluate(
        expression: string, contextNode: Node, resolver: IXPathNSResolver,
        type: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, result: XPathResult,
    ): XPathResult;
    export function useNamespaces(namespaceMap: { [name: string]: string }): IXPathSelect;

    export function createExpression(e: string, r?: IXPathNSResolver): XPathExpression;
    export function createNSResolver(node: Node): IXPathNSResolver;

    export interface IXPathEvaluatorOptions {
        namespaces?: NamespaceResolver | { [k: string]: string; }
        | ((prefix: string, n: Node) => string | null);
        functions?: FunctionResolver | { [k: string]: XPathFunction; }
        | ((ln: string, ns: string) => XPathFunction | undefined);
        variables?: VariableResolver | { [k: string]: string; }
        | ((prefix: string, n: Node) => string | null);

        node?: Node;

        allowAnyNamespaceForNoPrefix?: boolean;
        isHTML?: boolean;
    }
    export interface IXPathEvaluator {
        evaluate<T extends IValueExpression>(options: IXPathEvaluatorOptions): T;
        evaluateNumber(options: IXPathEvaluatorOptions): number;
        evaluateString(options: IXPathEvaluatorOptions): string;
        evaluateBoolean(options: IXPathEvaluatorOptions): boolean;
        evaluateNodeSet(options: IXPathEvaluatorOptions): XNodeSet;
        select(options: IXPathEvaluatorOptions): Node[];
        select1(options: IXPathEvaluatorOptions): Node | undefined;
    }

    export function parse(input: string): IXPathEvaluator;
}

// tslint:disable-next-line:no-namespace
export namespace xpath {
    export class XDecimal extends XNumber {
        public readonly decimalCount: number;
        public constructor(s?: string | number | boolean) {
            super(s);
            const str = typeof s === "string" ? s : super.toString();
            const p = str.indexOf(".");
            this.decimalCount = p === -1 ? 0 : str.length - 1 - p;
        }

        public toString() {
            const s = this.num.toFixed(this.decimalCount);
            if (s.indexOf("e")) {
                return super.toString();
            }
            return s;
        }
    }

    export class XFloat extends XNumber {
        public constructor(s?: string | number | boolean) {
            super(s);
        }
    }

    export class XDouble extends XNumber {
        public constructor(s?: string | number | boolean) {
            super(s);
        }
    }

    export class XNCName extends XString {}

    export class XQName extends XString {
        public readonly namespaceURI: string;
        public readonly localName: string;
        public readonly prefix: string;
        public constructor(s?: string, ns?: string | null) {
            const p = s ? s.indexOf(":") : -1;
            const pf = p === -1 ? "" : (s as string).substring(0, p);
            const ln = p === -1 ? s || "" : (s as string).substring(p + 1);
            super(`{${ns || ""}}${ln}`);
            this.prefix = pf;
            this.namespaceURI = ns || "";
            this.localName = ln;
        }
    }

    export class XSequence<T extends IValueExpression> implements IValueExpression {
        public static readonly EMPTY = new XSequence([]);
        public readonly items: T[];
        public readonly size: number;
        protected evaluated: boolean = false;
        public constructor(items: Iterable<T>) {
            this.items = Array.from(items);
            this.size = this.items.length;
        }

        public toString(): string {
            return "(" + this.items.map((x) => x.toString()).join(", ") + ")";
        }
        public evaluate(c?: XPathContext | undefined): IValueExpression {
            if (this.evaluated) {
                return this;
            }
            const s = new XSequence(this.items.map((x) => x.evaluate(c)));
            s.evaluated = true;
            return s;
        }

        public string(): XString {
            return new XString(this.toString());
        }
        public number(): XNumber {
            return new XNumber(this.items.length);
        }
        public bool(): XBoolean {
            return toBool(this.items.length ? true : false);
        }
        public nodeset(): XNodeSet {
            throw new TypeError("Can not convert sequence to nodeset");
        }
        public stringValue(): string {
            return this.toString();
        }
        public numberValue(): number {
            return this.items.length;
        }
        public booleanValue(): boolean {
            return this.items.length ? true : false;
        }
        public equals(r: ITypeExpression): XBoolean {
            if (r instanceof XSequence) {
                return toBool(this.size === r.size && this.items.every((x, i) => {
                    const v = r.items[i];
                    if (typeof (v as any).equals === "function") {
                        return (v as any).equals(x).booleanValue();
                    }
                    if (typeof (x as any).equals === "function") {
                        return (x as any).equals(v).booleanValue();
                    }
                    return false;
                }));
            }
            if (this.size === 1) {
                const v = this.items[0];
                if (typeof (v as any).equals === "function") {
                    return (v as any).equals(r);
                }
                if (typeof (r as any).equals === "function") {
                    return (r as any).equals(v);
                }
            }
            return FALSE;
        }
        public notequal(r: ITypeExpression): XBoolean {
            return this.equals(r);
        }
    }
}

// const xpath = hiddenXpath as unknown as typeof XPathExports;

function xsdecimal(c: xpath.XPathContext, v: xpath.XPathType) {
    return new xpath.XDecimal(Math.round(v.evaluate(c).numberValue()));
}

function xsstring(c: xpath.XPathContext, v: xpath.XPathType): xpath.XString {
    return v.evaluate(c).string();
}

function xsnormalizedString(c: xpath.XPathContext, v: xpath.XPathType): xpath.XString {
    const s = v.evaluate(c).string();
    (s as any).str = (s as any).str.trim().replace(/\s+/g, " ");
    return s;
}

function binaryString(c: xpath.XPathContext, v: xpath.XPathType) {
    const s = v.evaluate(c).string();
    (s as any).str = (s as any).str.trim().replace(/\s+/g, "");
    return s;
}

function stringSeq(c: xpath.XPathContext, v: xpath.XPathType) {
    const s = ((xsnormalizedString(c, v) as any).str.split(" ") as string[])
        .map((x) => new xpath.XString(x));
    return new xpath.XSequence(s);
}

const stdFuncsXs = {

    date: xsnormalizedString,
    dateTime: xsnormalizedString,
    duration: xsnormalizedString,
    gDay: xsnormalizedString,
    gMonth: xsnormalizedString,
    gMonthDay: xsnormalizedString,
    gYear: xsnormalizedString,
    gYearMonth: xsnormalizedString,
    time: xsnormalizedString,

    boolean: (c: xpath.XPathContext, v: xpath.XPathType) => v.evaluate(c).bool(),

    base64Binary: binaryString,
    hexBinary: binaryString,

    double: (c: xpath.XPathContext, v: xpath.XPathType) => {
        return new xpath.XDouble(v.evaluate(c).numberValue());
    },
    float: (c: xpath.XPathContext, v: xpath.XPathType) => new xpath.XFloat(v.evaluate(c).numberValue()),

    anyURI: xsnormalizedString,

    NOTATION: xsnormalizedString,
    QName: xsnormalizedString,

    ENTITY: xsnormalizedString,
    ID: xsnormalizedString,
    IDREF: xsnormalizedString,
    NCName: xsnormalizedString,
    NMTOKEN: xsnormalizedString,
    Name: xsnormalizedString,
    language: xsnormalizedString,
    normalizedString: xsnormalizedString,
    string: xsstring,
    token: xsnormalizedString,

    ENTITIES: stringSeq,
    IDREFS: stringSeq,
    NMTOKENS: stringSeq,

    decimal: xsdecimal,
    integer: xsdecimal,

    nagativeInteger: xsdecimal,
    nonPositiveInteger: xsdecimal,

    byte: xsdecimal,
    int: xsdecimal,
    long: xsdecimal,
    short: xsdecimal,

    nonNegativeInteger: xsdecimal,
    positiveInteger: xsdecimal,
    unsignedByte: xsdecimal,
    unsignedInt: xsdecimal,
    unsignedLong: xsdecimal,
    unsignedShort: xsdecimal,

    dateTimeStamp: xsnormalizedString,
    dayTimethDuration: xsnormalizedString,
    untypedAtomic: xsnormalizedString,
    yearMonthDuration: xsnormalizedString,

    numeric: (c: xpath.XPathContext, v: xpath.XPathType) => {
        const n = v.evaluate(c).number();
        if (n instanceof xpath.XDecimal || n instanceof xpath.XDouble || n instanceof xpath.XFloat) {
            return n;
        }
        return new xpath.XDouble(n.numberValue());
    },

    error: (c: xpath.XPathContext, v: xpath.XPathType) => {
        const e = v && v.evaluate(c);
        if (e instanceof xpath.XSequence && e.size === 0) {
            return e;
        }
        throw new Error("xs:error constructor found");
    },
};

const TRUE = new xpath.XBoolean(true);
const FALSE = new xpath.XBoolean(false);

export function toBool(b: boolean) {
    return b ? TRUE : FALSE;
}

function createNodeSet(...nodes: Node[]) {
    const n = new xpath.XNodeSet();
    (n as any).size = 1;
    (n as any).nodes.push(...nodes);
    return n;
}

function numericsametype<T extends xpath.XDecimal | xpath.XDouble | xpath.XFloat | xpath.XNumber>(v: T, a: number): T {
    if (v instanceof xpath.XDouble) {
        return new xpath.XDouble(a) as T;
    }
    if (v instanceof xpath.XFloat) {
        return new xpath.XFloat(a) as T;
    }
    if (v instanceof xpath.XDecimal) {
        return new xpath.XDecimal(a) as T;
    }
    return new xpath.XNumber(a) as T;
}

function getFirstNode(nodes: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet): Node | undefined {
    let node;
    const x = nodes;
    if (x instanceof xpath.XNodeSet) {
        node = x.toUnsortedArray()[0];
    } else if (x instanceof xpath.XSequence) {
        node = x.items[0] as Node | xpath.XNodeSet;
        if (node instanceof xpath.XNodeSet) {
            node = node.toUnsortedArray()[0];
        }
    } else {
        throw new TypeError("fn:name expected a sequence of nodes");
    }
    return node;
}

function buildPath(node: Node, suffix: string): string {
    const p = node.parentNode;
    if (!p) {
        return suffix;
    }
    let match;
    if (node.nodeType === 1) {
        match = (n: Node) => {
            const e = n as Element;
            return `Q{${e.namespaceURI || ""}}${e.localName}`;
        };
    } else if (node.nodeType === 2) {
        const e = node as Attr;
        const ns = e.namespaceURI;
        if (ns) {
            return buildPath(p, `/@Q{${ns}}${e.localName}`);
        } else {
            return buildPath(p, `/@${e.localName}`);
        }
    } else if (node.nodeType === 3) {
        match = (n: Node) => {
            return `text()`;
        };
    } else if (node.nodeType === 7) {
        match = (n: Node) => {
            const e = n as ProcessingInstruction;
            return `processing-instruction(${e.nodeName})`;
        };
    } else if (node.nodeType === 8) {
        match = (n: Node) => {
            return `comment()`;
        };
    } else {
        throw new Error("Cannot build a path though a node of type " + node.nodeType);
    }
    const r = match(node);
    let c = 1;
    let x = node;
    // tslint:disable-next-line:no-conditional-assignment
    while (x = x.previousSibling as Node) {
        if (node.nodeType === x.nodeType && match(x) === r) {
            c++;
        }
    }
    return buildPath(p, `/${r}[${c}]${suffix}`);
}

/**
 * https://www.w3.org/TR/xpath-functions/#func-format-number
 * @param n value
 * @param p picture
 */
function formatNumber(n: number, p: string) {
    let b = "";
    const s = n.toFixed(0).replace(/\..*$/, "");
    let p0 = s.length;
    let p1 = p.length;
    while (p1--) {
        const cr = p.charCodeAt(p1);
        if (cr >= 0x30 && cr <= 0x39) {
            if (p0) {
                p0 -= 1;
                b = s.charAt(p0) + b;
            } else {
                b = "0" + b;
            }
        } else if (cr === 0x23) {
            if (p0) {
                p0 -= 1;
                b = s.charAt(p0) + b;
            } else {
                break;
            }
        } else {
            b = p.charAt(p1) + b;
        }
    }
    if (p0) {
        b = s.substring(0, p0) + b;
    }
    return b.replace(/^[^0-9]+/, "");
}

const customSchemaPath = "https://github.com/TimLuq/schematron-runner/tree/master/schemas/";

const stdFuncsFn = {

    // Accessors

    "node-name": (c: xpath.XPathContext, v?: xpath.XNodeSet) => {
        const vv = v ? v.evaluate(c).nodeset() : createNodeSet(c.contextNode as Node);
        if (vv.size === 0) {
            return new xpath.XSequence([]);
        }
        if (vv.size !== 1) {
            throw new Error("Function `node-name` should refer to only one element");
        }
        const n = (vv as any).nodes[0] as Node;
        return new xpath.XString(n.nodeName);
    },

    "nilled": (c: xpath.XPathContext, v?: xpath.XNodeSet) => {
        const vv = v ? v.evaluate(c).nodeset() : createNodeSet(c.contextNode as Node);
        if (vv.size === 0) {
            return new xpath.XSequence([]);
        }
        if (vv.size !== 1) {
            throw new Error("Function `nilled` should refer to only one element");
        }
        const n = (vv as any).nodes[0] as Node;
        const b = n.nodeType === 1 &&
            (n as Element).getAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "nil")
            || false;
        return b ? TRUE : FALSE;
    },

    "string": (c: xpath.XPathContext, v?: xpath.XNodeSet) => {
        const vv = v ? v.evaluate(c) : createNodeSet(c.contextNode as Node);
        return vv.string();
    },

    // Errors and diagnostics

    "error": (
        c: xpath.XPathContext, code?: xpath.IValueExpression,
        description?: xpath.XString, errorObject?: xpath.IValueExpression,
    ) => {
        const ucb = c.functionResolver.getFunction("error", customSchemaPath + "user");
        if (typeof ucb === "function") {
            const args = [code || new xpath.XQName("FOER0000", "http://www.w3.org/2005/xqt-errors")];
            if (description) {
                args.push(description);
                if (errorObject) {
                    args.push(errorObject);
                }
            }
            const r = ucb(c, ...args);
            if ((r as any) === true || r && (r instanceof xpath.XBoolean && r.booleanValue())) {
                return TRUE;
            }
        }
        const tc = (code && code.toString()) || "{http://www.w3.org/2005/xqt-errors}FOER0000";
        const td = description && description.toString();
        const em = tc !== null
            ? (typeof td === "string" ? tc + ": " + td : tc)
            : (td || "");
        const err = new Error(em);
        (err as any).code = tc;
        throw err;
    },

    "trace": (c: xpath.XPathContext, value: xpath.IValueExpression, label?: xpath.XString) => {
        const v = value.evaluate(c);
        const ucb = c.functionResolver.getFunction("trace", customSchemaPath + "user");
        if (typeof ucb === "function") {
            const args = [v];
            if (label) {
                args.push(label.evaluate(c).string());
            }
            ucb(c, ...args);
        }
        return v;
    },

    // Functions on numeric values

    "abs": (c: xpath.XPathContext, value: xpath.XNumber | xpath.XDouble | xpath.XDecimal | xpath.XFloat) => {
        const v = value.evaluate(c);
        const n = v.numberValue();
        const a = Math.abs(n);
        if (n === a) {
            return v;
        }
        return numericsametype(v, a);
    },

    "ceiling": (c: xpath.XPathContext, value: xpath.XNumber | xpath.XDouble | xpath.XDecimal | xpath.XFloat) => {
        const v = value.evaluate(c);
        const n = v.numberValue();
        const a = Math.ceil(n);
        if (n === a) {
            return v;
        }
        return numericsametype(v, a);
    },

    "floor": (c: xpath.XPathContext, value: xpath.XNumber | xpath.XDouble | xpath.XDecimal | xpath.XFloat) => {
        const v = value.evaluate(c);
        const n = v.numberValue();
        const a = Math.floor(n);
        if (n === a) {
            return v;
        }
        return numericsametype(v, a);
    },

    "round": (
            c: xpath.XPathContext,
            value: xpath.XNumber | xpath.XDouble | xpath.XDecimal | xpath.XFloat,
            precision?: xpath.XNumber) => {
        const v = value.evaluate(c);
        const n = v.numberValue();
        const p = Math.pow(10, Math.round((precision && precision.evaluate(c).numberValue()) || 0));
        const a = Math.round(n * p) / p;
        if (n === a) {
            return v;
        }
        return numericsametype(v, a);
    },

    "round-half-to-even": (
            c: xpath.XPathContext,
            value: xpath.XNumber | xpath.XDouble | xpath.XDecimal | xpath.XFloat,
            precision?: xpath.XNumber) => {
        const v = value.evaluate(c);
        const n = v.numberValue();
        const p = Math.pow(10, Math.round((precision && precision.evaluate(c).numberValue()) || 0));
        const f = Math.floor(n * p) / p;
        // tslint:disable-next-line:no-bitwise
        const a = f + (0.5 * p) !== n ? Math.round(n * p) / p : f + (Math.round((f / p)) & 1) * p;
        // TODO: validate that the above line is correct
        if (n === a) {
            return v;
        }
        return numericsametype(v, a);
    },

    // Parsing numbers

    "number": (
            c: xpath.XPathContext,
            arg?: xpath.IValueExpression) => {
        if (!arg) {
            const n = c.contextNode;
            return new xpath.XDouble((n && n.textContent) || undefined);
        } else {
            const v = arg.evaluate(c);
            if (v instanceof xpath.XDouble) {
                return v;
            }
            const n = v.numberValue();
            const a = isNaN(n) ? parseFloat(v.stringValue()) : n;
            return new xpath.XDouble(a);
        }
    },

    // Formatting numbers

    "format-integer": (
            c: xpath.XPathContext,
            value: xpath.XNumber, picture: xpath.XString,
            // lang?: xpath.XString
    ) => {
        value = value.evaluate(c);
        if (value instanceof xpath.XSequence) {
            if (value.items.length === 0) {
                return new xpath.XString("");
            }
            throw new Error("Unexpected non-empty sequence for value in format-integer.");
        }
        const n = Math.round(value.numberValue());
        if (isNaN(n) || !isFinite(n)) {
            return new xpath.XString(n.toString());
        }
        const p = picture.evaluate(c).stringValue();
        let b = "";
        if (p === "A") {
            for (let i = n; i !== 0; i = Math.floor(i / 26)) {
                b = String.fromCharCode(0x41 + (i % 26)) + b;
            }
        } else if (p === "a") {
            for (let i = n; i !== 0; i = Math.floor(i / 26)) {
                b = String.fromCharCode(0x61 + (i % 26)) + b;
            }
        } else if (p === "i" || p === "I" || p === "w" || p === "W" || p === "Ww") {
            throw new Error("Roman numerals and words are not implemented for format-integer");
        } else if (/^((\p{Nd}|#|[^\p{N}\p{L}])+?)$/.test(p)) {
            b = formatNumber(n, p);
        } else {
            throw new Error("Unknown format code " + JSON.stringify(p) + " for format-integer");
        }

        return new xpath.XString(b);
    },

    "format-number": (
            c: xpath.XPathContext,
            value: xpath.XNumber, picture: xpath.XString,
            // lang?: xpath.XString
    ) => {
        value = value.evaluate(c);
        if (value instanceof xpath.XSequence) {
            if (value.items.length === 0) {
                return new xpath.XString("");
            }
            throw new Error("Unexpected non-empty sequence for value in format-integer.");
        }
        const n = Math.round(value.numberValue());
        if (isNaN(n) || !isFinite(n)) {
            return new xpath.XString(n.toString());
        }
        const p = picture.evaluate(c).stringValue();
        return new xpath.XString(formatNumber(n, p));
    },

    // TODO: https://www.w3.org/TR/xpath-functions/#func-random-number-generator

    // Functions to assemble and disassemble strings

    "codepoints-to-string": (
        c: xpath.XPathContext,
        arg: xpath.XNumber | xpath.XSequence<xpath.XNumber>,
    ) => {
        arg = arg.evaluate(c) as xpath.XNumber | xpath.XSequence<xpath.XNumber>;
        const items = (arg instanceof xpath.XSequence) ? arg.items.map((v) => v.numberValue()) : [arg.numberValue()];
        const b = String.fromCharCode(...items);
        return new xpath.XString(b);
    },

    "string-to-codepoints": (
        c: xpath.XPathContext,
        arg: xpath.XString,
    ) => {
        const s = arg.evaluate(c).stringValue();
        const l = s.length;
        const u: xpath.XNumber[] = [];
        u.length = l;
        const cache = new Map<number, xpath.XNumber>();
        for (let i = 0; i < l; i++) {
            const x = s.charCodeAt(i);
            let y = cache.get(x);
            if (!y) {
                y = new xpath.XNumber(x);
                cache.set(x, y);
            }
            u[i] = y;
        }
        return new xpath.XSequence(u);
    },

    // TODO: https://www.w3.org/TR/xpath-functions/#string-compare

    "concat" : (
            c: xpath.XPathContext,
            ...args: xpath.IValueExpression[]) => {
        return args.map((x) => x.evaluate(c).stringValue()).join("");
    },

    "string-join" : (
        c: xpath.XPathContext,
        arg1: xpath.XSequence<xpath.IValueExpression>,
        arg2?: xpath.XString,
    ) => {
        return (arg1.evaluate(c) as xpath.XSequence<xpath.IValueExpression>)
            .items.map((x) => x.evaluate(c).stringValue()).join((arg2 && arg2.evaluate(c).stringValue()) || "");
    },

    "substring" : (
        c: xpath.XPathContext,
        sourceString: xpath.XString,
        start: xpath.XDouble,
        length?: xpath.XDouble,
    ) => {
        const s = sourceString.evaluate(c).stringValue();
        const st = start.evaluate(c).numberValue();
        const sp = length ? length.evaluate(c).numberValue() : s.length - st;
        return new xpath.XString(s.substring(st, sp));
    },

    "string-length" : (
        c: xpath.XPathContext,
        arg?: xpath.XString,
    ) => {
        const s = arg ? arg.evaluate(c).stringValue() : (c.contextNode && c.contextNode.textContent) || "";
        return new xpath.XNumber(s.length);
    },

    "normalize-space" : (
        c: xpath.XPathContext,
        arg?: xpath.XString,
    ) => {
        const s = arg ? arg.evaluate(c).stringValue() : (c.contextNode && c.contextNode.textContent) || "";
        return new xpath.XString(s.trim().replace(/\s+/g, " "));
    },

    "normalize-unicode" : (
        c: xpath.XPathContext,
        arg: xpath.XString,
        normalizationForm?: xpath.XString,
    ) => {
        const s = arg.evaluate(c).stringValue();
        const f = normalizationForm ? normalizationForm.stringValue().trim() : "NFC";
        return new xpath.XString(s.normalize(f));
    },

    "upper-case" : (
        c: xpath.XPathContext,
        arg: xpath.XString,
    ) => {
        const s = arg.evaluate(c).stringValue();
        return new xpath.XString(s.toUpperCase());
    },

    "lower-case" : (
        c: xpath.XPathContext,
        arg: xpath.XString,
    ) => {
        const s = arg.evaluate(c).stringValue();
        return new xpath.XString(s.toLowerCase());
    },

    "translate" : (
        c: xpath.XPathContext,
        arg: xpath.XString,
        mapString: xpath.XString,
        transString: xpath.XString,
    ) => {
        const s = arg.evaluate(c).stringValue();
        const m = mapString.evaluate(c).stringValue();
        const t = transString.evaluate(c).stringValue();
        let b = "";
        for (let i = 0; i < s.length; i++) {
            const h = s.charAt(i);
            const p = m.indexOf(h);
            if (p === -1) {
                b += h;
            } else {
                b += t.charAt(p);
            }
        }
        return new xpath.XString(b);
    },

    // Functions based on substring matching

    "contains": (
        c: xpath.XPathContext,
        arg1: xpath.XString,
        arg2: xpath.XString,
    ) => {
        const s = arg1.evaluate(c).stringValue();
        const t = arg2.evaluate(c).stringValue();
        return toBool(t.length === 0 || s.indexOf(t) !== -1);
    },

    "starts-with": (
        c: xpath.XPathContext,
        arg1: xpath.XString,
        arg2: xpath.XString,
    ) => {
        const s = arg1.evaluate(c).stringValue();
        const t = arg2.evaluate(c).stringValue();
        return toBool(t.length === 0 || s.indexOf(t) === 0);
    },

    "ends-with": (
        c: xpath.XPathContext,
        arg1: xpath.XString,
        arg2: xpath.XString,
    ): xpath.XBoolean => {
        const t = arg2.evaluate(c).stringValue();
        const l = t.length;
        if (l === 0) {
            return TRUE;
        }
        const s = arg1.evaluate(c).stringValue();
        const p = s.indexOf(t);

        return toBool(p !== -1 && p === s.length - l);
    },

    "substring-before": (
        c: xpath.XPathContext,
        arg1: xpath.XString,
        arg2: xpath.XString,
        collation?: xpath.XString,
    ) => {
        if (collation) {
            // TODO?
            throw new Error("substring-before has an unimplemented overload using collation");
        }
        const t = arg2.evaluate(c).stringValue();
        const l = t.length;
        if (l === 0) {
            return arg1;
        }
        const s = arg1.evaluate(c).stringValue();
        const p = s.indexOf(t);
        return new xpath.XString(p <= 0 ? "" : s.substring(0, p));
    },

    "substring-after": (
        c: xpath.XPathContext,
        arg1: xpath.XString,
        arg2: xpath.XString,
        collation?: xpath.XString,
    ) => {
        if (collation) {
            // TODO?
            throw new Error("substring-before has an unimplemented overload using collation");
        }
        const t = arg2.evaluate(c).stringValue();
        const l = t.length;
        if (l === 0) {
            return arg1;
        }
        const s = arg1.evaluate(c).stringValue();
        const p = s.indexOf(t);
        return new xpath.XString(p <= 0 ? "" : s.substring(0, p + t.length));
    },

    // String functions that use regular expressions

    "matches": (
        c: xpath.XPathContext,
        input: xpath.XString,
        pattern: xpath.XString,
        flags?: xpath.XString,
    ) => {
        const s = input.evaluate(c).stringValue();
        const t = pattern.evaluate(c).stringValue();
        const f = flags ? flags.evaluate(c).stringValue() : undefined;
        const r = new RegExp(t, f);
        return toBool(r.test(s));
    },

    "replace": (
        c: xpath.XPathContext,
        input: xpath.XString,
        pattern: xpath.XString,
        replacement: xpath.XString,
        flags?: xpath.XString,
    ) => {
        const s = input.evaluate(c).stringValue();
        const t = pattern.evaluate(c).stringValue();
        const x = replacement.evaluate(c).stringValue();
        const f = flags ? flags.evaluate(c).stringValue() : undefined;
        const r = new RegExp(t, f);
        return new xpath.XString(s.replace(r, x));
    },

    "tokenize": (
        c: xpath.XPathContext,
        input: xpath.XString,
        pattern?: xpath.XString,
        flags?: xpath.XString,
    ) => {
        const s = input.evaluate(c).stringValue();
        let ps: string[] = [];
        if (!pattern) {
            ps = s.trim().split(/\s+/);
        } else {
            const t = pattern.evaluate(c).stringValue();
            const f = flags ? flags.evaluate(c).stringValue() : undefined;
            const r = new RegExp(t, f);
            ps = s.split(r);
        }
        return new xpath.XSequence(ps.map((x) => new xpath.XString(x)));
    },

    // TODO: analyze-string - https://www.w3.org/TR/xpath-functions/#func-analyze-string

    // Functions that manipulate URIs

    "resolve-uri": (
        c: xpath.XPathContext,
        relative: xpath.XString,
        base?: xpath.XString,
    ) => {
        const s = relative.evaluate(c).stringValue().replace(/(^|\/)(?:\.\/)+/g, "$1");
        if (/^[a-zA-Z0-9-]+:(?:\/\/)/.test(s)) {
            return relative;
        }
        let b: string;
        if (!base) {
            const n = c.contextNode;
            if (n && n.baseURI) {
                b = n.baseURI;
            }
            return relative;
        } else {
            b = base.evaluate(c).stringValue();
        }
        const f = s.charAt(0);
        if (f === "/") {
            b = b.replace(/^([a-zA-Z0-9-]+:(?:\/\/)?[^\/]*).*$/, "$1") + s;
        } else {
            b = b.replace(/#.*$/, "");
            if (f === "#") {
                b += s;
            } else {
                b = b.replace(/\?.*$/, "");
                if (f === "?") {
                    b += s;
                } else {
                    b = b.replace(/\/[^\/]+$/, "/") + s;
                    let o;
                    do {
                        o = b;
                        b = o.replace("/../", "/");
                    } while (b !== o);
                }
            }
        }
        return new xpath.XString(b);
    },

    "encode-for-uri": (
        c: xpath.XPathContext,
        uriPart: xpath.XString,
    ) => {
        return new xpath.XString(encodeURIComponent(uriPart.evaluate(c).stringValue()));
    },

    "iri-to-uri": (
        c: xpath.XPathContext,
        uriPart: xpath.XString,
    ) => {
        return new xpath.XString(encodeURI(uriPart.evaluate(c).stringValue()));
    },

    "escape-html-uri": (
        c: xpath.XPathContext,
        uriPart: xpath.XString,
    ) => {
        return new xpath.XString(encodeURI(uriPart.evaluate(c).stringValue()));
    },

    // Functions and operators on Boolean values

    "true": (
        c: xpath.XPathContext,
    ) => {
        return TRUE;
    },

    "false": (
        c: xpath.XPathContext,
    ) => {
        return FALSE;
    },

    "boolean": (
        c: xpath.XPathContext,
        arg: xpath.IValueExpression,
    ) => {
        return arg.evaluate(c).bool();
    },

    "not": (
        c: xpath.XPathContext,
        arg: xpath.IValueExpression,
    ) => {
        return arg.evaluate(c).bool().not();
    },

    // TODO: https://www.w3.org/TR/xpath-functions/#durations

    // TODO: https://www.w3.org/TR/xpath-functions/#dates-times

    "resolve-QName": (
        c: xpath.XPathContext,
        qname: xpath.XString | xpath.XSequence<any>,
        element: xpath.XNodeSet,
    ) => {
        const e = qname.evaluate(c);
        if (e instanceof xpath.XSequence) {
            if (e.size === 0) {
                return e;
            }
            throw new TypeError("Unexpected non-empty sequence.");
        }
        if (element.size !== 1) {
            throw new TypeError("Unexpected size of node list (" + element.size + ").");
        }
        const s = e.stringValue();
        const p = s.indexOf(":");
        const pfx = p === -1 ? null : s.substring(0, p);
        const ele = element.toArray()[0];
        const uri = ele.lookupNamespaceURI(pfx);
        if (!uri && pfx) {
            const err = new Error("Could not find namespace for prefix " + pfx);
            (err as any).code = "{http://www.w3.org/2005/xqt-errors}FONS0004";
            throw err;
        }
        return new xpath.XQName(s, uri);
    },

    "QName": (
        c: xpath.XPathContext,
        paramURI: xpath.XString | xpath.XSequence<any>,
        paramQName: xpath.XString,
    ) => {
        let ns = "";
        const e = paramURI.evaluate(c);
        if (e instanceof xpath.XSequence) {
            if (e.size !== 0) {
                throw new TypeError("Unexpected non-empty sequence.");
            }
        } else {
            ns = e.stringValue();
        }
        return new xpath.XQName(paramQName.evaluate(c).stringValue(), ns);
    },

    "prefix-from-QName": (
        c: xpath.XPathContext,
        arg: xpath.XQName | xpath.XSequence<any>,
    ) => {
        const e = arg.evaluate(c) as xpath.XQName | xpath.XSequence<any>;
        if (e instanceof xpath.XSequence) {
            if (e.size === 0) {
                return e;
            }
            throw new TypeError("Unexpected non-empty sequence.");
        }
        if (!e.prefix) {
            return xpath.XSequence.EMPTY;
        }
        return new xpath.XNCName(e.prefix);
    },

    "local-name-from-QName": (
        c: xpath.XPathContext,
        arg: xpath.XQName | xpath.XString | xpath.XSequence<any>,
    ) => {
        const e = arg.evaluate(c) as xpath.XQName | xpath.XSequence<any>;
        if (e instanceof xpath.XSequence) {
            if (e.size === 0) {
                return e;
            }
            throw new TypeError("Unexpected non-empty sequence.");
        }
        if (e.localName) {
            return new xpath.XNCName(e.localName);
        }
        return new xpath.XNCName(e.stringValue().replace(/^.*[:\}]/, ""));
    },

    "namespace-uri-from-QName": (
        c: xpath.XPathContext,
        arg: xpath.XQName | xpath.XString | xpath.XSequence<any>,
    ) => {
        const e = arg.evaluate(c) as xpath.XQName | xpath.XSequence<any>;
        if (e instanceof xpath.XSequence) {
            if (e.size === 0) {
                return e;
            }
            throw new TypeError("Unexpected non-empty sequence.");
        }
        if (e.namespaceURI) {
            return new xpath.XString(e.namespaceURI);
        }
        const d = e.stringValue().match(/^\{(.*)\}/);
        return new xpath.XString(d ? d[1] : "");
    },

    "namespace-uri-for-prefix": (
        c: xpath.XPathContext,
        prefix: xpath.XString | xpath.XSequence<any>,
        element: xpath.XNodeSet,
    ) => {
        const e = prefix.evaluate(c);
        let s: string;
        if (e instanceof xpath.XSequence) {
            if (e.size === 0) {
                s = "";
            } else {
                throw new TypeError("Unexpected non-empty sequence.");
            }
        } else {
            s = e.stringValue();
        }
        if (element.size !== 1) {
            throw new TypeError("Unexpected size of node list (" + element.size + ").");
        }
        const p = s.indexOf(":");
        const ele = element.toArray()[0];
        const uri = ele.lookupNamespaceURI(s || null);
        if (!uri) {
            return xpath.XSequence.EMPTY;
        }
        return new xpath.XString(uri);
    },

    "in-scope-prefixes": (
        c: xpath.XPathContext,
        element: xpath.XNodeSet,
    ) => {
        element = element.evaluate(c) as xpath.XNodeSet;
        if (element.size !== 1) {
            throw new TypeError("Unexpected size of node list (" + element.size + ").");
        }
        let ele: null | Node = element.toArray()[0];
        const pfxs = new Set<string>();
        pfxs.add("xml");
        while (ele) {
            if (ele.nodeType === 1) {
                const el = ele as Element;
                const atts = el.attributes;
                // tslint:disable-next-line:prefer-for-of
                for (let i = 0; i < atts.length; i++) {
                    const a = atts[i];
                    if (a.prefix === "xmlns") {
                        pfxs.add(a.localName);
                    } else if (a.nodeName === "xmlns") {
                        pfxs.add("");
                    }
                }
            }
            ele = ele.parentNode;
        }
        const parr: xpath.XString[] = [];
        for (const a of pfxs.values()) {
            parr.push(new xpath.XString(a));
        }
        return new xpath.XSequence(parr);
    },

    // TODO: https://www.w3.org/TR/xpath-functions/#binary-functions

    "name": (
        c: xpath.XPathContext,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return new xpath.XString("");
        }

        return new xpath.XString((node.nodeName || "").replace(/^#.*$/, ""));
    },

    "local-name": (
        c: xpath.XPathContext,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return new xpath.XString("");
        }

        return new xpath.XString(((node as Element).localName || ""));
    },

    "namespace-uri": (
        c: xpath.XPathContext,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return new xpath.XString("");
        }

        return new xpath.XString(((node as Element).namespaceURI || ""));
    },

    "lang": (
        c: xpath.XPathContext,
        testlang: xpath.XString,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return FALSE;
        }

        const s = testlang.evaluate(c).stringValue();

        let root = node;
        let r = root.nodeType === 1 && (root as Element)
            .getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang");
        while (typeof r !== "string" && root.parentNode) {
            root = root.parentNode as Element;
            r = (root as Element)
                .getAttributeNS("http://www.w3.org/XML/1998/namespace", "lang");
        }
        return toBool(typeof r === "string" && (r === s || r.substring(0, s.length + 1) === s + "-"));
    },

    "root": (
        c: xpath.XPathContext,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return new xpath.XString("");
        }

        let root = node;
        while (root.parentNode) {
            root = root.parentNode;
        }
        const s = new xpath.XNodeSet();
        s.add(root);

        return s;
    },

    "path": (
        c: xpath.XPathContext,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return new xpath.XSequence([]);
        }

        return new xpath.XString(buildPath(node, ""));
    },

    "has-children": (
        c: xpath.XPathContext,
        arg?: xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet,
    ) => {
        const node = !arg ? c.contextNode
            : getFirstNode(arg.evaluate(c) as xpath.XSequence<xpath.XNodeSet> | xpath.XNodeSet);
        if (!node) {
            return new xpath.XSequence([]);
        }

        return toBool(node.hasChildNodes());
    },

    // TODO: innermost - https://www.w3.org/TR/xpath-functions/#func-innermost
    // TODO: outermost - https://www.w3.org/TR/xpath-functions/#func-outermost

    // General functions and operators on sequences

    /** Returns true if the argument is the empty sequence. */
    "empty": (
        c: xpath.XPathContext,
        arg: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        if (arg instanceof xpath.XSequence) {
            return toBool(arg.size === 0);
        }
        if (arg instanceof xpath.XNodeSet) {
            return toBool(arg.size === 0);
        }
        throw new TypeError("fn:empty expected a sequence");
    },

    /** Returns true if the argument is a non-empty sequence. */
    "exists": (
        c: xpath.XPathContext,
        arg: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        if (arg instanceof xpath.XSequence) {
            return toBool(arg.size !== 0);
        }
        if (arg instanceof xpath.XNodeSet) {
            return toBool(arg.size !== 0);
        }
        throw new TypeError("fn:exists expected a sequence");
    },

    /** Returns the first element of a sequence. */
    "head": (
        c: xpath.XPathContext,
        arg: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        arg = arg.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (arg instanceof xpath.XSequence) {
            if (arg.size === 0) {
                return arg;
            }
            return arg.items[0];
        }
        if (arg instanceof xpath.XNodeSet) {
            if (arg.size === 0) {
                return xpath.XSequence.EMPTY;
            }
            if (arg.size === 1) {
                return arg;
            }
            const a = new xpath.XNodeSet();
            a.add(arg.first() as Node);
            return a;
        }
        throw new TypeError("fn:head expected a sequence");
    },

    /** Returns a slice of the sequence without the first item. */
    "tail": (
        c: xpath.XPathContext,
        arg: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        arg = arg.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (arg instanceof xpath.XSequence) {
            if (arg.size < 2) {
                return xpath.XSequence.EMPTY;
            }
            return new xpath.XSequence(arg.items.slice(2));
        }
        if (arg instanceof xpath.XNodeSet) {
            if (arg.size < 2) {
                return xpath.XSequence.EMPTY;
            }
            const a = new xpath.XNodeSet();
            a.addArray(arg.toUnsortedArray().slice(2));
            return a;
        }
        throw new TypeError("fn:tail expected a sequence");
    },

    /** Insert before. */
    "insert-before": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
        position: number,
        inserts: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        target = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        inserts = inserts.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (target.size === 0) {
            return inserts;
        }
        if (inserts.size === 0) {
            return target;
        }
        if (position < 1) {
            position = 1;
        } else if (position > target.size) {
            position = target.size;
        }
        if (target instanceof xpath.XSequence && inserts instanceof xpath.XSequence) {
            return new xpath.XSequence(([] as xpath.IValueExpression[]).concat(
                target.items.slice(0, position - 1),
                inserts,
                target.items.slice(position - 1),
            ));
        }
        if (target instanceof xpath.XNodeSet && inserts instanceof xpath.XNodeSet) {
            const a = new xpath.XNodeSet();
            const e = target.toUnsortedArray();
            a.addArray(e.slice(0, position - 1));
            a.addArray(inserts.toUnsortedArray());
            a.addArray(e.slice(position - 1));
            return a;
        }
        throw new TypeError("fn:insert-before expected a sequence");
    },

    /** Returns a slice of the sequence without the item at a specific position. */
    "remove": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
        position: number,
    ) => {
        target = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (target.size === 0 || position < 1 || position > target.size) {
            return target;
        }
        if (target instanceof xpath.XSequence) {
            return new xpath.XSequence(([] as xpath.IValueExpression[]).concat(
                target.items.slice(0, position - 1),
                target.items.slice(position),
            ));
        }
        if (target instanceof xpath.XNodeSet) {
            const a = new xpath.XNodeSet();
            const e = target.toUnsortedArray();
            a.addArray(e.slice(0, position - 1));
            a.addArray(e.slice(position));
            return a;
        }
        throw new TypeError("fn:remove expected a sequence");
    },

    /** Returns sequence in the reversed order. */
    "reverse": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        target = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (target.size === 0) {
            return target;
        }
        if (target instanceof xpath.XSequence) {
            return new xpath.XSequence(target.items.reverse());
        }
        if (target instanceof xpath.XNodeSet) {
            const a = new xpath.XNodeSet();
            const e = target.toUnsortedArray();
            a.addArray(e.reverse());
            return a;
        }
        throw new TypeError("fn:reverse expected a sequence");
    },

    /** Returns slice of a sequence. */
    "subsequence": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
        start: xpath.XNumber,
        length?: xpath.XNumber,
    ) => {
        target = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (target.size === 0) {
            return target;
        }
        let p0 = Math.round(start.evaluate(c).numberValue());
        const p1 = length ? Math.round(length.evaluate(c).numberValue()) + p0 : 0x7FFFFFFF;
        if (isNaN(p0) || isNaN(p1) || p1 <= p0 || p0 < 2) {
            return xpath.XSequence.EMPTY;
        }
        if (p0 < 1) {
            p0 = 1;
        }
        if (target instanceof xpath.XSequence) {
            return new xpath.XSequence(target.items.slice(p0 - 1, p1 - 1));
        }
        if (target instanceof xpath.XNodeSet) {
            const a = new xpath.XNodeSet();
            const e = target.toUnsortedArray();
            a.addArray(e.slice(p0 - 1, p1 - 1));
            return a;
        }
        throw new TypeError("fn:subsequence expected a sequence");
    },

    /** Returns some permutation of the sequence. */
    "unordered": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        return target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
    },

    // TODO: https://www.w3.org/TR/xpath-functions/#comparing-sequences
    // TODO: https://www.w3.org/TR/xpath-functions/#cardinality-functions

    /** Returns some permutation of the sequence. */
    "count": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        const v = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        return new xpath.XDecimal(typeof v.size === "number" ? v.size : 1);
    },

    /** Returns some permutation of the sequence. */
    "avg": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        const v = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (v.size === 0) {
            return xpath.XSequence.EMPTY;
        }
        let items: number[] = [];
        if (target instanceof xpath.XSequence) {
            items = target.items.map((x) => x.numberValue());
        } else if (target instanceof xpath.XNodeSet) {
            items = target.toArray().map((x) => parseFloat(x.textContent || ""));
        } else {
            throw new TypeError("fn:avg expected a sequence");
        }
        return new xpath.XDecimal(items.length === 1 ? items[0] : items.reduce((p, x) => p + x) / items.length);
    },

    /** Returns some permutation of the sequence. */
    "max": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
    ) => {
        const v = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (v.size === 0) {
            return xpath.XSequence.EMPTY;
        }
        let cons: { new(val: number): xpath.XNumber; } = xpath.XDecimal;
        let max: number;
        if (target instanceof xpath.XSequence) {
            cons = (target.items[0].constructor as any) || cons;
            max = target.items.reduce((p, x) => Math.max(p, x.numberValue()), Number.MIN_VALUE);
        } else if (target instanceof xpath.XNodeSet) {
            max = target.toArray().reduce((p, x) => Math.max(p, parseFloat(x.textContent || "")), Number.MIN_VALUE);
        } else {
            throw new TypeError("fn:max expected a sequence");
        }
        return new cons(max);
    },

    /** Returns some permutation of the sequence. */
    "min": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.XNumber> | xpath.XNodeSet,
    ) => {
        const v = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (v.size === 0) {
            return xpath.XSequence.EMPTY;
        }
        let cons: { new(val: number): xpath.XNumber; } = xpath.XDecimal;
        let min: number;
        if (target instanceof xpath.XSequence) {
            cons = (target.items[0].constructor as any) || cons;
            min = target.items.reduce((p, x) => Math.max(p, x.numberValue()), Number.MAX_VALUE);
        } else if (target instanceof xpath.XNodeSet) {
            min = target.toArray().reduce((p, x) => Math.max(p, parseFloat(x.textContent || "")), Number.MAX_VALUE);
        } else {
            throw new TypeError("fn:min expected a sequence");
        }
        return new cons(min);
    },

    /** Returns some permutation of the sequence. */
    "sum": (
        c: xpath.XPathContext,
        target: xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet,
        zero: xpath.IValueExpression,
    ) => {
        const v = target.evaluate(c) as xpath.XSequence<xpath.IValueExpression> | xpath.XNodeSet;
        if (v.size === 0) {
            return zero || new xpath.XDecimal(0);
        }
        let cons: { new(val: number): xpath.XNumber; } = xpath.XDecimal;
        let sum: number = 0;
        if (target instanceof xpath.XSequence) {
            cons = (target.items[0].constructor as any) || cons;
            sum = target.items.reduce(
                (p, x) => p + x.numberValue(),
                zero.evaluate(c).numberValue(),
            );
        } else if (target instanceof xpath.XNodeSet) {
            sum = target.toArray().reduce(
                (p, x) => p + parseFloat(x.textContent || ""),
                zero.evaluate(c).numberValue(),
            );
        } else {
            throw new TypeError("fn:avg expected a sequence");
        }
        return new cons(sum);
    },

    // TODO: https://www.w3.org/TR/xpath-functions/#fns-on-identifiers
    // TODO: https://www.w3.org/TR/xpath-functions/#fns-on-docs
    // TODO: https://www.w3.org/TR/xpath-functions/#parsing-and-serializing

    // TODO: https://www.w3.org/TR/xpath-functions/#context ...

};

const stdFnOp = {
    // TODO: https://www.w3.org/TR/xpath-functions/#op.numeric
    // TODO: https://www.w3.org/TR/xpath-functions/#comp.numeric
    // TODO: https://www.w3.org/TR/xpath-functions/#op.boolean
    // TODO: https://www.w3.org/TR/xpath-functions/#func-QName-equal
    // TODO: https://www.w3.org/TR/xpath-functions/#binary-functions
    // TODO: https://www.w3.org/TR/xpath-functions/#NOTATION-functions
};

const stdFnMath = {
    // TODO: https://www.w3.org/TR/xpath-functions/#trigonometry
};

const stdAddStandardFunctions = xpath.FunctionResolver.prototype.addStandardFunctions;
xpath.FunctionResolver.prototype.addStandardFunctions =
    function addStandardFunctions(this: xpath.FunctionResolver) {
        const ths = this as xpath.FunctionResolver & { functions: { [k: string]: xpath.XPathFunction; }; };
        stdAddStandardFunctions.call(ths);
        for (const f of Object.keys(ths.functions).filter((k) => k.startsWith("{}"))) {
            const ln = f.substring(2);
            ths.functions["{http://www.w3.org/2001/XMLSchema-datatypes}" + ln] = ths.functions[f];
            ths.functions["{http://www.w3.org/2001/XMLSchema}" + ln] = ths.functions[f];
        }

        for (const ln of Object.keys(stdFuncsXs) as Array<keyof typeof stdFuncsXs>) {
            const f = stdFuncsXs[ln] as xpath.XPathFunction;
            ths.functions["{}" + ln] = f;
            ths.functions["{http://www.w3.org/2001/XMLSchema-datatypes}" + ln] = f;
            ths.functions["{http://www.w3.org/2001/XMLSchema}" + ln] = f;
        }

        for (const ln of Object.keys(stdFuncsFn) as Array<keyof typeof stdFuncsFn>) {
            const f = stdFuncsFn[ln] as xpath.XPathFunction;
            ths.functions["{}" + ln] = f;
            ths.functions["{http://www.w3.org/2005/xpath-functions}" + ln] = f;
        }
    };

const stdGetNamespace = xpath.NamespaceResolver.prototype.getNamespace;
xpath.NamespaceResolver.prototype.getNamespace =
    function getNamespace(this: xpath.NamespaceResolver, prefix: string, n: Node) {
        const r = stdGetNamespace.call(this, prefix, n);
        if (r) {
            return r;
        }
        if (prefix === "xs" || prefix === "xsi") {
            return "http://www.w3.org/2001/XMLSchema-datatypes";
        }
        if (prefix === "fn") {
            return "http://www.w3.org/2005/xpath-functions";
        }
        return r;
    };

export function createOptionsEvaluator(evaluatorOptions: xpath.IXPathEvaluatorOptions) {
    return (expression: string, node: Node, single?: boolean) => {

        let ev;
        try {
            ev = xpath.parse(expression);
        } catch (e) {
            const err = new Error("Failed to parse expression: " + JSON.stringify(expression));
            (err as any).innerError = e;
            throw err;
        }
        const opts = { ...evaluatorOptions, node };
        const value = ev.evaluate(opts);

        if (value === null) {
            return undefined as any as string;
        }
        switch (typeof value) {
            case "string": return value;
            case "boolean": return value;
            case "number": return value;
            case "undefined": return undefined as any as string;
        }

        if (value instanceof xpath.XString) {
            return value.stringValue();
        }
        if (value instanceof xpath.XBoolean) {
            return value.booleanValue();
        }
        if (value instanceof xpath.XNumber) {
            return value.numberValue();
        }
        if (value instanceof xpath.XNodeSet) {
            const res = value.toArray();
            if (single) {
                return res[0];
            }
            return res;
        }
        if (value instanceof xpath.XSequence) {
            const res = [];
            for (const x of value.items) {
                if (x instanceof xpath.XNodeSet) {
                    res.push(...x.toArray());
                } else if (x instanceof xpath.XBoolean) {
                    res.push(x.booleanValue());
                } else if ((x instanceof xpath.XDecimal) || (x instanceof xpath.XDouble) ||
                    (x instanceof xpath.XFloat) || (x instanceof xpath.XNumber)) {
                    res.push(x.numberValue());
                } else if (x instanceof xpath.XString) {
                    res.push(x.stringValue());
                } else {
                    res.push(x);
                }
            }
            if (single) {
                return res[0];
            }
            return res;
        }
        throw new TypeError("Unexpected result");
    };
}

export default xpath;


// tslint:disable:max-classes-per-file

import * as hiddenXpath from "xpath";

// tslint:disable-next-line:no-namespace
export namespace xpath {
    Object.assign(xpath, hiddenXpath as {});
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

    export class XSequence<T extends IValueExpression> implements IValueExpression {
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
            return new XBoolean(this.items.length ? true : false);
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
                return new XBoolean(this.size === r.size && this.items.every((x, i) => {
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
            return new XBoolean(false);
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

    double: (c: xpath.XPathContext, v: xpath.XPathType) => new xpath.XDouble(v.evaluate(c).numberValue()),
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

function createNodeSet(...nodes: Node[]) {
    const n = new xpath.XNodeSet();
    (n as any).size = 1;
    (n as any).nodes.push(...nodes);
    return n;
}

const stdFuncsFn = {
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
        return new xpath.XBoolean(b);
    },
    // TODO: https://www.w3.org/TR/xpath-functions/#func-node-name
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

        for (const ln of Object.keys(stdFuncsFn) as Array<keyof typeof stdFuncsXs>) {
            const f = stdFuncsXs[ln] as xpath.XPathFunction;
            ths.functions["{}" + ln] = f;
            ths.functions["{http://www.w3.org/2005/xpath-functions}" + ln] = f;
        }
    };

const stdGetNamespace = xpath.NamespaceResolver.prototype.getNamespace;
xpath.NamespaceResolver.prototype.getNamespace =
    function getNamespace(this: xpath.NamespaceResolver, prefix: string, n: Node) {
        const r = stdGetNamespace.call(this, prefix, n);
        if (!r && (prefix === "xs" || prefix === "xsi")) {
            return "http://www.w3.org/2001/XMLSchema-datatypes";
        }
        return r;
    };

export default xpath;

import xpath from "./xpath-helper";

import { IValidateOptions } from "./common";

const loadedExternalDocuments = new Map<string, PromiseLike<Document>>();

export async function replaceTestWithExternalDocument(options: IValidateOptions, test: string, resourceDir: string) {

    let matches = /=document\((\'[-_.A-Za-z0-9]+\'|\"[-_.A-Za-z0-9]+\")\)/.exec(test);
    while (matches) {

        // String processing to select the non-regular predicate expression
        const equalInd = test.indexOf(matches[0]);
        let start = equalInd;
        let bracketDepth = 0;
        for (let i = equalInd; i >= 0; i--) {
            if (!bracketDepth && (test[i] === "[" || test[i] === " ")) {
                start = i + 1;
                break;
            }
            if (test[i] === "]") {
                bracketDepth++;
            } else if (test[i] === "[") {
                bracketDepth--;
            }
        }

        let end = test.length;
        bracketDepth = 0;
        for (let i = start + matches[0].length; i < test.length; i++) {
            if (!bracketDepth && (test[i] === "]" || test[i] === " ")) {
                end = i;
                break;
            }
            if (test[i] === "[") {
                bracketDepth++;
            } else if (test[i] === "]") {
                bracketDepth--;
            }
        }

        const predicate = test.slice(start, end);

        // Load external doc (load from "cache" if already loaded)
        const filepath = matches[1].slice(1, -1);
        const externalDoc = await loadXML(options, resourceDir, filepath, []);

        const externalXpath = test.slice(equalInd + matches[0].length, end);

        // Extract namespaces
        const defaultNamespaceKey = (/([^(<>.\/)]+):[^(<>.\/)]+/.exec(externalXpath) || [])[1];
        const namespaceMap: { [k: string]: string; } = {
            xs: "http://www.w3.org/2001/XMLSchema-datatypes",
            xsi: "http://www.w3.org/2001/XMLSchema-datatypes",
        };
        const docattrs = externalDoc.documentElement.attributes;
        const l = docattrs.length;
        for (let i = 0; i < l; i++) {
            const attr = docattrs[i];
            if (attr.nodeName === "xmlns") {
                namespaceMap[defaultNamespaceKey] = attr.nodeValue as string;
            } else if (attr.prefix === "xmlns") {
                namespaceMap[attr.prefix] = attr.nodeValue as string;
            }
        }

        const externalSelect = xpath.useNamespaces(namespaceMap);

        // Create new predicate from extract values
        const values: string[] = [];
        const externalResults = externalSelect(externalXpath, externalDoc) as Attr[];
        for (const extres of externalResults) {
            values.push(extres.value);
        }
        const lhv = predicate.slice(0, predicate.indexOf("=document("));
        const newPredicate = "(" + values.map((val) => lhv + "='" + val + "'").join(" or ") + ")";

        // Replace test
        test = test.slice(0, start) + newPredicate + test.slice(end);

        matches = /@[^\[\]]+=document\((\'[-_.A-Za-z0-9]+\'|\"[-_.A-Za-z0-9]+\")\)/.exec(test);
    }

    return test;
}

export function loadXML(
        options: IValidateOptions,
        relbase: string, reluri: string, loadStack?: string[]) {
    let uri = reluri;

    // resolve relative
    if (/^[^:\\\/#]+(?:\\|\/|#|$)/.test(uri)) {
        uri = "./" + uri;
    }
    if (/^\.\.?[\\\/]/.test(uri)) {
        let partbase = relbase.replace(/[^\\\/]+$/, "");
        let lastBase;
        let lastUri;
        do {
            do {
                lastUri = uri;
                uri = uri.replace(/^\.[\\\/]/, "");
            } while (lastUri !== uri);

            lastBase = partbase;
            if (/^\.\.[\\\/]/.test(uri)) {
                partbase = partbase.replace(/[^\\\/]+[\\\/]$/, "");
                uri = uri.substring(3);
            }
        } while (lastBase !== partbase || lastUri !== uri);
        uri = partbase + uri;
    }

    // check if circular
    let myLoadStack: string[];
    if (!loadStack) {
        myLoadStack = [uri];
    } else {
        if (loadStack.indexOf(uri) !== -1) {
            throw new Error("Circular includes for file path: "
                            + loadStack.map((s) => JSON.stringify(s)).join(" -> ") + " -> " + JSON.stringify(uri));
        }
        myLoadStack = [...loadStack, uri];
    }

    // load file content
    const lookupKey = (!loadStack ? "s" : "d") + uri;
    let prom = loadedExternalDocuments.get(lookupKey) as PromiseLike<Document>;
    if (prom) {
        return prom;
    }
    if (/^(?:https?|file|blob):\/\//.test(uri)) {
        prom = options.loadXMLUrl(options, uri);
    } else {
        prom = options.loadXMLFile(options, uri);
    }
    if (loadStack) {
        prom = Promise.resolve(prom).then((doc) => schematronIncludes(options, doc, uri, myLoadStack));
    }
    loadedExternalDocuments.set(lookupKey, prom);
    return prom;
}

/**
 * Default implementation for loading a file from filesystem.
 *
 * @param dom DOM constructor
 * @param url url where the document is located
 */
export async function loadXmlUrlPoly(opts: IValidateOptions, url: string) {
    const dom = await opts.DOMParser;
    let f: (url: string) => Promise<{ text(): Promise<string>; }>;
    if (typeof fetch === "undefined") {
        f = await import("node-fetch").then((nf) => nf.default);
    } else {
        f = fetch;
    }
    const r = await f(url);
    const t = await r.text();
    return new dom().parseFromString(t, "application/xml");
}

/**
 * Default implementation for loading a file from filesystem.
 *
 * @param dom DOM constructor
 * @param path file path
 */
export async function loadXmlFilePoly(opts: IValidateOptions, path: string) {
    const dom = await opts.DOMParser;
    const { readFile } = await import("fs");
    let externalXml = null;
    try {
        externalXml = await new Promise<string>((s, r) => {
            readFile(path, "utf8", (err, data) => {
                if (err) {
                    r(err);
                } else {
                    s(data);
                }
            });
        });
    } catch (err) {
        const ne = new Error("No such file '" + path + "'");
        (ne as any).innerError = err;
        throw ne;
    }
    return new dom().parseFromString(externalXml, "application/xml");
}

export async function schematronIncludes(
        options: IValidateOptions,
        doc: Document, uri: string, loadStack?: string[]) {
    const lstack = loadStack || [];
    const sel = xpath.useNamespaces({sch: "http://purl.oclc.org/dsdl/schematron"});
    const includes = (sel("//sch:include", doc) as Element[]).map((e) => {
        const href = e.getAttribute("href");
        if (!href) {
            return null;
        }
        return [e, href, loadXML(options, uri, href, lstack)] as [Element, string, Promise<Document>];
    }).filter((e) => Boolean(e)) as Array<[Element, string, Promise<Document>]>;

    for (const [e, href, subdocP] of includes) {
        const subdoc = await subdocP;
        const ins = doc.importNode<Element>(subdoc.documentElement, true);
        const comment = "sch:include(" + JSON.stringify(href) + ") ";
        const parent = e.parentNode as Element;
        parent.insertBefore(doc.createComment(" BEGIN:" + comment), e);
        parent.insertBefore(ins, e);
        parent.insertBefore(doc.createComment(" END:" + comment), e);
        parent.removeChild(e);
    }
    return doc;
}

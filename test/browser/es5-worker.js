if (typeof Proxy === "undefined") {
    importScripts("https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3/proxy.min.js");
}
if (typeof DOMParser === "undefined") {
    importScripts("../../build/dom-parser.js");
    self.DOMParser = self['dom-parser'].DOMParser;
}
importScripts("https://cdn.jsdelivr.net/npm/comlinkjs@3/umd/comlink.js");
importScripts("../../build/schematron-browser.js");
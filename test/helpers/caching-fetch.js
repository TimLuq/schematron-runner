import fetch, { Request } from "node-fetch";

/**
 * An in-memory cache based upon options object containing cached responses.
 * @type {Map<object, Map<string, Promise<Document>>>}
 */
const memoryCache = new Map();

/**
 * A fetch which caches responses for repeated use.
 * @param opts {IValidateOptions}
 * @param url {string}
 */
export default function cachingFetch(opts, url) {
    let cache = memoryCache.get(opts);
    if (!cache) {
        memoryCache.set(opts, cache = new Map());
    }
    const cached = cache.get(url);
    if (cached) {
        return cached;
    }

    const f = fetch(url).then(function (r) {
        if (!r.ok) {
            throw new Error("Expected an OK status from caching fetch: " + url);
        }
        return r.text();
    }).then(function (t) {
        return Promise.resolve(opts.DOMParser).then(function (DOMP) {
            return new DOMP().parseFromString(t, "application/xml");
        }); // TODO
    });

    cache.set(url, f);
    return f;
}

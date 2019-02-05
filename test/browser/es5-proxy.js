function factory(Comlink) { 'use strict';
    const worker = new Worker('./es5-worker.js');
    return Comlink.proxy(worker);
}

function init() { 'use strict';
    define(["https://cdn.jsdelivr.net/npm/comlinkjs@3/umd/comlink.js"], factory);
}

if (typeof Proxy === "undefined") {
    require(["https://cdn.jsdelivr.net/npm/proxy-polyfill@0.3/proxy.min.js"], init);
} else {
    init();
}

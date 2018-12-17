const fs = require("fs").promises;

const future = require("./future").default;

if (fs) {
    function copyItems(src, dst, ...keys) {
        for (const k of keys) {
            dst[k] = src[k];
        }
    }
    copyItems(fs, exports,
        "readFile");
} else {
    exports.readFile = function readFile(path, encoding) {
        const fut = future();
        fs.readFile(path, encoding, fut.asCallback);
        return fut;
    };
}

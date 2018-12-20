const fs = require("fs").promises;

if (fs) {
    function copyItems(src, dst, ...keys) {
        for (const k of keys) {
            dst[k] = src[k];
        }
    }
    copyItems(fs, exports, "readFile");
} else {
    const future = require("./future").default;

    exports.readFile = function readFile(path, encoding) {
        const fut = future();
        fs.readFile(path, encoding, fut.asCallback);
        return fut;
    };
}

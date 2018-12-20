function future() {
    const o = {};
    const prom = new Promise(function (resolve, reject) {
        o.complete = function complete(a) {
            if (o.v) { return false; }
            else { o.v = [true, a]; resolve(a); return true; }
        };
        o.completeExceptionally = function completeExceptionally(a) {
            if (o.v) { return false; }
            else { o.v = [false, a]; reject(a); return true; }
        };
    });
    prom.complete = function complete(val) { return o.complete(val); };
    prom.completeExceptionally = function completeExceptionally(val) { return o.completeExceptionally(val); };
    prom.asCallback = function futureAsCallback(err, val) {
        if (err) {
            o.completeExceptionally(err);
        } else {
            o.complete(val);
        }
    }
    return prom;
};

exports.default = future;

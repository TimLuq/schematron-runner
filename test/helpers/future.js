function future() {
    /**
     * @type {[boolean, any] | undefined | null}
     */
    let v;
    const prom = new Promise(function (resolve, reject) {
        if (v) {
            v = null;
            prom.complete = function complete(_) { return false; };
            prom.completeExceptionally = function completeExceptionally(_) { return false; };
            if (v[0]) {
                resolve(v[1]);
            } else {
                reject(v[1]);
            }
        } else {
            prom.complete = function complete(a) {
                if (v) { return false; }
                else { v = [true, a]; resolve(a); return true; }
            };
            prom.completeExceptionally = function complete(a) {
                if (v) { return false; }
                else { v = [false, a]; reject(a); return true; }
            };
            v = null;
        }
    });
    if (v !== null) {
        prom.complete = function complete(val) {
            if (v) {
                return false;
            } else {
                v = [true, val];
                return true;
            }
        };
        prom.completeExceptionally = function completeExceptionally(val) {
            if (v) {
                return false;
            } else {
                v = [false, val];
                return true;
            }
        };
    }
    prom.asCallback = function futureAsCallback(err, val) {
        if (err) {
            prom.completeExceptionally(err);
        } else {
            prom.complete(val);
        }
    }
    return prom;
};

exports.default = future;

function future() {
    /**
     * @type {[boolean, any] | undefined | null}
     */
    let v;
    let complete;
    let completeExceptionally;
    const prom = new Promise(function (resolve, reject) {
        if (v) {
            prom.complete = function complete(_) { return false; };
            prom.completeExceptionally = function completeExceptionally(_) { return false; };
            if (v[0]) {
                resolve(v[1]);
            } else {
                reject(v[1]);
            }
        } else {
            complete = function complete(a) {
                if (v) { return false; }
                else { v = [true, a]; resolve(a); return true; }
            };
            completeExceptionally = function complete(a) {
                if (v) { return false; }
                else { v = [false, a]; reject(a); return true; }
            };
        }
    });
    prom.complete = function (val) {
        if (v) {
            return false;
        } else {
            v = [true, val];
            if (complete) {
                return complete(val);
            }
            return true;
        }
    };
    prom.completeExceptionally = function (val) {
        if (v) {
            return false;
        } else {
            v = [false, val];
            if (completeExceptionally) {
                return completeExceptionally(val);
            }
            return true;
        }
    };
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

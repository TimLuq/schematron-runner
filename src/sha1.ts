interface ITextEncoder {
    encode(data: string): Uint8Array;
}

interface ITextEncoderCons {
    new(charset: string): ITextEncoder;
}

declare var TextEncoder: ITextEncoderCons;
let stringToUint8: (data: string) => Uint8Array;
let sha1hex: PromiseLike<(data: ArrayBuffer | Uint8Array | string) => PromiseLike<string>>;

if (typeof TextEncoder !== "undefined") {
    stringToUint8 = (data: string) => new TextEncoder("utf-8").encode(data);
} else if (typeof Buffer !== "undefined") {
    stringToUint8 = (data: string) => Buffer.from(data, "utf8");
} else {
    stringToUint8 = () => {
        throw new Error("No strategy for encoding text");
    };
}

/**
 * A hash function which tries to use `crypto.subtle` but falls back upon importing `crypto` library.
 * @returns {Promise<Function>} an async function accepting an `ArrayBuffer` or `Uint8Array` as the only parameter
 */
export function polymorphicSHA1(): PromiseLike<(data: ArrayBuffer | Uint8Array | string) => PromiseLike<string>> {
    if (sha1hex) {
        return sha1hex;
    }
    if (typeof crypto !== "undefined" && crypto.subtle) {
        return sha1hex = webSHA1();
    } else {
        let toBuffer: (data: ArrayBuffer | Uint8Array) => Buffer;

        if (typeof Buffer === "undefined") {
            toBuffer = (data: ArrayBuffer | Uint8Array) => {
                const arr =  data instanceof ArrayBuffer ? new Uint8Array(data) : data;
                return arr as Buffer;
            };
        } else {
            toBuffer = (data: ArrayBuffer | Uint8Array) => {
                if (data instanceof Buffer) {
                    return data as Buffer;
                }
                if (data instanceof ArrayBuffer) {
                    return Buffer.from(data);
                }
                return Buffer.from(data.buffer as ArrayBuffer, data.byteOffset, data.byteLength);
            };
        }

        return sha1hex = import("crypto").then((crpt) => (data: ArrayBuffer | Uint8Array | string) => {
            const d = typeof data === "string" ? stringToUint8(data) : data;
            const hexstr = Promise.resolve(crpt.createHash("sha1").update(toBuffer(d)).digest("hex"));
            return hexstr;
        });
    }

}

/**
 * Returns a hash function suitable for modern browsers by using `crypto.subtle`.
 * @returns {Promise<Function>} an async function accepting an `ArrayBuffer` or `Uint8Array` as the only parameter
 */
export function webSHA1(): PromiseLike<(data: ArrayBuffer | Uint8Array | string) => PromiseLike<string>> {
    if (typeof crypto !== "undefined" && crypto.subtle) {
        const hex = (data: ArrayBuffer) =>
            Array.from(new Uint8Array(data)).map((b) => ("0" + b.toString(16)).slice(-2)).join("");
        return Promise.resolve((data: ArrayBuffer | Uint8Array | string) => {
            const d = typeof data === "string" ? stringToUint8(data) : data;
            const hexstr: PromiseLike<string> = crypto.subtle.digest("SHA-1", d).then(hex);
            return hexstr;
        });
    } else {
        throw new Error("crypto.subtle is not globally defined.");
    }
}

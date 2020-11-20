"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const dsa_digest_js_1 = require("./dsa_digest.js");
const node_key_js_1 = require("./node_key.js");
const sign_js_1 = require("./sign.js");
const verify = async (alg, key, signature, data) => {
    if (alg.startsWith('HS')) {
        const expected = await sign_js_1.default(alg, key, data);
        const actual = signature;
        try {
            return crypto_1.timingSafeEqual(actual, expected);
        }
        catch {
            return false;
        }
    }
    const algorithm = dsa_digest_js_1.default(alg);
    if (!(key instanceof crypto_1.KeyObject)) {
        throw new TypeError('invalid key object type provided');
    }
    return crypto_1.verify(algorithm, data, node_key_js_1.default(alg, key), signature);
};
exports.default = verify;

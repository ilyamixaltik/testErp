"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const dsa_digest_js_1 = require("./dsa_digest.js");
const hmac_digest_js_1 = require("./hmac_digest.js");
const node_key_js_1 = require("./node_key.js");
const secret_key_js_1 = require("./secret_key.js");
const sign = async (alg, key, data) => {
    let keyObject;
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError('symmetric keys are only applicable for HMAC-based JWA algorithms');
        }
        keyObject = secret_key_js_1.default(key);
    }
    else {
        keyObject = key;
    }
    if (alg.startsWith('HS')) {
        const bitlen = parseInt(alg.substr(-3), 10);
        if (!keyObject.symmetricKeySize || keyObject.symmetricKeySize << 3 < bitlen) {
            throw new TypeError(`${alg} requires symmetric keys to be ${bitlen} bits or larger`);
        }
        const hmac = crypto_1.createHmac(hmac_digest_js_1.default(alg), keyObject);
        hmac.update(data);
        return hmac.digest();
    }
    return crypto_1.sign(dsa_digest_js_1.default(alg), data, node_key_js_1.default(alg, keyObject));
};
exports.default = sign;

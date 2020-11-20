"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subtle_dsa_js_1 = require("./subtle_dsa.js");
const webcrypto_js_1 = require("./webcrypto.js");
const check_key_length_js_1 = require("./check_key_length.js");
const sign = async (alg, key, data) => {
    webcrypto_js_1.ensureSecureContext();
    let cryptoKey;
    if (key instanceof Uint8Array) {
        if (!alg.startsWith('HS')) {
            throw new TypeError('symmetric keys are only applicable for HMAC-based algorithms');
        }
        cryptoKey = await webcrypto_js_1.default.subtle.importKey('raw', key, { hash: `SHA-${alg.substr(-3)}`, name: 'HMAC' }, false, ['sign']);
    }
    else {
        cryptoKey = key;
    }
    check_key_length_js_1.default(alg, cryptoKey);
    const signature = await webcrypto_js_1.default.subtle.sign(subtle_dsa_js_1.default(alg), cryptoKey, data);
    return new Uint8Array(signature);
};
exports.default = sign;

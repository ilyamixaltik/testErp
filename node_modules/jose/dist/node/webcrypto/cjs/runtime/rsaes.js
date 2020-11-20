"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const subtle_rsaes_js_1 = require("./subtle_rsaes.js");
const bogus_js_1 = require("./bogus.js");
const webcrypto_js_1 = require("./webcrypto.js");
const check_key_length_js_1 = require("./check_key_length.js");
exports.encrypt = async (alg, key, cek) => {
    webcrypto_js_1.ensureSecureContext();
    check_key_length_js_1.default(alg, key);
    if (key.usages.includes('encrypt')) {
        return new Uint8Array(await webcrypto_js_1.default.subtle.encrypt(subtle_rsaes_js_1.default(alg), key, cek));
    }
    if (key.usages.includes('wrapKey')) {
        const cryptoKeyCek = await webcrypto_js_1.default.subtle.importKey('raw', cek, ...bogus_js_1.default);
        return new Uint8Array(await webcrypto_js_1.default.subtle.wrapKey('raw', cryptoKeyCek, key, subtle_rsaes_js_1.default(alg)));
    }
    throw new TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation');
};
exports.decrypt = async (alg, key, encryptedKey) => {
    webcrypto_js_1.ensureSecureContext();
    check_key_length_js_1.default(alg, key);
    if (key.usages.includes('decrypt')) {
        return new Uint8Array(await webcrypto_js_1.default.subtle.decrypt(subtle_rsaes_js_1.default(alg), key, encryptedKey));
    }
    if (key.usages.includes('unwrapKey')) {
        const cryptoKeyCek = await webcrypto_js_1.default.subtle.unwrapKey('raw', encryptedKey, key, subtle_rsaes_js_1.default(alg), ...bogus_js_1.default);
        return new Uint8Array(await webcrypto_js_1.default.subtle.exportKey('raw', cryptoKeyCek));
    }
    throw new TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation');
};

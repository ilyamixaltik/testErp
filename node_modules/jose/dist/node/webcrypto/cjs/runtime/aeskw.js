"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrap = exports.wrap = void 0;
const bogus_js_1 = require("./bogus.js");
const webcrypto_js_1 = require("./webcrypto.js");
function checkKeySize(key, alg) {
    if (key.algorithm.length !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`invalid key size for alg: ${alg}`);
    }
}
exports.wrap = async (alg, key, cek) => {
    webcrypto_js_1.ensureSecureContext();
    let cryptoKey;
    if (key instanceof Uint8Array) {
        cryptoKey = await webcrypto_js_1.default.subtle.importKey('raw', key, 'AES-KW', true, ['wrapKey']);
    }
    else {
        cryptoKey = key;
    }
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await webcrypto_js_1.default.subtle.importKey('raw', cek, ...bogus_js_1.default);
    return new Uint8Array(await webcrypto_js_1.default.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'));
};
exports.unwrap = async (alg, key, encryptedKey) => {
    webcrypto_js_1.ensureSecureContext();
    let cryptoKey;
    if (key instanceof Uint8Array) {
        cryptoKey = await webcrypto_js_1.default.subtle.importKey('raw', key, 'AES-KW', true, ['unwrapKey']);
    }
    else {
        cryptoKey = key;
    }
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await webcrypto_js_1.default.subtle.unwrapKey('raw', encryptedKey, cryptoKey, 'AES-KW', ...bogus_js_1.default);
    return new Uint8Array(await webcrypto_js_1.default.subtle.exportKey('raw', cryptoKeyCek));
};

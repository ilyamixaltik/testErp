"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unwrap = exports.wrap = void 0;
const crypto_1 = require("crypto");
const errors_js_1 = require("../util/errors.js");
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const secret_key_js_1 = require("./secret_key.js");
function checkKeySize(key, alg) {
    if (key.symmetricKeySize << 3 !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`invalid key size for alg: ${alg}`);
    }
}
exports.wrap = async (alg, key, cek) => {
    const size = parseInt(alg.substr(1, 3), 10);
    const algorithm = `aes${size}-wrap`;
    if (!crypto_1.getCiphers().includes(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is unsupported either by JOSE or your javascript runtime`);
    }
    const keyObject = secret_key_js_1.default(key);
    checkKeySize(keyObject, alg);
    const cipher = crypto_1.createCipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6));
    return buffer_utils_js_1.concat(cipher.update(cek), cipher.final());
};
exports.unwrap = async (alg, key, encryptedKey) => {
    const size = parseInt(alg.substr(1, 3), 10);
    const algorithm = `aes${size}-wrap`;
    if (!crypto_1.getCiphers().includes(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is unsupported either by JOSE or your javascript runtime`);
    }
    const keyObject = secret_key_js_1.default(key);
    checkKeySize(keyObject, alg);
    const cipher = crypto_1.createDecipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6));
    return buffer_utils_js_1.concat(cipher.update(encryptedKey), cipher.final());
};

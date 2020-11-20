import bogusWebCrypto from './bogus.js';
import crypto, { ensureSecureContext } from './webcrypto.js';
function checkKeySize(key, alg) {
    if (key.algorithm.length !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`invalid key size for alg: ${alg}`);
    }
}
export const wrap = async (alg, key, cek) => {
    ensureSecureContext();
    let cryptoKey;
    if (key instanceof Uint8Array) {
        cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-KW', true, ['wrapKey']);
    }
    else {
        cryptoKey = key;
    }
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await crypto.subtle.importKey('raw', cek, ...bogusWebCrypto);
    return new Uint8Array(await crypto.subtle.wrapKey('raw', cryptoKeyCek, cryptoKey, 'AES-KW'));
};
export const unwrap = async (alg, key, encryptedKey) => {
    ensureSecureContext();
    let cryptoKey;
    if (key instanceof Uint8Array) {
        cryptoKey = await crypto.subtle.importKey('raw', key, 'AES-KW', true, ['unwrapKey']);
    }
    else {
        cryptoKey = key;
    }
    checkKeySize(cryptoKey, alg);
    const cryptoKeyCek = await crypto.subtle.unwrapKey('raw', encryptedKey, cryptoKey, 'AES-KW', ...bogusWebCrypto);
    return new Uint8Array(await crypto.subtle.exportKey('raw', cryptoKeyCek));
};

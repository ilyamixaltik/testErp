import { createDecipheriv, createCipheriv, getCiphers } from 'crypto';
import { JOSENotSupported } from '../util/errors.js';
import { concat } from '../lib/buffer_utils.js';
import getSecretKey from './secret_key.js';
function checkKeySize(key, alg) {
    if (key.symmetricKeySize << 3 !== parseInt(alg.substr(1, 3), 10)) {
        throw new TypeError(`invalid key size for alg: ${alg}`);
    }
}
export const wrap = async (alg, key, cek) => {
    const size = parseInt(alg.substr(1, 3), 10);
    const algorithm = `aes${size}-wrap`;
    if (!getCiphers().includes(algorithm)) {
        throw new JOSENotSupported(`alg ${alg} is unsupported either by JOSE or your javascript runtime`);
    }
    const keyObject = getSecretKey(key);
    checkKeySize(keyObject, alg);
    const cipher = createCipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6));
    return concat(cipher.update(cek), cipher.final());
};
export const unwrap = async (alg, key, encryptedKey) => {
    const size = parseInt(alg.substr(1, 3), 10);
    const algorithm = `aes${size}-wrap`;
    if (!getCiphers().includes(algorithm)) {
        throw new JOSENotSupported(`alg ${alg} is unsupported either by JOSE or your javascript runtime`);
    }
    const keyObject = getSecretKey(key);
    checkKeySize(keyObject, alg);
    const cipher = createDecipheriv(algorithm, keyObject, Buffer.alloc(8, 0xa6));
    return concat(cipher.update(encryptedKey), cipher.final());
};

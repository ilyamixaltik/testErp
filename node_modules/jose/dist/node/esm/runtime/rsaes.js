import { publicEncrypt, constants, privateDecrypt } from 'crypto';
import checkModulusLength from './check_modulus_length.js';
const checkKey = (key, alg) => {
    if (key.type === 'secret' || key.asymmetricKeyType !== 'rsa') {
        throw new TypeError('invalid key type or asymmetric key type for this operation');
    }
    checkModulusLength(key, alg);
};
const resolvePadding = (alg) => {
    switch (alg) {
        case 'RSA-OAEP':
        case 'RSA-OAEP-256':
        case 'RSA-OAEP-384':
        case 'RSA-OAEP-512':
            return constants.RSA_PKCS1_OAEP_PADDING;
        case 'RSA1_5':
            return constants.RSA_PKCS1_PADDING;
        default:
            return undefined;
    }
};
const resolveOaepHash = (alg) => {
    switch (alg) {
        case 'RSA-OAEP':
            return 'sha1';
        case 'RSA-OAEP-256':
            return 'sha256';
        case 'RSA-OAEP-384':
            return 'sha384';
        case 'RSA-OAEP-512':
            return 'sha512';
        default:
            return undefined;
    }
};
export const encrypt = async (alg, key, cek) => {
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    checkKey(key, alg);
    return publicEncrypt({ key, oaepHash, padding }, cek);
};
export const decrypt = async (alg, key, encryptedKey) => {
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    checkKey(key, alg);
    return privateDecrypt({ key, oaepHash, padding }, encryptedKey);
};

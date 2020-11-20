"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecdhAllowed = exports.publicJwkToEphemeralKey = exports.generateEpk = exports.ephemeralKeyToPublicJWK = exports.deriveKey = void 0;
const crypto_1 = require("crypto");
const util_1 = require("util");
const base64url = require("./base64url.js");
const get_named_curve_js_1 = require("./get_named_curve.js");
const buffer_utils_js_1 = require("../lib/buffer_utils.js");
const digest_js_1 = require("./digest.js");
const errors_js_1 = require("../util/errors.js");
const generateKeyPair = util_1.promisify(crypto_1.generateKeyPair);
const concatKdf = buffer_utils_js_1.concatKdf.bind(undefined, digest_js_1.default.bind(undefined, 'sha256'));
exports.deriveKey = async (publicKey, privateKey, algorithm, keyLength, apu = new Uint8Array(), apv = new Uint8Array()) => {
    const value = buffer_utils_js_1.concat(buffer_utils_js_1.lengthAndInput(buffer_utils_js_1.encoder.encode(algorithm)), buffer_utils_js_1.lengthAndInput(apu), buffer_utils_js_1.lengthAndInput(apv), buffer_utils_js_1.uint32be(keyLength));
    const sharedSecret = crypto_1.diffieHellman({ privateKey, publicKey });
    return concatKdf(sharedSecret, keyLength, value);
};
exports.ephemeralKeyToPublicJWK = function ephemeralKeyToPublicJWK(key) {
    switch (key.asymmetricKeyType) {
        case 'x25519':
        case 'x448': {
            const s = key.asymmetricKeyType === 'x25519' ? 32 : 56;
            return {
                crv: key.asymmetricKeyType.toUpperCase(),
                kty: 'OKP',
                x: base64url.encode(crypto_1.createPublicKey(key).export({ format: 'der', type: 'spki' }).slice(-s)),
            };
        }
        case 'ec': {
            const crv = get_named_curve_js_1.default(key);
            const s = crv === 'P-256' ? 64 : crv === 'P-384' ? 96 : 132;
            const b = key.export({ format: 'der', type: 'pkcs8' });
            const x = base64url.encode(b.slice(-s, -s >> 1));
            const y = base64url.encode(b.slice(-s >> 1));
            return { crv, kty: 'EC', x, y };
        }
        default:
            throw new errors_js_1.JOSENotSupported('unsupported or invalid EPK');
    }
};
exports.generateEpk = async (key) => {
    switch (key.asymmetricKeyType) {
        case 'x25519':
            return (await generateKeyPair('x25519')).privateKey;
        case 'x448': {
            return (await generateKeyPair('x448')).privateKey;
        }
        case 'ec': {
            const namedCurve = get_named_curve_js_1.default(key);
            return (await generateKeyPair('ec', { namedCurve })).privateKey;
        }
        default:
            throw new errors_js_1.JOSENotSupported('unsupported or invalid EPK');
    }
};
exports.publicJwkToEphemeralKey = async (jwk) => {
    let pem;
    switch (jwk.crv) {
        case 'P-256':
            pem = Buffer.concat([
                Buffer.from('3059301306072a8648ce3d020106082a8648ce3d03010703420004', 'hex'),
                base64url.decode(jwk.x),
                base64url.decode(jwk.y),
            ]);
            break;
        case 'P-384':
            pem = Buffer.concat([
                Buffer.from('3076301006072a8648ce3d020106052b8104002203620004', 'hex'),
                base64url.decode(jwk.x),
                base64url.decode(jwk.y),
            ]);
            break;
        case 'P-521':
            pem = Buffer.concat([
                Buffer.from('30819b301006072a8648ce3d020106052b810400230381860004', 'hex'),
                base64url.decode(jwk.x),
                base64url.decode(jwk.y),
            ]);
            break;
        case 'X25519':
            pem = Buffer.concat([
                Buffer.from('302a300506032b656e032100', 'hex'),
                base64url.decode(jwk.x),
            ]);
            break;
        case 'X448':
            pem = Buffer.concat([
                Buffer.from('3042300506032b656f033900', 'hex'),
                base64url.decode(jwk.x),
            ]);
            break;
        default:
            throw new errors_js_1.JOSENotSupported('unsupported or invalid JWK "crv" (Curve or Subtype of Key Pair) Parameter value');
    }
    return crypto_1.createPublicKey({ format: 'der', key: pem, type: 'spki' });
};
const curves = ['P-256', 'P-384', 'P-521', 'X25519', 'X448'];
exports.ecdhAllowed = (key) => curves.includes(get_named_curve_js_1.default(key));

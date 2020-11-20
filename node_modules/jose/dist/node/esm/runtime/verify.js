import { verify as oneShotVerify, timingSafeEqual, KeyObject } from 'crypto';
import nodeDigest from './dsa_digest.js';
import nodeKey from './node_key.js';
import sign from './sign.js';
const verify = async (alg, key, signature, data) => {
    if (alg.startsWith('HS')) {
        const expected = await sign(alg, key, data);
        const actual = signature;
        try {
            return timingSafeEqual(actual, expected);
        }
        catch {
            return false;
        }
    }
    const algorithm = nodeDigest(alg);
    if (!(key instanceof KeyObject)) {
        throw new TypeError('invalid key object type provided');
    }
    return oneShotVerify(algorithm, data, nodeKey(alg, key), signature);
};
export default verify;

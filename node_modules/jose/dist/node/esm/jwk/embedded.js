import parseJwk from './parse.js';
import isObject from '../lib/is_object.js';
import { JWSInvalid } from '../util/errors.js';
export default async function EmbeddedJWK(protectedHeader, token) {
    const combinedHeader = {
        ...protectedHeader,
        ...token.header,
    };
    if (!isObject(combinedHeader.jwk)) {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = (await parseJwk(combinedHeader.jwk, combinedHeader.alg, true));
    if (key.type !== 'public') {
        throw new JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}

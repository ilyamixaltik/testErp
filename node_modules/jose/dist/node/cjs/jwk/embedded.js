"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parse_js_1 = require("./parse.js");
const is_object_js_1 = require("../lib/is_object.js");
const errors_js_1 = require("../util/errors.js");
async function EmbeddedJWK(protectedHeader, token) {
    const combinedHeader = {
        ...protectedHeader,
        ...token.header,
    };
    if (!is_object_js_1.default(combinedHeader.jwk)) {
        throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = (await parse_js_1.default(combinedHeader.jwk, combinedHeader.alg, true));
    if (key.type !== 'public') {
        throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}
exports.default = EmbeddedJWK;

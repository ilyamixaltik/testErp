"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_js_1 = require("../runtime/generate.js");
async function generateKeyPair(alg, options) {
    return generate_js_1.generateKeyPair(alg, options);
}
exports.default = generateKeyPair;

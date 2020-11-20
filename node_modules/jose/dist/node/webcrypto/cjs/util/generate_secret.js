"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generate_js_1 = require("../runtime/generate.js");
async function generateSecret(alg) {
    return generate_js_1.generateSecret(alg);
}
exports.default = generateSecret;

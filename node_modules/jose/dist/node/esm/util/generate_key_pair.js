import { generateKeyPair as generate } from '../runtime/generate.js';
export default async function generateKeyPair(alg, options) {
    return generate(alg, options);
}

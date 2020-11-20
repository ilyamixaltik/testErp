import { generateSecret as generate } from '../runtime/generate.js';
export default async function generateSecret(alg) {
    return generate(alg);
}

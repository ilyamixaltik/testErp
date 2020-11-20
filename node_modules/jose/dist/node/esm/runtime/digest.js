import { createHash } from 'crypto';
const digest = (algorithm, data) => {
    return createHash(algorithm).update(data).digest();
};
export default digest;

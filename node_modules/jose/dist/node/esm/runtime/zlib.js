import { promisify } from 'util';
import { inflateRaw as inflateRawCb, deflateRaw as deflateRawCb } from 'zlib';
const inflateRaw = promisify(inflateRawCb);
const deflateRaw = promisify(deflateRawCb);
export const inflate = async (input) => {
    return inflateRaw(input);
};
export const deflate = async (input) => {
    return deflateRaw(input);
};

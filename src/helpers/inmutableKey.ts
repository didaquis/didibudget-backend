import crypto from 'crypto';

const NUMBER_OF_BYTES = 10;

/**
 * Valid format of an `inmutableKey`: 20 hexadecimal characters.
 */
export const INMUTABLE_KEY_PATTERN = /^[a-f0-9]{20}$/i;

/**
 * Create a random `inmutableKey` for a default expense category or subcategory.
 * Run `npm run generate-key` instead of calling it by hand.
 * @param usedKeys Keys that already exist. The new key is never one of them.
 */
export const generateInmutableKey = (usedKeys: ReadonlySet<string> = new Set()): string => {
	let key: string;
	do {
		key = crypto.randomBytes(NUMBER_OF_BYTES).toString('hex');
	} while (usedKeys.has(key));
	return key;
};

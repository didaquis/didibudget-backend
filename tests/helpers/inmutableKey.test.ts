import { describe, expect, test } from 'vitest';
import { INMUTABLE_KEY_PATTERN, generateInmutableKey } from '#/helpers/inmutableKey.js';

describe('inmutableKey', () => {
	describe('generateInmutableKey', () => {
		test('Should return 20 hexadecimal characters', () => {
			expect(generateInmutableKey()).toMatch(INMUTABLE_KEY_PATTERN);
		});

		test('Should return a different value on each call', () => {
			expect(generateInmutableKey()).not.toBe(generateInmutableKey());
		});

		test('Should never return a key that is already in use', () => {
			const usedKeys = new Set(Array.from({ length: 50 }, () => generateInmutableKey()));

			const key = generateInmutableKey(usedKeys);

			expect(usedKeys.has(key)).toBe(false);
		});
	});

	describe('INMUTABLE_KEY_PATTERN', () => {
		test('Should accept 20 hexadecimal characters only', () => {
			expect(INMUTABLE_KEY_PATTERN.test('460371f9c7dd617db025')).toBe(true);
			expect(INMUTABLE_KEY_PATTERN.test('460371f9c7dd617db02')).toBe(false);
			expect(INMUTABLE_KEY_PATTERN.test('460371f9c7dd617db0255')).toBe(false);
			expect(INMUTABLE_KEY_PATTERN.test('460371f9c7dd617db02g')).toBe(false);
		});
	});
});

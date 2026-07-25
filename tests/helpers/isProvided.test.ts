import { describe, expect, test } from 'vitest';
import { isProvided } from '#/helpers/isProvided.js';

describe('isProvided', () => {
	test('Should return true for a value', () => {
		expect(isProvided('507f1f77bcf86cd799439011')).toBe(true);
		expect(isProvided(23.15)).toBe(true);
		expect(isProvided(new Date('2024-01-15'))).toBe(true);
	});

	test('Should return true for values that are falsy but provided', () => {
		expect(isProvided(0)).toBe(true);
		expect(isProvided('')).toBe(true);
		expect(isProvided(false)).toBe(true);
		expect(isProvided(NaN)).toBe(true);
	});

	test('Should return false when the argument is omitted', () => {
		expect(isProvided(undefined)).toBe(false);
	});

	test('Should return false when the argument is an explicit null', () => {
		expect(isProvided(null)).toBe(false);
	});
});

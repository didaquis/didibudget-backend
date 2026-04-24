import { describe, expect, test } from 'vitest';
import { roundToTwoDecimals } from '#/helpers/roundToTwoDecimals.js';

describe('roundToTwoDecimals', () => {
	test('Should return 0 if no receive params', () => {
		expect(roundToTwoDecimals()).toBe(0);
	});

	test('Should return 0 if receive a non-numeric value', () => {
		expect(roundToTwoDecimals('foo')).toBe(0);
		expect(roundToTwoDecimals('')).toBe(0);
		expect(roundToTwoDecimals(null)).toBe(0);
		expect(roundToTwoDecimals(undefined)).toBe(0);
		expect(roundToTwoDecimals(NaN)).toBe(0);
	});

	test('Should round to 2 decimal places correctly', () => {
		expect(roundToTwoDecimals(1.234)).toBe(1.23);
		expect(roundToTwoDecimals(1.235)).toBe(1.24);
		expect(roundToTwoDecimals(10)).toBe(10);
		expect(roundToTwoDecimals(10.1)).toBe(10.1);
		expect(roundToTwoDecimals(0)).toBe(0);
		expect(roundToTwoDecimals(-1.234)).toBe(-1.23);
		expect(roundToTwoDecimals(99.999)).toBe(100);
	});

	test('Should handle string numbers', () => {
		expect(roundToTwoDecimals('1.234')).toBe(1.23);
		expect(roundToTwoDecimals('10')).toBe(10);
	});
});

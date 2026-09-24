import { describe, expect, test } from 'vitest';
import { Month } from '#/data/Month.js';
import { formatMonth, getMonthName, getMonthNumber } from '#/helpers/monthlyBalanceMonth.js';

describe('monthlyBalanceMonth', () => {
	describe('getMonthNumber', () => {
		test('Should number the months from 1 to 12', () => {
			expect(getMonthNumber(Month.JANUARY)).toBe(1);
			expect(getMonthNumber(Month.DECEMBER)).toBe(12);
		});
	});

	describe('getMonthName', () => {
		test('Should name the months from 1 to 12', () => {
			expect(getMonthName(1)).toBe(Month.JANUARY);
			expect(getMonthName(12)).toBe(Month.DECEMBER);
		});

		test('Should be the inverse of getMonthNumber for every month', () => {
			Object.values(Month).forEach((month) => {
				expect(getMonthName(getMonthNumber(month))).toBe(month);
			});
		});
	});

	describe('formatMonth', () => {
		test('Should format a month for people', () => {
			expect(formatMonth(2026, 1)).toBe('January 2026');
			expect(formatMonth(2025, 12)).toBe('December 2025');
		});
	});
});

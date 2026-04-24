import { describe, expect, test } from 'vitest';
import { getOffset, getTotalPagesNumber } from '#/helpers/pagingUtilities.js';

describe('pagingUtilities', () => {
	describe('getOffset', () => {
		test('Should return 0 for first page', () => {
			expect(getOffset(1, 10)).toBe(0);
			expect(getOffset(1, 50)).toBe(0);
		});

		test('Should calculate offset correctly for other pages', () => {
			expect(getOffset(2, 10)).toBe(10);
			expect(getOffset(3, 10)).toBe(20);
			expect(getOffset(2, 50)).toBe(50);
			expect(getOffset(5, 20)).toBe(80);
		});
	});

	describe('getTotalPagesNumber', () => {
		test('Should return 1 if total count is less than or equal to page size', () => {
			expect(getTotalPagesNumber(5, 10)).toBe(1);
			expect(getTotalPagesNumber(10, 10)).toBe(1);
		});

		test('Should calculate total pages correctly', () => {
			expect(getTotalPagesNumber(11, 10)).toBe(2);
			expect(getTotalPagesNumber(25, 10)).toBe(3);
			expect(getTotalPagesNumber(100, 10)).toBe(10);
			expect(getTotalPagesNumber(101, 10)).toBe(11);
		});

		test('Should handle zero total count', () => {
			expect(getTotalPagesNumber(0, 10)).toBe(0);
		});
	});
});

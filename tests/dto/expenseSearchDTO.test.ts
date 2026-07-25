import { describe, expect, test } from 'vitest';
import { Types } from 'mongoose';
import { expenseSearchDTO } from '#/dto/expenseSearchDTO.js';

const pagination = { currentPage: 1, totalPages: 3, totalCount: 25 };

describe('expenseSearchDTO', () => {
	test('Should return every field of the search result', () => {
		const result = expenseSearchDTO([], pagination, 150.75, 'EUR', []);

		expect(result).toStrictEqual({
			expenses: [],
			pagination,
			totalSum: 150.75,
			currencyISO: 'EUR',
			breakdown: []
		});
	});

	test('Should round the total sum to two decimals', () => {
		const result = expenseSearchDTO([], pagination, 150.756789, 'EUR', []);

		expect(result.totalSum).toBe(150.76);
	});

	// The values avoid the exact half cent on purpose: roundToTwoDecimals delegates on toFixed,
	// so whether 10.005 rounds up or down depends on how the number lands in binary
	test('Should round every breakdown sum to two decimals', () => {
		const result = expenseSearchDTO([], pagination, 0, 'EUR', [
			{ category: 'category-id-1', sum: 10.00789, count: 2 },
			{ category: 'category-id-2', sum: 5.00123, count: 1 }
		]);

		expect(result.breakdown[0].sum).toBe(10.01);
		expect(result.breakdown[1].sum).toBe(5);
	});

	test('Should convert identifiers to strings', () => {
		const category = new Types.ObjectId('507f1f77bcf86cd799439011');
		const subcategory = new Types.ObjectId('507f1f77bcf86cd799439012');

		const result = expenseSearchDTO([], pagination, 0, 'EUR', [
			{ category, subcategory, sum: 10, count: 1 }
		]);

		expect(result.breakdown[0].category).toBe('507f1f77bcf86cd799439011');
		expect(result.breakdown[0].subcategory).toBe('507f1f77bcf86cd799439012');
	});

	test('Should normalise a missing subcategory to null', () => {
		const result = expenseSearchDTO([], pagination, 0, 'EUR', [
			{ category: 'category-id-1', sum: 10, count: 1 },
			{ category: 'category-id-2', subcategory: null, sum: 5, count: 1 }
		]);

		expect(result.breakdown[0].subcategory).toBeNull();
		expect(result.breakdown[1].subcategory).toBeNull();
	});

	test('Should keep the breakdown counts untouched', () => {
		const result = expenseSearchDTO([], pagination, 0, 'EUR', [
			{ category: 'category-id-1', sum: 10, count: 7 }
		]);

		expect(result.breakdown[0].count).toBe(7);
	});

	test('Should keep the order of the breakdown entries it receives', () => {
		const result = expenseSearchDTO([], pagination, 0, 'EUR', [
			{ category: 'category-id-1', sum: 30, count: 1 },
			{ category: 'category-id-2', sum: 20, count: 1 },
			{ category: 'category-id-3', sum: 10, count: 1 }
		]);

		expect(result.breakdown.map((entry) => entry.category)).toEqual(['category-id-1', 'category-id-2', 'category-id-3']);
	});
});

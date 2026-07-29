import { describe, expect, test } from 'vitest';
import { Types } from 'mongoose';
import { mostUsedExpenseCategoryDTO } from '#/dto/mostUsedExpenseCategoryDTO.js';

const categoryId = new Types.ObjectId();
const subcategoryId = new Types.ObjectId();

describe('mostUsedExpenseCategoryDTO', () => {
	test('Should build the DTO of a category with a subcategory', () => {
		const result = mostUsedExpenseCategoryDTO({
			category: { _id: categoryId, name: 'Private vehicles', emojis: ['🚙'] },
			subcategory: { _id: subcategoryId, name: 'Fuel', emojis: ['⛽️'] },
			total: 12
		});

		expect(result).toStrictEqual({
			category: categoryId,
			categoryName: 'Private vehicles',
			categoryEmojis: ['🚙'],
			subcategory: subcategoryId,
			subcategoryName: 'Fuel',
			subcategoryEmojis: ['⛽️'],
			total: 12
		});
	});

	test('Should build the DTO of a category without subcategory', () => {
		const result = mostUsedExpenseCategoryDTO({
			category: { _id: categoryId, name: 'Taxes', emojis: ['🏛'] },
			subcategory: null,
			total: 3
		});

		expect(result.subcategory).toBeNull();
		expect(result.subcategoryName).toBeNull();
		expect(result.subcategoryEmojis).toStrictEqual([]);
	});

	test('Should default the emojis to an empty array when they are missing', () => {
		const result = mostUsedExpenseCategoryDTO({
			category: { _id: categoryId, name: 'Taxes' },
			subcategory: { _id: subcategoryId, name: 'Council tax' },
			total: 1
		});

		expect(result.categoryEmojis).toStrictEqual([]);
		expect(result.subcategoryEmojis).toStrictEqual([]);
	});
});

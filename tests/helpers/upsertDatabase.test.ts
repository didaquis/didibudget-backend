import { describe, expect, test, beforeEach, vi } from 'vitest';

const mockCreateIndexes = vi.hoisted(() => vi.fn());

vi.mock('#/data/models/index.js', () => ({
	Expenses: { createIndexes: mockCreateIndexes },
	MonthlyBalance: { createIndexes: mockCreateIndexes },
	RecurringExpenseSuggestion: { createIndexes: mockCreateIndexes },
	ExpenseCategory: { createIndexes: mockCreateIndexes, findOneAndUpdate: vi.fn() },
	ExpenseSubcategory: { createIndexes: mockCreateIndexes, findOneAndUpdate: vi.fn() }
}));

import { createDatabaseIndexes, upsertDBWithExpenseCategories } from '#/helpers/upsertDatabase.js';
import { ExpenseCategory, ExpenseSubcategory } from '#/data/models/index.js';

describe('createDatabaseIndexes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Should call createIndexes on all models', async () => {
		await createDatabaseIndexes();

		expect(mockCreateIndexes).toHaveBeenCalledTimes(5);
	});

	test('Should call createIndexes on Expenses model', async () => {
		await createDatabaseIndexes();

		expect(mockCreateIndexes).toHaveBeenCalled();
	});
});

describe('upsertDBWithExpenseCategories', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Should not call findOneAndUpdate if no categories are provided', async () => {
		await upsertDBWithExpenseCategories([]);

		expect(ExpenseSubcategory.findOneAndUpdate).not.toHaveBeenCalled();
		expect(ExpenseCategory.findOneAndUpdate).not.toHaveBeenCalled();
	});

	test('Should upsert subcategories and category when category has subcategories', async () => {
		const mockSubcategoryId = 'subcategory-id-1';
		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockResolvedValue({ _id: mockSubcategoryId });

		const categories = [
			{
				name: 'Food',
				inmutableKey: 'food',
				emojis: ['🍕'],
				categoryType: 'expense',
				subcategories: [
					{ name: 'Restaurant', inmutableKey: 'restaurant', emojis: ['🍽️'] }
				]
			}
		];

		await upsertDBWithExpenseCategories(categories);

		expect(ExpenseSubcategory.findOneAndUpdate).toHaveBeenCalledWith(
			{ inmutableKey: 'restaurant' },
			{ name: 'Restaurant', inmutableKey: 'restaurant', emojis: ['🍽️'] },
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenCalledWith(
			{ inmutableKey: 'food' },
			{
				name: 'Food',
				inmutableKey: 'food',
				subcategories: [mockSubcategoryId],
				emojis: ['🍕'],
				categoryType: 'expense'
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
	});

	test('Should upsert category with empty array when category has no subcategories', async () => {
		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockResolvedValue([] as never);

		const categories = [
			{
				name: 'Salary',
				inmutableKey: 'salary',
				emojis: ['💰'],
				categoryType: 'income',
				subcategories: []
			}
		];

		await upsertDBWithExpenseCategories(categories);

		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenCalledWith(
			{ inmutableKey: 'salary' },
			{
				name: 'Salary',
				inmutableKey: 'salary',
				subcategories: [],
				emojis: ['💰'],
				categoryType: 'income'
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
	});

	test('Should upsert multiple categories', async () => {
		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockResolvedValue({ _id: 'id' });

		const categories = [
			{
				name: 'Food',
				inmutableKey: 'food',
				emojis: ['🍕'],
				categoryType: 'expense',
				subcategories: [{ name: 'Restaurant', inmutableKey: 'restaurant', emojis: ['🍽️'] }]
			},
			{
				name: 'Transport',
				inmutableKey: 'transport',
				emojis: ['🚗'],
				categoryType: 'expense',
				subcategories: [{ name: 'Fuel', inmutableKey: 'fuel', emojis: ['⛽'] }]
			}
		];

		await upsertDBWithExpenseCategories(categories);

		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenCalledTimes(2);
	});
});


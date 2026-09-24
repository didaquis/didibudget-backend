import { describe, expect, test, beforeEach, vi } from 'vitest';

const mockCreateIndexes = vi.hoisted(() => vi.fn());
const mockMonthlyBalanceCreateIndexes = vi.hoisted(() => vi.fn());

vi.mock('#/data/models/index.js', () => ({
	Expenses: { createIndexes: mockCreateIndexes },
	MonthlyBalance: { createIndexes: mockMonthlyBalanceCreateIndexes },
	RecurringExpenseSuggestion: { createIndexes: mockCreateIndexes },
	ExpenseCategory: { createIndexes: mockCreateIndexes, findOneAndUpdate: vi.fn() },
	ExpenseSubcategory: { createIndexes: mockCreateIndexes, findOneAndUpdate: vi.fn() }
}));

vi.mock('#/helpers/logger.js', () => ({
	logger: { error: vi.fn() }
}));

import { createDatabaseIndexes, ExpenseCategoryInput, upsertDBWithExpenseCategories } from '#/helpers/upsertDatabase.js';
import { ExpenseCategory, ExpenseSubcategory } from '#/data/models/index.js';
import { logger } from '#/helpers/logger.js';

describe('createDatabaseIndexes', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Should call createIndexes on all models', async () => {
		await createDatabaseIndexes();

		expect(mockCreateIndexes).toHaveBeenCalledTimes(4);
		expect(mockMonthlyBalanceCreateIndexes).toHaveBeenCalledTimes(1);
		expect(logger.error).not.toHaveBeenCalled();
	});

	test('Should log and keep going when the monthly balance indexes cannot be created', async () => {
		const error = new Error('E11000 duplicate key error');
		mockMonthlyBalanceCreateIndexes.mockRejectedValueOnce(error);

		await expect(createDatabaseIndexes()).resolves.toBeUndefined();

		expect(logger.error).toHaveBeenCalledWith(expect.stringContaining('{ user_id, year, month }'), error);
		expect(mockCreateIndexes).toHaveBeenCalledTimes(4);
	});

	test('Should still stop when the indexes of another model cannot be created', async () => {
		mockCreateIndexes.mockRejectedValueOnce(new Error('Connection lost'));

		await expect(createDatabaseIndexes()).rejects.toThrow('Connection lost');
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

	test('Should upsert subcategories and category with correct arguments', async () => {
		const mockSubcategoryId = 'subcategory-id-1';
		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockResolvedValue({ _id: mockSubcategoryId });

		const categories: ExpenseCategoryInput[] = [
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

	test('Should upsert category with empty subcategories array when category has no subcategories', async () => {
		const categories: ExpenseCategoryInput[] = [
			{
				name: 'Salary',
				inmutableKey: 'salary',
				emojis: ['💰'],
				categoryType: 'income',
				subcategories: []
			}
		];

		await upsertDBWithExpenseCategories(categories);

		expect(ExpenseSubcategory.findOneAndUpdate).not.toHaveBeenCalled();
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

	test('Should upsert multiple categories with correct arguments for each', async () => {
		const mockSubcategoryId1 = 'subcategory-id-food-restaurant';
		const mockSubcategoryId2 = 'subcategory-id-transport-fuel';

		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({ _id: mockSubcategoryId1 })
			.mockResolvedValueOnce({ _id: mockSubcategoryId2 });

		const categories: ExpenseCategoryInput[] = [
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

		// Verify first category with its subcategory
		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenNthCalledWith(
			1,
			{ inmutableKey: 'food' },
			{
				name: 'Food',
				inmutableKey: 'food',
				subcategories: [mockSubcategoryId1],
				emojis: ['🍕'],
				categoryType: 'expense'
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		// Verify second category with its subcategory
		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenNthCalledWith(
			2,
			{ inmutableKey: 'transport' },
			{
				name: 'Transport',
				inmutableKey: 'transport',
				subcategories: [mockSubcategoryId2],
				emojis: ['🚗'],
				categoryType: 'expense'
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenCalledTimes(2);
		expect(ExpenseSubcategory.findOneAndUpdate).toHaveBeenCalledTimes(2);
	});

	test('Should handle multiple subcategories per category', async () => {
		const mockSubcategoryIds = ['sub-id-1', 'sub-id-2', 'sub-id-3'];

		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>)
			.mockResolvedValueOnce({ _id: mockSubcategoryIds[0] })
			.mockResolvedValueOnce({ _id: mockSubcategoryIds[1] })
			.mockResolvedValueOnce({ _id: mockSubcategoryIds[2] });

		const categories: ExpenseCategoryInput[] = [
			{
				name: 'Food',
				inmutableKey: 'food',
				emojis: ['🍕'],
				categoryType: 'expense',
				subcategories: [
					{ name: 'Restaurant', inmutableKey: 'restaurant', emojis: ['🍽️'] },
					{ name: 'Groceries', inmutableKey: 'groceries', emojis: ['🛒'] },
					{ name: 'Delivery', inmutableKey: 'delivery', emojis: ['🚚'] }
				]
			}
		];

		await upsertDBWithExpenseCategories(categories);

		// Verify all subcategories were upserted
		expect(ExpenseSubcategory.findOneAndUpdate).toHaveBeenCalledTimes(3);

		// Verify category was upserted with all subcategory IDs
		expect(ExpenseCategory.findOneAndUpdate).toHaveBeenCalledWith(
			{ inmutableKey: 'food' },
			{
				name: 'Food',
				inmutableKey: 'food',
				subcategories: mockSubcategoryIds,
				emojis: ['🍕'],
				categoryType: 'expense'
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);
	});

	test('Should propagate errors from subcategory upsert', async () => {
		const error = new Error('Database connection failed');
		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockRejectedValue(error);

		const categories: ExpenseCategoryInput[] = [
			{
				name: 'Food',
				inmutableKey: 'food',
				emojis: ['🍕'],
				categoryType: 'expense',
				subcategories: [{ name: 'Restaurant', inmutableKey: 'restaurant', emojis: ['🍽️'] }]
			}
		];

		await expect(upsertDBWithExpenseCategories(categories)).rejects.toThrow('Database connection failed');
		expect(ExpenseCategory.findOneAndUpdate).not.toHaveBeenCalled();
	});

	test('Should propagate errors from category upsert', async () => {
		const mockSubcategoryId = 'sub-id-1';
		(ExpenseSubcategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockResolvedValue({ _id: mockSubcategoryId });

		const error = new Error('Category update failed');
		(ExpenseCategory.findOneAndUpdate as ReturnType<typeof vi.fn>).mockRejectedValue(error);

		const categories: ExpenseCategoryInput[] = [
			{
				name: 'Food',
				inmutableKey: 'food',
				emojis: ['🍕'],
				categoryType: 'expense',
				subcategories: [{ name: 'Restaurant', inmutableKey: 'restaurant', emojis: ['🍽️'] }]
			}
		];

		await expect(upsertDBWithExpenseCategories(categories)).rejects.toThrow('Category update failed');
	});
});


import { describe, expect, test, beforeEach, vi } from 'vitest';
import { Query, Mutation } from '#/gql/resolvers/expenses.js';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';
import * as models from '#/data/models/index.js';
import { CategoryType } from '#/data/CategoryType.js';

const mockExpense = {
	_id: 'expense-id-1',
	uuid: 'expense-uuid-1',
	user_id: 'user-id-1',
	category: 'category-id-1',
	subcategory: 'subcategory-id-1',
	quantity: 50.00,
	date: '2024-01-15',
	currencyISO: 'EUR'
};

const mockJwtPayload: JwtTokenPayload = {
	email: 'test@example.com',
	isAdmin: false,
	isActive: true,
	uuid: 'user-uuid-1',
	registrationDate: '2024-01-01T00:00:00.000Z'
};

const mockUser = {
	_id: 'user-id-1',
	uuid: 'user-uuid-1',
	email: 'test@example.com'
};

vi.mock('#/data/models/index.js', () => {
	const Expenses = vi.fn(() => ({
		save: vi.fn()
	}));

	Object.assign(Expenses, {
		find: vi.fn(() => ({
			sort: vi.fn().mockReturnThis(),
			skip: vi.fn().mockReturnThis(),
			limit: vi.fn().mockReturnThis(),
			lean: vi.fn()
		})),
		countDocuments: vi.fn(),
		aggregate: vi.fn(),
		deleteMany: vi.fn(),
		findOneAndDelete: vi.fn()
	});

	return {
		Expenses,
		ExpenseCategory: {
			collection: {
				name: 'expensecategories'
			}
		}
	};
});

const createMockContext = (): Context => ({
	user: mockJwtPayload,
	di: {
		model: models as unknown as Context['di']['model'],
		jwt: {
			createAuthToken: vi.fn(() => 'mock-token')
		},
		authValidation: {
			ensureLimitOfUsersIsNotReached: vi.fn(),
			ensureThatUserIsLogged: vi.fn(),
			getUser: vi.fn().mockResolvedValue(mockUser),
			ensureThatUserIsAdministrator: vi.fn()
		},
		rateLimitValidation: {
			ensureLoginRateLimitNotExceeded: vi.fn(),
			ensureRegisterRateLimitNotExceeded: vi.fn()
		},
		pagingValidation: {
			ensurePageValueIsValid: vi.fn(),
			ensurePageSizeValueIsValid: vi.fn()
		},
		datetimeValidation: {
			ensureDateIsValid: vi.fn(),
			ensureStartDateIsEarlierThanEndDate: vi.fn()
		},
		parameterValidations: {
			isValidEnumValue: vi.fn(),
			isIntegerBetween: vi.fn()
		}
	}
});

describe('expenses resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Query.getExpenses', () => {
		test('Should check authentication', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnValueOnce({
					lean: vi.fn().mockResolvedValueOnce([])
				})
			});

			await Query.getExpenses({}, {}, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should return expenses sorted by date ascending', async () => {
			const context = createMockContext();
			const mockExpenses = [mockExpense];
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnValueOnce({
					lean: vi.fn().mockResolvedValueOnce(mockExpenses)
				})
			});

			const result = await Query.getExpenses({}, {}, context);

			expect(result).toHaveLength(1);
			expect(result[0]).toHaveProperty('uuid', 'expense-uuid-1');
		});

		test('Should return empty array when no expenses exist', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnValueOnce({
					lean: vi.fn().mockResolvedValueOnce([])
				})
			});

			const result = await Query.getExpenses({}, {}, context);

			expect(result).toEqual([]);
		});
	});

	describe('Query.getExpensesWithPagination', () => {
		test('Should validate page and pageSize', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnThis(),
				skip: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis(),
				lean: vi.fn().mockResolvedValueOnce([])
			});
			(models.Expenses.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValueOnce(0);

			await Query.getExpensesWithPagination({}, { page: 1, pageSize: 10 }, context);

			expect(context.di.pagingValidation.ensurePageValueIsValid).toHaveBeenCalledWith(1);
			expect(context.di.pagingValidation.ensurePageSizeValueIsValid).toHaveBeenCalledWith(10);
		});

		test('Should return paginated expenses', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnThis(),
				skip: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis(),
				lean: vi.fn().mockResolvedValueOnce([mockExpense])
			});
			(models.Expenses.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValueOnce(1);

			const result = await Query.getExpensesWithPagination({}, { page: 1, pageSize: 10 }, context);

			expect(result.expenses).toHaveLength(1);
			expect(result.pagination).toBeDefined();
		});

		test('Should filter expenses by user_id', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnThis(),
				skip: vi.fn().mockReturnThis(),
				limit: vi.fn().mockReturnThis(),
				lean: vi.fn().mockResolvedValueOnce([])
			});
			(models.Expenses.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValueOnce(0);

			await Query.getExpensesWithPagination({}, { page: 1, pageSize: 10 }, context);

			expect(models.Expenses.countDocuments).toHaveBeenCalledWith({ user_id: 'user-id-1' });
		});
	});

	describe('Query.getExpensesBetweenDates', () => {
		test('Should validate dates', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnValueOnce({
					lean: vi.fn().mockResolvedValueOnce([])
				})
			});

			await Query.getExpensesBetweenDates({}, { startDate: '2024-01-01', endDate: '2024-12-31' }, context);

			expect(context.di.datetimeValidation.ensureDateIsValid).toHaveBeenCalledWith('2024-01-01');
			expect(context.di.datetimeValidation.ensureDateIsValid).toHaveBeenCalledWith('2024-12-31');
			expect(context.di.datetimeValidation.ensureStartDateIsEarlierThanEndDate).toHaveBeenCalledWith('2024-01-01', '2024-12-31');
		});

		test('Should return expenses within date range', async () => {
			const context = createMockContext();
			(models.Expenses.find as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				sort: vi.fn().mockReturnValueOnce({
					lean: vi.fn().mockResolvedValueOnce([mockExpense])
				})
			});

			const result = await Query.getExpensesBetweenDates({}, { startDate: '2024-01-01', endDate: '2024-12-31' }, context);

			expect(result).toHaveLength(1);
			expect(models.Expenses.find).toHaveBeenCalledWith({
				user_id: 'user-id-1',
				date: { $gte: '2024-01-01', $lt: '2024-12-31' }
			});
		});
	});

	describe('Query.getExpensesSumByType', () => {
		test('Should check authentication', async () => {
			const context = createMockContext();
			(models.Expenses.aggregate as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

			await Query.getExpensesSumByType({}, { categoryType: CategoryType.EXPENSE }, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should return zero sum when no expenses exist', async () => {
			const context = createMockContext();
			(models.Expenses.aggregate as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

			const result = await Query.getExpensesSumByType({}, { categoryType: CategoryType.EXPENSE }, context);

			expect(result).toHaveProperty('categoryType', 'expense');
			expect(result).toHaveProperty('currencyISO', 'EUR');
			expect(result).toHaveProperty('sum', 0);
		});

		test('Should return aggregated sum when expenses exist', async () => {
			const context = createMockContext();
			(models.Expenses.aggregate as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
				{ currencyISO: 'EUR', sum: 150.50 }
			]);

			const result = await Query.getExpensesSumByType({}, { categoryType: CategoryType.EXPENSE }, context);

			expect(result).toHaveProperty('categoryType', 'expense');
			expect(result).toHaveProperty('currencyISO', 'EUR');
			expect(result).toHaveProperty('sum', 150.50);
		});
	});

	describe('Query.getExpensesMonthlyAverage', () => {
		test('Should validate lastNMonths parameter', async () => {
			const context = createMockContext();
			(models.Expenses.aggregate as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

			await Query.getExpensesMonthlyAverage({}, { lastNMonths: 6 }, context);

			expect(context.di.parameterValidations.isIntegerBetween).toHaveBeenCalledWith(6, 1, 240);
		});

		test('Should return average when expenses exist', async () => {
			const context = createMockContext();
			(models.Expenses.aggregate as ReturnType<typeof vi.fn>).mockResolvedValueOnce([
				{ totalSum: 600 }
			]);

			const result = await Query.getExpensesMonthlyAverage({}, { lastNMonths: 6 }, context);

			expect(result).toHaveProperty('average', 100);
			expect(result).toHaveProperty('currencyISO', 'EUR');
		});

		test('Should return zero average when no expenses exist', async () => {
			const context = createMockContext();
			(models.Expenses.aggregate as ReturnType<typeof vi.fn>).mockResolvedValueOnce([]);

			const result = await Query.getExpensesMonthlyAverage({}, { lastNMonths: 3 }, context);

			expect(result).toHaveProperty('average', 0);
		});
	});

	describe('Mutation.registerExpense', () => {
		test('Should check authentication', async () => {
			const context = createMockContext();
			const mockSave = vi.fn().mockResolvedValue(mockExpense);
			(models.Expenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({ save: mockSave }));

			await Mutation.registerExpense({}, { category: 'cat-1', quantity: 50, date: '2024-01-15' }, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should validate date', async () => {
			const context = createMockContext();
			const mockSave = vi.fn().mockResolvedValue(mockExpense);
			(models.Expenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({ save: mockSave }));

			await Mutation.registerExpense({}, { category: 'cat-1', quantity: 50, date: '2024-01-15' }, context);

			expect(context.di.datetimeValidation.ensureDateIsValid).toHaveBeenCalledWith('2024-01-15');
		});

		test('Should create expense with user_id', async () => {
			const context = createMockContext();
			const mockSave = vi.fn().mockResolvedValue(mockExpense);
			(models.Expenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({ save: mockSave }));

			await Mutation.registerExpense({}, { category: 'cat-1', quantity: 50, date: '2024-01-15' }, context);

			expect(models.Expenses).toHaveBeenCalledWith({
				user_id: 'user-id-1',
				category: 'cat-1',
				quantity: 50,
				date: '2024-01-15'
			});
		});

		test('Should return created expense', async () => {
			const context = createMockContext();
			const mockSave = vi.fn().mockResolvedValue(mockExpense);
			(models.Expenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({ save: mockSave }));

			const result = await Mutation.registerExpense({}, { category: 'cat-1', quantity: 50, date: '2024-01-15' }, context);

			expect(result).toHaveProperty('uuid', 'expense-uuid-1');
		});

		test('Should allow optional subcategory', async () => {
			const context = createMockContext();
			const mockSave = vi.fn().mockResolvedValue(mockExpense);
			(models.Expenses as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => ({ save: mockSave }));

			await Mutation.registerExpense({}, { category: 'cat-1', subcategory: 'sub-1', quantity: 50, date: '2024-01-15' }, context);

			expect(models.Expenses).toHaveBeenCalledWith({
				user_id: 'user-id-1',
				category: 'cat-1',
				subcategory: 'sub-1',
				quantity: 50,
				date: '2024-01-15'
			});
		});
	});

	describe('Mutation.deleteExpense', () => {
		test('Should check authentication', async () => {
			const context = createMockContext();
			(models.Expenses.findOneAndDelete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

			await Mutation.deleteExpense({}, { uuid: 'expense-uuid-1' }, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should delete expense by uuid and user_id', async () => {
			const context = createMockContext();
			(models.Expenses.findOneAndDelete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockExpense);

			await Mutation.deleteExpense({}, { uuid: 'expense-uuid-1' }, context);

			expect(models.Expenses.findOneAndDelete).toHaveBeenCalledWith({
				uuid: 'expense-uuid-1',
				user_id: 'user-id-1'
			});
		});

		test('Should return deleted expense', async () => {
			const context = createMockContext();
			(models.Expenses.findOneAndDelete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockExpense);

			const result = await Mutation.deleteExpense({}, { uuid: 'expense-uuid-1' }, context);

			expect(result).toHaveProperty('uuid', 'expense-uuid-1');
		});

		test('Should return null when expense not found', async () => {
			const context = createMockContext();
			(models.Expenses.findOneAndDelete as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null);

			const result = await Mutation.deleteExpense({}, { uuid: 'nonexistent-uuid' }, context);

			expect(result).toBeNull();
		});
	});

	describe('Mutation.deleteAllExpenses', () => {
		test('Should check authentication', async () => {
			const context = createMockContext();
			(models.Expenses.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ deletedCount: 5 });

			await Mutation.deleteAllExpenses({}, {}, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should delete all expenses for user', async () => {
			const context = createMockContext();
			(models.Expenses.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ deletedCount: 5 });

			await Mutation.deleteAllExpenses({}, {}, context);

			expect(models.Expenses.deleteMany).toHaveBeenCalledWith({ user_id: 'user-id-1' });
		});

		test('Should return delete result', async () => {
			const context = createMockContext();
			const mockResult = { deletedCount: 5 };
			(models.Expenses.deleteMany as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResult);

			const result = await Mutation.deleteAllExpenses({}, {}, context);

			expect(result).toEqual(mockResult);
		});
	});
});

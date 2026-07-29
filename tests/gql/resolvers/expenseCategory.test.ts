import { Types } from 'mongoose';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import { Query } from '#/gql/resolvers/expenseCategory.js';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';
import * as models from '#/data/models/index.js';
import { UserInputError } from '#/gql/errors.js';

const mockCategory = {
	_id: 'category-id-1',
	name: 'Private vehicles',
	subcategories: [],
	emojis: ['🚗'],
	uuid: 'category-uuid-1',
	categoryType: 'expense'
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

vi.mock('#/data/models/index.js', () => ({
	ExpenseCategory: {
		findOne: vi.fn(),
		find: vi.fn()
	},
	ExpenseSubcategory: {
		find: vi.fn()
	},
	Expenses: {
		aggregate: vi.fn()
	}
}));

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
			ensureStartDateIsEarlierThanEndDate: vi.fn(),
			ensureStartDateIsNotLaterThanEndDate: vi.fn()
		},
		parameterValidations: {
			isValidEnumValue: vi.fn(),
			isIntegerBetween: vi.fn(),
			isValidObjectId: vi.fn(),
			isNumberGreaterThanOrEqualToZero: vi.fn(),
			isMinNotGreaterThanMax: vi.fn()
		}
	}
});

const mockFindOneChain = (result: unknown) => {
	(models.ExpenseCategory.findOne as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
		sort: vi.fn().mockReturnThis(),
		populate: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValueOnce(result)
	});
};

describe('expenseCategory resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Query.getExpenseCategoryById', () => {
		test('Should check authentication', async () => {
			const context = createMockContext();
			mockFindOneChain(mockCategory);

			await Query.getExpenseCategoryById({}, { category: 'category-id-1' }, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should validate the category identifier', async () => {
			const context = createMockContext();
			mockFindOneChain(mockCategory);

			await Query.getExpenseCategoryById({}, { category: 'category-id-1' }, context);

			expect(context.di.parameterValidations.isValidObjectId).toHaveBeenCalledWith('category-id-1');
		});

		test('Should not query the database when the identifier is invalid', async () => {
			const context = createMockContext();
			(context.di.parameterValidations.isValidObjectId as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new UserInputError('The identifier provided is not valid');
			});

			await expect(Query.getExpenseCategoryById({}, { category: 'nope' }, context)).rejects.toThrow(UserInputError);

			expect(models.ExpenseCategory.findOne).not.toHaveBeenCalled();
		});

		test('Should return the category when the identifier is valid', async () => {
			const context = createMockContext();
			mockFindOneChain(mockCategory);

			const result = await Query.getExpenseCategoryById({}, { category: 'category-id-1' }, context);

			expect(models.ExpenseCategory.findOne).toHaveBeenCalledWith({ _id: 'category-id-1' });
			expect(result).toHaveProperty('uuid', 'category-uuid-1');
		});
	});
});

describe('getMostUsedExpenseCategories', () => {
	const categoryId = new Types.ObjectId();
	const subcategoryId = new Types.ObjectId();

	const mockUsage = (groups: unknown[]) => {
		(models.Expenses.aggregate as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(groups);
	};

	const mockCatalogue = (categories: unknown[], subcategories: unknown[]) => {
		(models.ExpenseCategory.find as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
			select: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValueOnce(categories)
		});
		(models.ExpenseSubcategory.find as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
			select: vi.fn().mockReturnThis(),
			lean: vi.fn().mockResolvedValueOnce(subcategories)
		});
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	test('Should return the used categories resolved with their names and emojis', async () => {
		mockUsage([{ _id: { category: categoryId, subcategory: subcategoryId }, total: 7 }]);
		mockCatalogue(
			[{ _id: categoryId, name: 'Private vehicles', emojis: ['🚙'] }],
			[{ _id: subcategoryId, name: 'Fuel', emojis: ['⛽️'] }]
		);

		const result = await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, createMockContext());

		expect(result).toStrictEqual([{
			category: categoryId,
			categoryName: 'Private vehicles',
			categoryEmojis: ['🚙'],
			subcategory: subcategoryId,
			subcategoryName: 'Fuel',
			subcategoryEmojis: ['⛽️'],
			total: 7
		}]);
	});

	test('Should require an authenticated user before touching the database', async () => {
		const context = createMockContext();
		mockUsage([]);

		await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, context);

		expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
	});

	test('Should validate both arguments as integers within their range', async () => {
		const context = createMockContext();
		mockUsage([]);

		await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, context);

		expect(context.di.parameterValidations.isIntegerBetween).toHaveBeenCalledWith(90, 1, 365);
		expect(context.di.parameterValidations.isIntegerBetween).toHaveBeenCalledWith(6, 1, 20);
	});

	test('Should scope the aggregation to the user and to the requested period', async () => {
		mockUsage([]);

		await Query.getMostUsedExpenseCategories(null, { days: 30, limit: 6 }, createMockContext());

		const pipeline = (models.Expenses.aggregate as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];

		expect(pipeline[0].$match.user_id).toBe('user-id-1');
		expect(pipeline[0].$match.date.$gte).toBeInstanceOf(Date);
		expect(pipeline[3].$limit).toBe(6);
	});

	test('Should return an empty list when the user has no expenses in the period', async () => {
		mockUsage([]);

		const result = await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, createMockContext());

		expect(result).toStrictEqual([]);
		expect(models.ExpenseCategory.find).not.toHaveBeenCalled();
	});

	test('Should drop entries whose category no longer exists', async () => {
		mockUsage([{ _id: { category: categoryId, subcategory: null }, total: 4 }]);
		mockCatalogue([], []);

		const result = await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, createMockContext());

		expect(result).toStrictEqual([]);
	});

	test('Should resolve an entry without subcategory', async () => {
		mockUsage([{ _id: { category: categoryId, subcategory: null }, total: 4 }]);
		mockCatalogue([{ _id: categoryId, name: 'Taxes', emojis: ['🏛'] }], []);

		const result = await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, createMockContext());

		expect(result[0].subcategory).toBeNull();
		expect(result[0].subcategoryName).toBeNull();
	});

	test('Should sort by total count, then by most recent use, with deterministic tie-breaker keys', async () => {
		mockUsage([]);

		await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, createMockContext());

		const pipeline = (models.Expenses.aggregate as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
		const sortStage = pipeline[2].$sort;

		expect(sortStage).toEqual({
			total: -1,
			lastUsed: -1,
			'_id.category': 1,
			'_id.subcategory': 1
		});
	});

	test('Should accumulate lastUsed as the maximum date in each group', async () => {
		mockUsage([]);

		await Query.getMostUsedExpenseCategories(null, { days: 90, limit: 6 }, createMockContext());

		const pipeline = (models.Expenses.aggregate as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];
		const groupStage = pipeline[1].$group;

		expect(groupStage.lastUsed).toEqual({ $max: '$date' });
	});
});

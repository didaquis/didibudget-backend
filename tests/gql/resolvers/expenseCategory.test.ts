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
		findOne: vi.fn()
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

import { describe, expect, test, beforeEach, vi } from 'vitest';
import { Mutation } from '#/gql/resolvers/recurringExpenseSuggestion.js';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';
import * as models from '#/data/models/index.js';
import { UserInputError } from '#/gql/errors.js';

const mockPopulatedSuggestion = {
	isActive: true,
	startDay: 1,
	endDay: 5,
	uuid: 'suggestion-uuid-1',
	suggestedExpense: {
		category: { _id: 'category-id-1', name: 'Housing', emojis: ['🏠'] },
		subcategory: { _id: 'subcategory-id-1', name: 'Electricity bill', emojis: ['💡'] },
		quantity: 50
	}
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
	RecurringExpenseSuggestion: {
		create: vi.fn(),
		findById: vi.fn()
	},
	ExpenseCategory: {},
	ExpenseSubcategory: {}
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
			ensureStartDateIsEarlierThanEndDate: vi.fn()
		},
		parameterValidations: {
			isValidEnumValue: vi.fn(),
			isIntegerBetween: vi.fn(),
			isValidObjectId: vi.fn()
		}
	}
});

const mockSuccessfulSave = () => {
	(models.RecurringExpenseSuggestion.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ _id: 'suggestion-id-1' });
	(models.RecurringExpenseSuggestion.findById as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce({
		populate: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValueOnce(mockPopulatedSuggestion)
	});
};

const validArgs = {
	isActive: true,
	startDay: 1,
	endDay: 5,
	suggestedExpense: {
		category: 'category-id-1',
		subcategory: 'subcategory-id-1',
		quantity: 50
	}
};

describe('recurringExpenseSuggestion resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Mutation.registerRecurringExpenseSuggestion', () => {
		test('Should validate the category identifier', async () => {
			const context = createMockContext();
			mockSuccessfulSave();

			await Mutation.registerRecurringExpenseSuggestion({}, validArgs, context);

			expect(context.di.parameterValidations.isValidObjectId).toHaveBeenCalledWith('category-id-1');
		});

		test('Should validate the subcategory identifier when it is provided', async () => {
			const context = createMockContext();
			mockSuccessfulSave();

			await Mutation.registerRecurringExpenseSuggestion({}, validArgs, context);

			expect(context.di.parameterValidations.isValidObjectId).toHaveBeenCalledWith('subcategory-id-1');
		});

		test('Should not validate the subcategory identifier when it is omitted', async () => {
			const context = createMockContext();
			mockSuccessfulSave();

			await Mutation.registerRecurringExpenseSuggestion({}, {
				...validArgs,
				suggestedExpense: { category: 'category-id-1', quantity: 50 }
			}, context);

			expect(context.di.parameterValidations.isValidObjectId).toHaveBeenCalledTimes(1);
		});

		test('Should not create the suggestion when the identifier is invalid', async () => {
			const context = createMockContext();
			(context.di.parameterValidations.isValidObjectId as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new UserInputError('The identifier provided is not valid');
			});

			await expect(Mutation.registerRecurringExpenseSuggestion({}, {
				...validArgs,
				suggestedExpense: { category: 'nope', quantity: 50 }
			}, context)).rejects.toThrow(UserInputError);

			expect(models.RecurringExpenseSuggestion.create).not.toHaveBeenCalled();
		});
	});
});

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mongo } from 'mongoose';
import { Mutation } from '#/gql/resolvers/monthlyBalance.js';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';
import * as models from '#/data/models/index.js';
import { Month, MonthValue } from '#/data/Month.js';
import { AuthenticationError, UserInputError } from '#/gql/errors.js';

interface StoredBalance {
	user_id: string;
	balance: number;
	year: number;
	month: number;
	date: Date;
	currencyISO: string;
	uuid: string;
}

// In-memory stand-in for the monthlybalances collection
const db = vi.hoisted(() => ({ balances: [] as StoredBalance[], nextUuid: 1 }));

vi.mock('#/data/models/index.js', () => {
	const MonthlyBalance = vi.fn(function (doc: Omit<StoredBalance, 'currencyISO' | 'uuid'>) {
		return {
			save: vi.fn(async () => {
				const saved = { ...doc, currencyISO: 'EUR', uuid: `balance-uuid-${db.nextUuid++}` };
				db.balances.push(saved);
				return saved;
			})
		};
	});

	Object.assign(MonthlyBalance, {
		findOne: vi.fn((filter: { user_id: string; year: number; month: number }) => ({
			lean: vi.fn(async () => db.balances.find((stored) => stored.user_id === filter.user_id && stored.year === filter.year && stored.month === filter.month) ?? null)
		})),
		findOneAndDelete: vi.fn(async (filter: { uuid: string; user_id: string }) => {
			const index = db.balances.findIndex((stored) => stored.uuid === filter.uuid && stored.user_id === filter.user_id);
			return index === -1 ? null : db.balances.splice(index, 1)[0];
		})
	});

	return { MonthlyBalance };
});

const mockJwtPayload: JwtTokenPayload = {
	email: 'first@example.com',
	isAdmin: false,
	isActive: true,
	uuid: 'user-uuid-1',
	registrationDate: '2024-01-01T00:00:00.000Z'
};

const firstUser = { _id: 'user-id-1', uuid: 'user-uuid-1', email: 'first@example.com' };
const secondUser = { _id: 'user-id-2', uuid: 'user-uuid-2', email: 'second@example.com' };

const createMockContext = (user = firstUser): Context => ({
	user: mockJwtPayload,
	di: {
		model: models as unknown as Context['di']['model'],
		jwt: {
			createAuthToken: vi.fn(() => 'mock-token')
		},
		authValidation: {
			ensureLimitOfUsersIsNotReached: vi.fn(),
			ensureThatUserIsLogged: vi.fn(),
			getUser: vi.fn().mockResolvedValue(user),
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

const register = (context: Context, year = 2026, month: MonthValue = Month.JANUARY, balance = 1234.56) => {
	return Mutation.registerMonthlyBalance({}, { balance, year, month }, context);
};

const duplicateKeyError = (keyPattern: Record<string, number>) => {
	return new mongo.MongoServerError({ message: 'E11000 duplicate key error collection: monthlybalances', code: 11000, keyPattern });
};

const failNextSaveWith = (error: Error) => {
	(models.MonthlyBalance as unknown as ReturnType<typeof vi.fn>).mockImplementationOnce(function () {
		return { save: vi.fn().mockRejectedValue(error) };
	});
};

const expectDuplicatedMonthError = async (promise: Promise<unknown>, monthLabel: string) => {
	const error = await promise.catch((caught: unknown) => caught);

	expect(error).toBeInstanceOf(UserInputError);
	expect(error).toHaveProperty('message', `A monthly balance already exists for ${monthLabel}`);
	expect(error).toHaveProperty('extensions.code', 'BAD_USER_INPUT');
};

describe('monthlyBalance resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		db.balances.length = 0;
		db.nextUuid = 1;
	});

	describe('Mutation.registerMonthlyBalance', () => {
		test('Should register a balance for a free month', async () => {
			const result = await register(createMockContext());

			expect(result).toMatchObject({ balance: '1234.56', currencyISO: 'EUR' });
			expect(models.MonthlyBalance).toHaveBeenCalledWith({
				user_id: 'user-id-1',
				balance: 1234.56,
				year: 2026,
				month: 1,
				date: new Date('2026-01-01T12:00:00.000Z')
			});
		});

		test('Should reject a second balance for the same user and month without saving it', async () => {
			const context = createMockContext();
			await register(context);

			await expectDuplicatedMonthError(register(context, 2026, Month.JANUARY, 999), 'January 2026');

			expect(models.MonthlyBalance).toHaveBeenCalledTimes(1);
			expect(db.balances).toHaveLength(1);
		});

		test('Should allow two users to have a balance for the same month', async () => {
			await register(createMockContext(firstUser));
			await register(createMockContext(secondUser));

			expect(db.balances.map((stored) => stored.user_id)).toEqual(['user-id-1', 'user-id-2']);
		});

		test('Should allow the same user to have balances for different months', async () => {
			const context = createMockContext();

			await register(context, 2026, Month.JANUARY);
			await register(context, 2026, Month.FEBRUARY);
			await register(context, 2025, Month.JANUARY);

			expect(db.balances.map((stored) => [stored.year, stored.month])).toEqual([[2026, 1], [2026, 2], [2025, 1]]);
		});

		test('Should allow registering a month again after deleting it', async () => {
			const context = createMockContext();
			const first = await register(context);

			await Mutation.deleteMonthlyBalance({}, { uuid: first.uuid }, context);
			const second = await register(context, 2026, Month.JANUARY, 999);

			expect(second).toMatchObject({ balance: '999' });
			expect(db.balances).toHaveLength(1);
		});

		test('Should turn a duplicate key error on the month index into the same user input error', async () => {
			failNextSaveWith(duplicateKeyError({ user_id: 1, year: 1, month: 1 }));

			await expectDuplicatedMonthError(register(createMockContext(), 2025, Month.DECEMBER), 'December 2025');
		});

		test('Should not hide duplicate key errors from other indexes', async () => {
			const error = duplicateKeyError({ uuid: 1 });
			failNextSaveWith(error);

			await expect(register(createMockContext())).rejects.toBe(error);
		});

		test('Should check authentication before touching the database', async () => {
			const context = createMockContext();
			(context.di.authValidation.ensureThatUserIsLogged as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new AuthenticationError('User is not logged');
			});

			await expect(register(context)).rejects.toThrow(AuthenticationError);

			expect(models.MonthlyBalance.findOne).not.toHaveBeenCalled();
			expect(models.MonthlyBalance).not.toHaveBeenCalled();
		});

		test('Should reject a year out of range before touching the database', async () => {
			const context = createMockContext();
			(context.di.parameterValidations.isIntegerBetween as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new UserInputError('The value provided should be an integer between 1970 and 2100');
			});

			await expect(register(context, 1900)).rejects.toThrow(UserInputError);

			expect(context.di.parameterValidations.isIntegerBetween).toHaveBeenCalledWith(1900, 1970, 2100);
			expect(models.MonthlyBalance.findOne).not.toHaveBeenCalled();
		});
	});
});

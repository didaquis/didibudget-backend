import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mongo } from 'mongoose';
import { Mutation, Query } from '#/gql/resolvers/monthlyBalance.js';
import type { Context } from '#/gql/auth/setContext.js';
import * as models from '#/data/models/index.js';
import { Month, MonthValue } from '#/data/Month.js';
import { AuthenticationError, UserInputError } from '#/gql/errors.js';
import { createMockContext, mockUser } from '../../mocks/createMockContext.js';

interface StoredBalance {
	user_id: string;
	balance: number;
	year: number;
	month: number;
	currencyISO: string;
	uuid: string;
}

// In-memory stand-in for the monthlybalances collection, including its unique index { user_id, year, month }
const db = vi.hoisted(() => ({ balances: [] as StoredBalance[], nextUuid: 1 }));

vi.mock('#/data/models/index.js', async () => {
	const { mongo } = await import('mongoose');

	const MonthlyBalance = vi.fn(function (doc: Omit<StoredBalance, 'currencyISO' | 'uuid'>) {
		return {
			save: vi.fn(async () => {
				const isRepeatedMonth = db.balances.some((stored) => stored.user_id === doc.user_id && stored.year === doc.year && stored.month === doc.month);
				if (isRepeatedMonth) {
					throw new mongo.MongoServerError({ message: 'E11000 duplicate key error collection: monthlybalances', code: 11000, keyPattern: { user_id: 1, year: 1, month: 1 } });
				}

				const saved = { ...doc, currencyISO: 'EUR', uuid: `balance-uuid-${db.nextUuid++}` };
				db.balances.push(saved);
				return saved;
			})
		};
	});

	Object.assign(MonthlyBalance, {
		findOneAndDelete: vi.fn(async (filter: { uuid: string; user_id: string }) => {
			const index = db.balances.findIndex((stored) => stored.uuid === filter.uuid && stored.user_id === filter.user_id);
			return index === -1 ? null : db.balances.splice(index, 1)[0];
		}),
		find: vi.fn(),
		countDocuments: vi.fn()
	});

	return { MonthlyBalance };
});

const firstUser = mockUser;
const secondUser = { _id: 'user-id-2', uuid: 'user-uuid-2', email: 'second@example.com' };

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

const mockFindChain = () => {
	const chain = {
		sort: vi.fn().mockReturnThis(),
		skip: vi.fn().mockReturnThis(),
		limit: vi.fn().mockReturnThis(),
		lean: vi.fn().mockResolvedValue([])
	};
	(models.MonthlyBalance.find as ReturnType<typeof vi.fn>).mockReturnValueOnce(chain);

	return chain;
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
				month: 1
			});
		});

		test('Should reject a second balance for the same user and month', async () => {
			const context = createMockContext();
			await register(context);

			await expectDuplicatedMonthError(register(context, 2026, Month.JANUARY, 999), 'January 2026');

			expect(db.balances).toHaveLength(1);
			expect(db.balances[0].balance).toBe(1234.56);
		});

		test('Should allow two users to have a balance for the same month', async () => {
			await register(createMockContext({ user: firstUser }));
			await register(createMockContext({ user: secondUser }));

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

			expect(models.MonthlyBalance).not.toHaveBeenCalled();
		});

		test('Should reject a year out of range before touching the database', async () => {
			const context = createMockContext();
			(context.di.parameterValidations.isIntegerBetween as ReturnType<typeof vi.fn>).mockImplementation(() => {
				throw new UserInputError('The value provided should be an integer between 2000 and 2250');
			});

			await expect(register(context, 1900)).rejects.toThrow(UserInputError);

			expect(context.di.parameterValidations.isIntegerBetween).toHaveBeenCalledWith(1900, 2000, 2250);
			expect(models.MonthlyBalance).not.toHaveBeenCalled();
		});

		test('Should return the year and the month name of the registered balance', async () => {
			const result = await register(createMockContext(), 2025, Month.DECEMBER);

			expect(result).toMatchObject({ year: 2025, month: 'DECEMBER' });
		});
	});

	describe('Query.getMonthlyBalances', () => {
		test('Should sort the balances of the user by year and then by month, oldest first', async () => {
			const chain = mockFindChain();

			await Query.getMonthlyBalances({}, {}, createMockContext());

			expect(models.MonthlyBalance.find).toHaveBeenCalledWith({ user_id: 'user-id-1' });
			expect(Object.entries(chain.sort.mock.calls[0][0])).toEqual([['year', 'asc'], ['month', 'asc']]);
		});
	});

	describe('Query.getMonthlyBalancesWithPagination', () => {
		test('Should sort the balances of the user by year and then by month, newest first', async () => {
			const chain = mockFindChain();
			(models.MonthlyBalance.countDocuments as ReturnType<typeof vi.fn>).mockResolvedValueOnce(0);

			await Query.getMonthlyBalancesWithPagination({}, { page: 1, pageSize: 10 }, createMockContext());

			expect(models.MonthlyBalance.find).toHaveBeenCalledWith({ user_id: 'user-id-1' });
			expect(Object.entries(chain.sort.mock.calls[0][0])).toEqual([['year', 'desc'], ['month', 'desc']]);
		});
	});
});

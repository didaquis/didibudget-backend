import { DeleteResult, mongo, SortValues } from 'mongoose';

import { MonthValue } from '#/data/Month.js';
import { monthlyBalanceDTO, MonthlyBalanceDTO } from '#/dto/monthlyBalanceDTO.js';
import { paginationDTO, PaginationDTO } from '#/dto/paginationDTO.js';
import { formatMonth, getMonthNumber, getTransitionalDate, MAX_YEAR, MIN_YEAR } from '#/helpers/monthlyBalanceMonth.js';
import { getOffset, getTotalPagesNumber } from '#/helpers/pagingUtilities.js';
import { UserInputError } from '#/gql/errors.js';
import { Context } from '../auth/setContext.js';

interface GetMonthlyBalancesWithPaginationArgs {
	page: number;
	pageSize: number;
}

interface RegisterMonthlyBalanceArgs {
	balance: number;
	year: number;
	month: MonthValue;
}

interface DeleteMonthlyBalanceArgs {
	uuid: string;
}

const MONGO_DUPLICATE_KEY_ERROR_CODE = 11000;

const duplicatedMonthError = (year: number, monthNumber: number): UserInputError => {
	return new UserInputError(`A monthly balance already exists for ${formatMonth(year, monthNumber)}`);
};

/**
 * `uuid` has a unique index too, so the error code alone does not mean a repeated month
 */
const isDuplicatedMonthError = (error: unknown): boolean => {
	return error instanceof mongo.MongoServerError && error.code === MONGO_DUPLICATE_KEY_ERROR_CODE && error.keyPattern?.month !== undefined;
};

/**
 * All resolvers related to monthly balances
 */
export const Query = {
	/**
	 * Get all monthly balances by user
	 */
	getMonthlyBalances: async (_parent: unknown, _args: unknown, context: Context): Promise<MonthlyBalanceDTO[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		const sortCriteria: Record<string, SortValues> = { year: 'asc', month: 'asc' };
		const allMonthlyBalances = await context.di.model.MonthlyBalance.find({ user_id: user._id }).sort(sortCriteria).lean();

		return allMonthlyBalances.map((monthlyBalance) => monthlyBalanceDTO(monthlyBalance));
	},
	/**
	 * Get monthly balances by user using pagination
	 */
	getMonthlyBalancesWithPagination: async (_parent: unknown, { page, pageSize }: GetMonthlyBalancesWithPaginationArgs, context: Context): Promise<{ monthlyBalances: MonthlyBalanceDTO[]; pagination: PaginationDTO }> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.pagingValidation.ensurePageValueIsValid(page);
		context.di.pagingValidation.ensurePageSizeValueIsValid(pageSize);

		const user = await context.di.authValidation.getUser(context);

		const offset = getOffset(page, pageSize);
		const sortCriteria: Record<string, SortValues> = { year: 'desc', month: 'desc' };

		const getTotalCount = context.di.model.MonthlyBalance.countDocuments({ user_id: user._id });
		const getMonthlyBalances = context.di.model.MonthlyBalance.find({ user_id: user._id }).sort(sortCriteria).skip(offset).limit(pageSize).lean();

		const [totalCount, monthlyBalances] = await Promise.all([getTotalCount, getMonthlyBalances]);

		const totalPages = getTotalPagesNumber(totalCount, pageSize);

		return {
			monthlyBalances: monthlyBalances.map((monthlyBalance) => monthlyBalanceDTO(monthlyBalance)),
			pagination: paginationDTO(page, totalPages, totalCount)
		};
	}
};

export const Mutation = {
	/**
	 * Register a monthly balance. A user can have only one balance per month:
	 * a repeated month is rejected, never overwritten (delete it first to correct it).
	 */
	registerMonthlyBalance: async (_parent: unknown, { balance, year, month }: RegisterMonthlyBalanceArgs, context: Context): Promise<MonthlyBalanceDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.parameterValidations.isIntegerBetween(year, MIN_YEAR, MAX_YEAR);

		const monthNumber = getMonthNumber(month);
		const user = await context.di.authValidation.getUser(context);

		const existingMonthlyBalance = await context.di.model.MonthlyBalance.findOne({ user_id: user._id, year, month: monthNumber }).lean();
		if (existingMonthlyBalance) {
			throw duplicatedMonthError(year, monthNumber);
		}

		try {
			const date = getTransitionalDate(year, monthNumber);
			const monthlyBalance = await new context.di.model.MonthlyBalance({ user_id: user._id, balance, year, month: monthNumber, date }).save();

			return monthlyBalanceDTO(monthlyBalance);
		} catch (error) {
			// Two simultaneous requests can both pass the check above; the unique index stops the second one
			if (isDuplicatedMonthError(error)) {
				throw duplicatedMonthError(year, monthNumber);
			}

			throw error;
		}
	},
	/**
	 * Delete one registry of monthly balance
	 */
	deleteMonthlyBalance: async (_parent: unknown, { uuid }: DeleteMonthlyBalanceArgs, context: Context): Promise<MonthlyBalanceDTO | null> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.MonthlyBalance.findOneAndDelete({ uuid, user_id: user._id })
			.then((monthlyBalance) => monthlyBalance ? monthlyBalanceDTO(monthlyBalance) : null);
	},
	/**
	 * Delete all registries of monthly balance
	 */
	deleteAllMonthlyBalances: async (_parent: unknown, _args: unknown, context: Context): Promise<DeleteResult> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.MonthlyBalance.deleteMany({ user_id: user._id });
	}
};

import { monthlyBalanceDTO, MonthlyBalanceDTO } from '#/dto/monthlyBalanceDTO.js';
import { getOffset, getTotalPagesNumber } from '#/helpers/pagingUtilities.js';
import { Context } from '../auth/setContext.js';

interface GetMonthlyBalancesWithPaginationArgs {
	page: number;
	pageSize: number;
}

interface RegisterMonthlyBalanceArgs {
	balance: number | string;
	date: string;
}

interface DeleteMonthlyBalanceArgs {
	uuid: string;
}

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

		const sortCriteria = { date: 'asc' };
		const allMonthlyBalances = await context.di.model.MonthlyBalance.find({ user_id: user._id }).sort(sortCriteria).lean();

		return allMonthlyBalances.map((monthlyBalance: any) => monthlyBalanceDTO(monthlyBalance));
	},
	/**
	 * Get monthly balances by user using pagination
	 */
	getMonthlyBalancesWithPagination: async (_parent: unknown, { page, pageSize }: GetMonthlyBalancesWithPaginationArgs, context: Context): Promise<{ monthlyBalances: MonthlyBalanceDTO[]; pagination: { currentPage: number; totalPages: number; totalCount: number } }> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.pagingValidation.ensurePageValueIsValid(page);
		context.di.pagingValidation.ensurePageSizeValueIsValid(pageSize);

		const user = await context.di.authValidation.getUser(context);

		const offset = getOffset(page, pageSize);
		const sortCriteria = { date: 'desc' };

		const getTotalCount = context.di.model.MonthlyBalance.countDocuments({ user_id: user._id });
		const getMonthlyBalances = context.di.model.MonthlyBalance.find({ user_id: user._id }).sort(sortCriteria).skip(offset).limit(pageSize).lean();

		const [totalCount, monthlyBalances] = await Promise.all([getTotalCount, getMonthlyBalances]);

		const totalPages = getTotalPagesNumber(totalCount, pageSize);

		return {
			monthlyBalances: monthlyBalances.map((monthlyBalance: any) => monthlyBalanceDTO(monthlyBalance)),
			pagination: {
				currentPage: page,
				totalPages: totalPages,
				totalCount: totalCount,
			}
		};
	}
};

export const Mutation = {
	/**
	 * Register a monthly balance
	 */
	registerMonthlyBalance: async (_parent: unknown, { balance, date }: RegisterMonthlyBalanceArgs, context: Context): Promise<MonthlyBalanceDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.datetimeValidation.ensureDateIsValid(date);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.MonthlyBalance({ user_id: user._id, balance, date }).save()
			.then((monthlyBalance: any) => monthlyBalanceDTO(monthlyBalance));
	},
	/**
	 * Delete one registry of monthly balance
	 */
	deleteMonthlyBalance: async (_parent: unknown, { uuid }: DeleteMonthlyBalanceArgs, context: Context): Promise<MonthlyBalanceDTO | null> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.MonthlyBalance.findOneAndDelete({ uuid, user_id: user._id })
			.then((monthlyBalance: any) => monthlyBalance ? monthlyBalanceDTO(monthlyBalance) : null);
	},
	/**
	 * Delete all registries of monthly balance
	 */
	deleteAllMonthlyBalances: async (_parent: unknown, _args: unknown, context: Context): Promise<any> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.MonthlyBalance.deleteMany({ user_id: user._id });
	}
};

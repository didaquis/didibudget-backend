'use strict';

const { monthlyBalanceDTO } = require('../../dto/monthlyBalanceDTO');
const { getOffset, getTotalPagesNumber } = require('../../helpers/pagingUtilities');

/**
 * All resolvers related to monthly balances
 * @typedef {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all monthly balances by user
		 */
		getMonthlyBalances: async (parent, args, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);


			const sortCriteria = { date: 'asc' };
			const allMonthlyBalances = await context.di.model.MonthlyBalance.find({ user_id: user._id }).sort(sortCriteria).lean();

			return allMonthlyBalances.map((monthlyBalance) => monthlyBalanceDTO(monthlyBalance));
		},
		/**
		 * Get monthly balances by user using pagination
		 */
		getMonthlyBalancesWithPagination: async (parent, { page, pageSize }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);
			context.di.pagingValidations.ensurePageValueIsValid(page);
			context.di.pagingValidations.ensurePageSizeValueIsValid(pageSize);

			const user = await context.di.authValidations.getUser(context);

			const offset = getOffset(page, pageSize);
			const sortCriteria = { date: 'desc' };

			const getTotalCount = context.di.model.MonthlyBalance.countDocuments({ user_id: user._id });
			const getMonthlyBalances = context.di.model.MonthlyBalance.find({ user_id: user._id }).sort(sortCriteria).skip(offset).limit(pageSize).lean();

			const [totalCount, monthlyBalances] = await Promise.all([getTotalCount, getMonthlyBalances]);

			const totalPages = getTotalPagesNumber(totalCount, pageSize);

			return {
				monthlyBalances: monthlyBalances.map((monthlyBalance) => monthlyBalanceDTO(monthlyBalance)),
				pagination: {
					currentPage: page,
					totalPages: totalPages,
					totalCount: totalCount,
				}
			};
		}
	},
	Mutation: {
		/**
		 * Register a monthly balance
		 */
		registerMonthlyBalance: async (parent, { balance, date }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);
			context.di.datetimeValidations.ensureDateIsValid(date);

			const user = await context.di.authValidations.getUser(context);

			return new context.di.model.MonthlyBalance({ user_id: user._id, balance, date }).save()
				.then(monthlyBalance => monthlyBalanceDTO(monthlyBalance));
		},
		/**
		 * Delete one registry of monthly balance
		 */
		deleteMonthlyBalance: async (parent, { uuid }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			return context.di.model.MonthlyBalance.findOneAndDelete({ uuid, user_id: user._id })
				.then(monthlyBalance => monthlyBalanceDTO(monthlyBalance));
		},
		/**
		 * Delete all registries of monthly balance
		 */
		deleteAllMonthlyBalances: async (parent, args, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			return context.di.model.MonthlyBalance.deleteMany({ user_id: user._id });
		}
	}
};

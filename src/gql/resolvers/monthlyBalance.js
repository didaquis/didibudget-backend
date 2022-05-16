'use strict';

const { monthlyBalanceDTO } = require('../../dto/monthlyBalanceDTO');

/**
 * All resolvers related to monthly balances
 * @typedef {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all data of monthly balance by user
		 */
		getMonthlyBalance: async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			const allMonthlyBalance = await context.di.model.MonthlyBalance.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

			return allMonthlyBalance.map((monthlyBalance) => monthlyBalanceDTO(monthlyBalance));
		}
	},
	Mutation: {
		/**
		 * Register a monthly balance
		 */
		registerMonthlyBalance: async (parent, { balance, date }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return new context.di.model.MonthlyBalance({ user_id: user._id, balance, date }).save()
				.then(monthlyBalance => monthlyBalanceDTO(monthlyBalance));
		},
		/**
		 * Delete one registry of monthly balance
		 */
		deleteMonthlyBalance: async (parent, { uuid }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.MonthlyBalance.findOneAndDelete({ uuid, user_id: user._id })
				.then(monthlyBalance => monthlyBalanceDTO(monthlyBalance));
		},
		/**
		 * Delete all registries of monthly balance
		 */
		deleteAllMonthlyBalances: async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.MonthlyBalance.deleteMany({ user_id: user._id });
		}
	}
};

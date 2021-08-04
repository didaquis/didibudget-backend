'use strict';

const { logger } = require('../../helpers/logger');

const { MonthlyBalance } = require('../../data/models/index');
const { authValidations } = require('../auth/authValidations');
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
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			try {
				const allMonthlyBalance = await MonthlyBalance.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

				return allMonthlyBalance.map((monthlyBalance) => monthlyBalanceDTO(monthlyBalance));
			} catch (error) {
				logger.error(error.message);
				return null;
			}
		}
	},
	Mutation: {
		/**
		 * Register monthly balance
		 */
		registerMonthlyBalance: async (parent, { balance, date }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return new MonthlyBalance({ user_id: user._id, balance, date }).save()
				.then(monthlyBalance => monthlyBalanceDTO(monthlyBalance))
				.catch(error => {
					logger.error(error.message);
					return null;
				});
		},
		/**
		 * Delete one registry of monthly balance
		 */
		deleteMonthlyBalance: async (parent, { uuid }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return MonthlyBalance.findOneAndDelete({ uuid, user_id: user._id })
				.then(monthlyBalance => monthlyBalanceDTO(monthlyBalance))
				.catch(error => {
					logger.error(error.message);
					return null;
				});
		},
		/**
		 * Delete all registries of monthly balance
		 */
		deleteAllMonthlyBalances: async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			try {
				return await MonthlyBalance.deleteMany({ user_id: user._id });
			} catch (error) {
				logger.error(error.message);
				return null;
			}
		}
	}
};

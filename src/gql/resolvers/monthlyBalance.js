'use strict';

const { AuthenticationError } = require('apollo-server-express');

const { logger } = require('../../utils/logger');

const { Users, MonthlyBalance } = require('../../data/models/index');
const { authValidations } = require('../auth/authValidations');

/**
 * All resolvers related to monthly balances
 * @type {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all data of monthly balance by user
		 */
		getMonthlyBalance: async (root, args, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			try {
				const allMonthlyBalance = await MonthlyBalance.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

				const result = allMonthlyBalance.map((data) => {
					return {
						balance: data.balance.toString(),
						date: data.date,
						currencyISO: data.currencyISO,
						uuid: data.uuid
					};
				});

				return result;
			} catch (error) {
				logger.error(error);
				return null;
			}
		}
	},
	Mutation: {
		/**
		 * Register monthly balance
		 */
		registerMonthlyBalance: async (root, { balance, date }, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			return new MonthlyBalance({ user_id: user._id, balance, date }).save()
				.then(monthlyBalance => {
					return {
						balance: monthlyBalance.balance.toString(),
						date: monthlyBalance.date,
						currencyISO: monthlyBalance.currencyISO,
						uuid: monthlyBalance.uuid
					};
				})
				.catch(error => {
					logger.error(error);
					return null;
				});
		},
		/**
		 * Delete one registry of monthly balance
		 */
		deleteMonthlyBalance: async (root, { uuid }, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			return MonthlyBalance.findOneAndDelete({ uuid })
				.then(monthlyBalance => {
					return {
						balance: monthlyBalance.balance.toString(),
						date: monthlyBalance.date,
						currencyISO: monthlyBalance.currencyISO,
						uuid: monthlyBalance.uuid
					};
				})
				.catch(error => {
					logger.error(error);
					return null;
				});
		},
		/**
		 * Delete all registries of monthly balance
		 */
		deleteAllMonthlyBalances: async (root, args, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			try {
				return await MonthlyBalance.deleteMany({ user_id: user._id });
			} catch (error) {
				logger.error(error);
				return null;
			}
		}
	}
};

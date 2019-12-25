const { ForbiddenError, AuthenticationError } = require('apollo-server-express');

const { logger } = require('../../utils/logger');

const { Users, MonthlyBalance } = require('../../data/models/index');
const { authValidations } = require('../auth/validations');

/**
 * All resolvers related to users
 * @type {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all data of monthly balance by user
		 */
		getMonthlyBalance: async (root, args, context) => {
			if (!authValidations.isLogged(context)) {
				throw new ForbiddenError('You must be logged in to perform this action');
			}

			const uuid = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			try {
				const allMonthlyBalance = await MonthlyBalance.find({ user_id: user._id }, null, { sort: { date: 1 } });
				//return { allMonthlyBalance };
				const result = [];
				allMonthlyBalance.forEach((data) => {
					result.push({
						balance: data.balance.toString(),
						date: data.date,
						currencyISO: data.currencyISO,
						uuid: data.uuid
					});
				});
				return result;
			} catch (error) {
				logger.error(error);
			}
		}
	},
	Mutation: {
		/**
		 * Register monthly balance
		 */
		registerMonthlyBalance: async (root, { balance, date }, context) => {
			if (!authValidations.isLogged(context)) {
				throw new ForbiddenError('You must be logged in to perform this action');
			}

			const uuid = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid });
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
				});
		}
	}
};

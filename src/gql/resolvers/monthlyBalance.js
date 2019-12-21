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

			return new MonthlyBalance({ idUser: user._id, balance, date }).save()
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

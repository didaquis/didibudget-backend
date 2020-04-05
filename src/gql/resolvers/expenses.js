'use strict';

const { AuthenticationError } = require('apollo-server-express');

const { logger } = require('../../utils/logger');

const { Users, Expenses } = require('../../data/models/index');
const { authValidations } = require('../auth/validations');

/**
 * All resolvers related to exxpenses
 * @type {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all data of expenses by user
		 */
		getExpenses: async (root, args, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			try {
				const allExpenses = await Expenses.find({ user_id: user._id }, null, { sort: { date: 1 } });

				const result = [];
				allExpenses.forEach((data) => {
					result.push({
						category: data.category,
						subcategory: data.subcategory,
						quantity: data.quantity.toString(),
						date: data.date,
						currencyISO: data.currencyISO,
						uuid: data.uuid
					});
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
		 * Register expense
		 */
		registerExpense: async (root, { category, subcategory, quantity, date }, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			return new Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
				.then(expense => {
					return {
						category: expense.category,
						subcategory: expense.subcategory,
						quantity: expense.quantity.toString(),
						date: expense.date,
						currencyISO: expense.currencyISO,
						uuid: expense.uuid
					};
				})
				.catch(error => {
					logger.error(error);
					return null;
				});
		},
		/**
		 * Delete one registry of expense
		 */
		deleteExpense: async (root, { uuid }, context) => {
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			const uuidOfUser = authValidations.getUserUUID(context);
			const user = await Users.findOne({ uuid: uuidOfUser });
			if (!user) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

			return Expenses.findOneAndDelete({ uuid })
				.then(expense => {
					return {
						category: expense.category,
						subcategory: expense.subcategory,
						quantity: expense.quantity.toString(),
						date: expense.date,
						currencyISO: expense.currencyISO,
						uuid: expense.uuid
					};
				})
				.catch(error => {
					logger.error(error);
					return null;
				});
		}
	}
};

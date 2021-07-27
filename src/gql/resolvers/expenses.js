'use strict';

const { logger } = require('../../utils/logger');

const { Expenses } = require('../../data/models/index');
const { authValidations } = require('../auth/authValidations');

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
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			try {
				const allExpenses = await Expenses.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

				const result = allExpenses.map((data) => {
					return {
						category: data.category,
						subcategory: data.subcategory,
						quantity: data.quantity.toString(),
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
		 * Register expense
		 */
		registerExpense: async (root, { category, subcategory, quantity, date }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

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
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return Expenses.findOneAndDelete({ uuid, user_id: user._id })
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
		 * Delete all registries of expense
		 */
		deleteAllExpenses: async (root, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			try {
				return await Expenses.deleteMany({ user_id: user._id });
			} catch (error) {
				logger.error(error);
				return null;
			}
		}
	}
};

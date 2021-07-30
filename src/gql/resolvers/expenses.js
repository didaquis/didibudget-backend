'use strict';

const { logger } = require('../../helpers/logger');

const { Expenses } = require('../../data/models/index');
const { authValidations } = require('../auth/authValidations');
const { expenseDTO } = require('../../dto/expenseDTO');

/**
 * All resolvers related to exxpenses
 * @typedef {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all data of expenses by user
		 */
		getExpenses: async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			try {
				const allExpenses = await Expenses.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

				return allExpenses.map((expense) => expenseDTO(expense));
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
		registerExpense: async (parent, { category, subcategory, quantity, date }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return new Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
				.then(expense => expenseDTO(expense))
				.catch(error => {
					logger.error(error);
					return null;
				});
		},
		/**
		 * Delete one registry of expense
		 */
		deleteExpense: async (parent, { uuid }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return Expenses.findOneAndDelete({ uuid, user_id: user._id })
				.then(expense => expenseDTO(expense))
				.catch(error => {
					logger.error(error);
					return null;
				});
		},
		/**
		 * Delete all registries of expense
		 */
		deleteAllExpenses: async (parent, args, context) => {
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

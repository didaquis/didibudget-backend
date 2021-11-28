'use strict';

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

			const allExpenses = await context.di.model.Expenses.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

			return allExpenses.map((expense) => expenseDTO(expense));
		}
	},
	Mutation: {
		/**
		 * Register expense
		 */
		registerExpense: async (parent, { category, subcategory, quantity, date }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return new context.di.model.Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
				.then(expense => expenseDTO(expense));
		},
		/**
		 * Delete one registry of expense
		 */
		deleteExpense: async (parent, { uuid }, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return context.di.model.Expenses.findOneAndDelete({ uuid, user_id: user._id })
				.then(expense => expenseDTO(expense));
		},
		/**
		 * Delete all registries of expense
		 */
		deleteAllExpenses: async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			const user = await authValidations.getUser(context);

			return await context.di.model.Expenses.deleteMany({ user_id: user._id });
		}
	}
};

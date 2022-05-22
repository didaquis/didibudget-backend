'use strict';

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
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			const allExpenses = await context.di.model.Expenses.find({ user_id: user._id }, null, { sort: { date: 1 } }).lean();

			return allExpenses.map((expense) => expenseDTO(expense));
		},
		/**
		 * Get expenses by user using pagination
		 */
		getSomeExpenses: async (parent, { offset, limit }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			const getTotalCount = context.di.model.Expenses.countDocuments({ user_id: user._id });
			const getExpenses = context.di.model.Expenses.find({ user_id: user._id }, null, { sort: { date: 1 } }).skip(offset).limit(limit).lean();

			const [totalCount, expenses] = await Promise.all([getTotalCount, getExpenses]);

			return {
				expenses: expenses.map((expense) => expenseDTO(expense)),
				paging: {
					count: expenses.length,
					totalCount: totalCount,
				}
			};
		}
	},
	Mutation: {
		/**
		 * Register an expense
		 */
		registerExpense: async (parent, { category, subcategory, quantity, date }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return new context.di.model.Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
				.then(expense => expenseDTO(expense));
		},
		/**
		 * Delete one registry of expense
		 */
		deleteExpense: async (parent, { uuid }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.Expenses.findOneAndDelete({ uuid, user_id: user._id })
				.then(expense => expenseDTO(expense));
		},
		/**
		 * Delete all registries of expense
		 */
		deleteAllExpenses: async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.Expenses.deleteMany({ user_id: user._id });
		}
	}
};

'use strict';

const { expenseDTO } = require('../../dto/expenseDTO');
const { getOffset, getTotalPagesNumber } = require('../../helpers/pagingUtilities');

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
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			const sortCriteria = { date: 'asc' };
			const allExpenses = await context.di.model.Expenses.find({ user_id: user._id }).sort(sortCriteria).lean();

			return allExpenses.map((expense) => expenseDTO(expense));
		},
		/**
		 * Get expenses by user using pagination
		 */
		getExpensesWithPagination: async (parent, { page, pageSize }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);
			context.di.pagingValidations.ensurePageValueIsValid(page);
			context.di.pagingValidations.ensurePageSizeValueIsValid(pageSize);

			const user = await context.di.authValidations.getUser(context);

			const offset = getOffset(page, pageSize);
			const sortCriteria = { date: 'desc', _id: 'desc' };

			const getTotalCount = context.di.model.Expenses.countDocuments({ user_id: user._id });
			const getExpenses = context.di.model.Expenses.find({ user_id: user._id }).sort(sortCriteria).skip(offset).limit(pageSize).lean();

			const [totalCount, expenses] = await Promise.all([getTotalCount, getExpenses]);

			const totalPages = getTotalPagesNumber(totalCount, pageSize);

			return {
				expenses: expenses.map((expense) => expenseDTO(expense)),
				pagination: {
					currentPage: page,
					totalPages: totalPages,
					totalCount: totalCount,
				}
			};
		},
		/**
		 * Get list of expenses for a specific user between two dates
		 */
		getExpensesBetweenDates: async (parent, { startDate, endDate }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			const sortCriteria = { date: 'desc', _id: 'desc' };

			const expenses = await context.di.model.Expenses.find({ user_id: user._id, date: { $gte: startDate, $lt: endDate } }).sort(sortCriteria).lean();

			return expenses.map((expense) => expenseDTO(expense));
		}
	},
	Mutation: {
		/**
		 * Register an expense
		 */
		registerExpense: async (parent, { category, subcategory, quantity, date }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			return new context.di.model.Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
				.then(expense => expenseDTO(expense));
		},
		/**
		 * Delete one registry of expense
		 */
		deleteExpense: async (parent, { uuid }, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			return context.di.model.Expenses.findOneAndDelete({ uuid, user_id: user._id })
				.then(expense => expenseDTO(expense));
		},
		/**
		 * Delete all registries of expense
		 */
		deleteAllExpenses: async (parent, args, context) => {
			context.di.authValidations.ensureThatUserIsLogged(context);

			const user = await context.di.authValidations.getUser(context);

			return context.di.model.Expenses.deleteMany({ user_id: user._id });
		}
	}
};

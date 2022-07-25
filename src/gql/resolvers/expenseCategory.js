'use strict';

/**
 * All resolvers related to Expense Category
 * @typedef {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all expense categories and subcategories
		 */
		getExpenseCategory: async (parent, args, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const sortCriteria = { name: 'asc' };
			const allExpenseCategories = await context.di.model.ExpenseCategory.find().sort(sortCriteria).populate('subcategories').lean();

			return allExpenseCategories || [];
		},
		/**
		 * Get an expense category and their subcategories by category id
		 */
		getExpenseCategoryById: async (parent, { category }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);

			const sortCriteria = { name: 'asc' };
			return context.di.model.ExpenseCategory.findOne({ _id: category }).sort(sortCriteria).populate('subcategories').lean();
		}
	},
};

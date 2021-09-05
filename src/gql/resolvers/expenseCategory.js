'use strict';

const { logger } = require('../../helpers/logger');

const { authValidations } = require('../auth/authValidations');

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
			authValidations.ensureThatUserIsLogged(context);

			try {
				const allExpenseCategories = await context.di.model.ExpenseCategory.find({ }, null, { sort: { name: 1 } }).populate('subcategories').lean();

				return allExpenseCategories || [];
			} catch (error) {
				logger.error(error.message);
				return null;
			}
		}
	},
};

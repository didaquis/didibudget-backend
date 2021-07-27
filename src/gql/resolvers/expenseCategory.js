'use strict';

const { logger } = require('../../utils/logger');

const { ExpenseCategory } = require('../../data/models/index');
const { authValidations } = require('../auth/authValidations');

/**
 * All resolvers related to Expense Category
 * @type {Object}
 */
module.exports = {
	Query: {
		/**
		 * Get all expense categories and subcategories
		 */
		getExpenseCategory: async (root, args, context) => {

			authValidations.ensureThatUserIsLogged(context);

			try {
				const allExpenseCategories = await ExpenseCategory.find({ }, null, { sort: { name: 1 } }).populate('subcategories').lean();

				return allExpenseCategories || [];
			} catch (error) {
				logger.error(error);
				return null;
			}
		}
	},
};

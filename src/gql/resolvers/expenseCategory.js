'use strict';

const { AuthenticationError } = require('apollo-server-express');

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
			if (!authValidations.isLogged(context)) {
				throw new AuthenticationError('You must be logged in to perform this action');
			}

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

'use strict';

const { expenseDTO } = require('../../dto/expenseDTO');
const { expenseSumByTypeDTO } = require('../../dto/expenseSumByTypeDTO');
const { getOffset, getTotalPagesNumber } = require('../../helpers/pagingUtilities');
const { CategoryType } = require('../../data/CategoryType');
const { CurrencyISO } = require('../../data/CurrencyISO');

/**
 * All resolvers related to expenses
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

			const sortCriteria = { date: 'asc' };
			const allExpenses = await context.di.model.Expenses.find({ user_id: user._id }).sort(sortCriteria).lean();

			return allExpenses.map((expense) => expenseDTO(expense));
		},
		/**
		 * Get expenses by user using pagination
		 */
		getExpensesWithPagination: async (parent, { page, pageSize }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);
			context.di.pagingValidation.ensurePageValueIsValid(page);
			context.di.pagingValidation.ensurePageSizeValueIsValid(pageSize);

			const user = await context.di.authValidation.getUser(context);

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
			context.di.authValidation.ensureThatUserIsLogged(context);
			context.di.datetimeValidation.ensureDateIsValid(startDate);
			context.di.datetimeValidation.ensureDateIsValid(endDate);
			context.di.datetimeValidation.ensureStartDateIsEarlierThanEndDate(startDate, endDate);

			const user = await context.di.authValidation.getUser(context);

			const sortCriteria = { date: 'desc', _id: 'desc' };

			const expenses = await context.di.model.Expenses.find({ user_id: user._id, date: { $gte: startDate, $lt: endDate } }).sort(sortCriteria).lean();

			return expenses.map((expense) => expenseDTO(expense));
		},
		/**
		 * Get the total expenses of a specific type for a specific user
		 */
		getExpensesSumByType: async (parent, { categoryType }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);
			context.di.parameterValidations.isValidEnumValue(categoryType, CategoryType);

			const user = await context.di.authValidation.getUser(context);

			const fromCollection = context.di.model.ExpenseCategory.collection.name;

			const aggregationResult = await context.di.model.Expenses.aggregate([
				{ $match: { user_id: user._id } },
				{
					$lookup: {
						from: fromCollection,
						localField: 'category',
						foreignField: '_id',
						as: 'categoryDetails'
					}
				},
				{ $unwind: '$categoryDetails' },
				{ $match: { 'categoryDetails.categoryType': categoryType } },
				{ $addFields: { quantityNum: { $toDouble: '$quantity' } } },
				{
					$group: {
						_id: '$currencyISO',
						totalSum: { $sum: '$quantityNum' }
					}
				},
				{ $project: { _id: 0, currencyISO: '$_id', sum: '$totalSum' } }
			]);

			if (!aggregationResult.length) {
				return expenseSumByTypeDTO(categoryType, CurrencyISO.EUR, 0);
			}


			const firstCurrencyGroup = aggregationResult[0];

			return expenseSumByTypeDTO(categoryType, firstCurrencyGroup.currencyISO, firstCurrencyGroup.sum);
		}
	},
	Mutation: {
		/**
		 * Register an expense
		 */
		registerExpense: async (parent, { category, subcategory, quantity, date }, context) => {
			context.di.authValidation.ensureThatUserIsLogged(context);
			context.di.datetimeValidation.ensureDateIsValid(date);

			const user = await context.di.authValidation.getUser(context);

			return context.di.model.Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
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

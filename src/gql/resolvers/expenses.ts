import { DeleteResult, PipelineStage, SortValues, Types } from 'mongoose';

import { expenseDTO, ExpenseDTO } from '#/dto/expenseDTO.js';
import { expenseSearchDTO, ExpenseSearchResultDTO } from '#/dto/expenseSearchDTO.js';
import { expenseSumByTypeDTO, ExpenseSumByTypeDTO } from '#/dto/expenseSumByTypeDTO.js';
import { expenseMonthlyAverageDTO, ExpenseMonthlyAverageDTO } from '#/dto/expenseMonthlyAverageDTO.js';
import { paginationDTO, PaginationDTO } from '#/dto/paginationDTO.js';
import { getOffset, getTotalPagesNumber } from '#/helpers/pagingUtilities.js';
import { getLastMonthsRangeExcludingCurrent } from '#/helpers/getLastMonthsRangeExcludingCurrent.js';
import { CurrencyISO } from '#/data/CurrencyISO.js';
import { Context } from '../auth/setContext.js';
import { CategoryTypeValue } from '#/data/CategoryType.js';
import type { IExpense } from '#/data/models/index.js';

interface GetExpensesWithPaginationArgs {
	page: number;
	pageSize: number;
}

interface GetExpensesBetweenDatesArgs {
	startDate: string;
	endDate: string;
}

interface GetExpensesSumByTypeArgs {
	categoryType: CategoryTypeValue;
}

interface GetExpensesMonthlyAverageArgs {
	lastNMonths: number;
	excludedCategoryTypes?: CategoryTypeValue[];
}

interface RegisterExpenseArgs {
	category: string;
	subcategory?: string | null;
	quantity: number;
	date: string;
}

interface DeleteExpenseArgs {
	uuid: string;
}

interface SearchExpensesAggregationResult {
	expenses: IExpense[];
	totals: { totalSum: number; totalCount: number }[];
	breakdown: { category: Types.ObjectId; subcategory?: Types.ObjectId; sum: number; count: number }[];
}

interface SearchExpensesArgs {
	category?: string | null;
	subcategory?: string | null;
	startDate?: string | null;
	endDate?: string | null;
	minQuantity?: number | null;
	maxQuantity?: number | null;
	sortBy?: 'date' | 'quantity';
	sortDirection?: 'asc' | 'desc';
	page: number;
	pageSize: number;
}

/**
 * A GraphQL optional argument is absent when it is omitted or when the client sends an explicit null
 */
const isProvided = <T>(value: T | null | undefined): value is T => value !== undefined && value !== null;

/**
 * All resolvers related to expenses
 */
export const Query = {
	/**
	 * Get all data of expenses by user
	 */
	getExpenses: async (_parent: unknown, _args: unknown, context: Context): Promise<ExpenseDTO[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		const sortCriteria: Record<string, SortValues> = { date: 'asc' };
		const allExpenses = await context.di.model.Expenses.find({ user_id: user._id }).sort(sortCriteria).lean();

		return allExpenses.map((expense) => expenseDTO(expense));
	},
	/**
	 * Get expenses by user using pagination
	 */
	getExpensesWithPagination: async (_parent: unknown, { page, pageSize }: GetExpensesWithPaginationArgs, context: Context): Promise<{ expenses: ExpenseDTO[]; pagination: PaginationDTO }> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.pagingValidation.ensurePageValueIsValid(page);
		context.di.pagingValidation.ensurePageSizeValueIsValid(pageSize);

		const user = await context.di.authValidation.getUser(context);

		const offset = getOffset(page, pageSize);
		const sortCriteria: Record<string, SortValues> = { date: 'desc', _id: 'desc' };

		const getTotalCount = context.di.model.Expenses.countDocuments({ user_id: user._id });
		const getExpenses = context.di.model.Expenses.find({ user_id: user._id }).sort(sortCriteria).skip(offset).limit(pageSize).lean();

		const [totalCount, expenses] = await Promise.all([getTotalCount, getExpenses]);

		const totalPages = getTotalPagesNumber(totalCount, pageSize);

		return {
			expenses: expenses.map((expense) => expenseDTO(expense)),
			pagination: paginationDTO(page, totalPages, totalCount)
		};
	},
	/**
	 * Get list of expenses for a specific user between two dates
	 */
	getExpensesBetweenDates: async (_parent: unknown, { startDate, endDate }: GetExpensesBetweenDatesArgs, context: Context): Promise<ExpenseDTO[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.datetimeValidation.ensureDateIsValid(startDate);
		context.di.datetimeValidation.ensureDateIsValid(endDate);
		context.di.datetimeValidation.ensureStartDateIsEarlierThanEndDate(startDate, endDate);

		const user = await context.di.authValidation.getUser(context);

		const sortCriteria: Record<string, SortValues> = { date: 'desc', _id: 'desc' };

		const expenses = await context.di.model.Expenses.find({ user_id: user._id, date: { $gte: startDate, $lt: endDate } }).sort(sortCriteria).lean();

		return expenses.map((expense) => expenseDTO(expense));
	},
	/**
	 * Get the total expenses of a specific type for a user
	 */
	getExpensesSumByType: async (_parent: unknown, { categoryType }: GetExpensesSumByTypeArgs, context: Context): Promise<ExpenseSumByTypeDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

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
	},
	/**
	 * Get the average monthly expenses for a user over the last N months (excluding the current month), optionally ignoring expenses of specified category types.
	 */
	getExpensesMonthlyAverage: async (_parent: unknown, { lastNMonths, excludedCategoryTypes = [] }: GetExpensesMonthlyAverageArgs, context: Context): Promise<ExpenseMonthlyAverageDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const minMonths = 1;
		const maxMonths = 240;
		context.di.parameterValidations.isIntegerBetween(lastNMonths, minMonths, maxMonths);

		const user = await context.di.authValidation.getUser(context);

		const { startDate, endDate } = getLastMonthsRangeExcludingCurrent(lastNMonths);

		const fromCollection = context.di.model.ExpenseCategory.collection.name;

		const aggregationResult = await context.di.model.Expenses.aggregate([
			{ $match: { user_id: user._id, date: { $gte: startDate, $lt: endDate } } },
			{
				$lookup: {
					from: fromCollection,
					localField: 'category',
					foreignField: '_id',
					as: 'categoryDetails'
				}
			},
			{ $unwind: '$categoryDetails' },
			{ $match: { 'categoryDetails.categoryType': { $nin: excludedCategoryTypes } } },
			{
				$group: {
					_id: null,
					totalSum: { $sum: { $toDouble: '$quantity' } }
				}
			},
			{ $project: { _id: 0, totalSum: 1 } }
		]);

		const totalSum = aggregationResult.length ? aggregationResult[0].totalSum : 0;
		const average = totalSum / lastNMonths;

		return expenseMonthlyAverageDTO(average, CurrencyISO.EUR);
	},
	/**
	 * Search expenses of a user filtering by category, subcategory, date range and amount range
	 */
	searchExpenses: async (_parent: unknown, { category, subcategory, startDate, endDate, minQuantity, maxQuantity, sortBy = 'date', sortDirection = 'desc', page, pageSize }: SearchExpensesArgs, context: Context): Promise<ExpenseSearchResultDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.pagingValidation.ensurePageValueIsValid(page);
		context.di.pagingValidation.ensurePageSizeValueIsValid(pageSize);

		if (isProvided(category)) {
			context.di.parameterValidations.isValidObjectId(category);
		}
		if (isProvided(subcategory)) {
			context.di.parameterValidations.isValidObjectId(subcategory);
		}
		if (isProvided(startDate)) {
			context.di.datetimeValidation.ensureDateIsValid(startDate);
		}
		if (isProvided(endDate)) {
			context.di.datetimeValidation.ensureDateIsValid(endDate);
		}
		if (isProvided(startDate) && isProvided(endDate)) {
			context.di.datetimeValidation.ensureStartDateIsNotLaterThanEndDate(startDate, endDate);
		}
		if (isProvided(minQuantity)) {
			context.di.parameterValidations.isNumberGreaterThanOrEqualToZero(minQuantity);
		}
		if (isProvided(maxQuantity)) {
			context.di.parameterValidations.isNumberGreaterThanOrEqualToZero(maxQuantity);
		}
		if (isProvided(minQuantity) && isProvided(maxQuantity)) {
			context.di.parameterValidations.isMinNotGreaterThanMax(minQuantity, maxQuantity);
		}

		const user = await context.di.authValidation.getUser(context);

		const matchStage: Record<string, unknown> = { user_id: user._id };
		if (isProvided(category)) {
			matchStage.category = new Types.ObjectId(category);
		}
		if (isProvided(subcategory)) {
			matchStage.subcategory = new Types.ObjectId(subcategory);
		}
		if (isProvided(startDate) || isProvided(endDate)) {
			const dateFilter: Record<string, Date> = {};
			if (isProvided(startDate)) {
				dateFilter.$gte = new Date(startDate);
			}
			if (isProvided(endDate)) {
				dateFilter.$lte = new Date(endDate);
			}
			matchStage.date = dateFilter;
		}

		const quantityFilter: Record<string, number> = {};
		if (isProvided(minQuantity)) {
			quantityFilter.$gte = minQuantity;
		}
		if (isProvided(maxQuantity)) {
			quantityFilter.$lte = maxQuantity;
		}

		const hasQuantityFilter = isProvided(minQuantity) || isProvided(maxQuantity);
		const needsQuantityField = hasQuantityFilter || sortBy === 'quantity';

		// The annotation on sortStage is what keeps these from widening to number,
		// which Mongoose rejects on a $sort stage
		const ascendingOrder = 1;
		const descendingOrder = -1;
		const direction = sortDirection === 'asc' ? ascendingOrder : descendingOrder;
		const sortStage: PipelineStage.Sort['$sort'] = sortBy === 'quantity'
			? { quantityNum: direction, _id: direction }
			: { date: direction, _id: direction };

		const offset = getOffset(page, pageSize);

		const aggregationResult = await context.di.model.Expenses.aggregate<SearchExpensesAggregationResult>([
			{ $match: matchStage },
			...(needsQuantityField ? [{ $addFields: { quantityNum: { $toDouble: '$quantity' } } }] : []),
			...(hasQuantityFilter ? [{ $match: { quantityNum: quantityFilter } }] : []),
			{ $sort: sortStage },
			{
				$facet: {
					expenses: [
						{ $skip: offset },
						{ $limit: pageSize }
					],
					totals: [
						{ $group: { _id: null, totalSum: { $sum: { $toDouble: '$quantity' } }, totalCount: { $sum: 1 } } }
					],
					breakdown: [
						{
							$group: {
								_id: { category: '$category', subcategory: '$subcategory' },
								sum: { $sum: { $toDouble: '$quantity' } },
								count: { $sum: 1 }
							}
						},
						{ $project: { _id: 0, category: '$_id.category', subcategory: '$_id.subcategory', sum: 1, count: 1 } },
						{ $sort: { sum: descendingOrder, category: ascendingOrder, subcategory: ascendingOrder } }
					]
				}
			}
		]);

		// $facet always yields an array of exactly one element, but a mock may not
		const emptyResult: SearchExpensesAggregationResult = { expenses: [], totals: [], breakdown: [] };
		const { expenses, totals, breakdown } = aggregationResult[0] ?? emptyResult;

		const noResults = { totalSum: 0, totalCount: 0 };
		const { totalSum, totalCount } = totals[0] ?? noResults;
		const totalPages = getTotalPagesNumber(totalCount, pageSize);

		return expenseSearchDTO(
			expenses.map((expense) => expenseDTO(expense)),
			paginationDTO(page, totalPages, totalCount),
			totalSum,
			CurrencyISO.EUR,
			breakdown
		);
	}
};

export const Mutation = {
	/**
	 * Register an expense
	 */
	registerExpense: async (_parent: unknown, { category, subcategory, quantity, date }: RegisterExpenseArgs, context: Context): Promise<ExpenseDTO> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.parameterValidations.isValidObjectId(category);
		if (subcategory !== undefined && subcategory !== null) {
			context.di.parameterValidations.isValidObjectId(subcategory);
		}
		context.di.datetimeValidation.ensureDateIsValid(date);

		const user = await context.di.authValidation.getUser(context);

		return new context.di.model.Expenses({ user_id: user._id, category, subcategory, quantity, date }).save()
			.then((expense) => expenseDTO(expense));
	},
	/**
	 * Delete one registry of expense
	 */
	deleteExpense: async (_parent: unknown, { uuid }: DeleteExpenseArgs, context: Context): Promise<ExpenseDTO | null> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.Expenses.findOneAndDelete({ uuid, user_id: user._id })
			.then((expense) => expense ? expenseDTO(expense) : null);
	},
	/**
	 * Delete all registries of expense
	 */
	deleteAllExpenses: async (_parent: unknown, _args: unknown, context: Context): Promise<DeleteResult> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.Expenses.deleteMany({ user_id: user._id });
	}
};

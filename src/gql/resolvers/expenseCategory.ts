import { SortValues, Types } from 'mongoose';
import { Context } from '../auth/setContext.js';
import type { IExpenseCategory, IExpenseSubcategory } from '#/data/models/index.js';
import { mostUsedExpenseCategoryDTO, type MostUsedExpenseCategoryDTO } from '#/dto/mostUsedExpenseCategoryDTO.js';

interface GetExpenseCategoryByIdArgs {
	category: string;
}

interface GetMostUsedExpenseCategoriesArgs {
	days: number;
	limit: number;
}

interface CategoryUsageGroup {
	_id: {
		category: Types.ObjectId;
		subcategory: Types.ObjectId | null;
	};
	total: number;
	lastUsed: Date;
}

type PopulatedExpenseCategory = Omit<IExpenseCategory, 'subcategories'> & { subcategories: IExpenseSubcategory[] };

const MIN_DAYS = 1;
const MAX_DAYS = 365;
const MIN_LIMIT = 1;
const MAX_LIMIT = 20;
const HOURS_IN_A_DAY = 24;
const MINUTES_IN_AN_HOUR = 60;
const SECONDS_IN_A_MINUTE = 60;
const MILLISECONDS_IN_A_SECOND = 1000;
const MILLISECONDS_IN_A_DAY = HOURS_IN_A_DAY * MINUTES_IN_AN_HOUR * SECONDS_IN_A_MINUTE * MILLISECONDS_IN_A_SECOND;

/**
 * All resolvers related to Expense Category
 */
export const Query = {
	/**
	 * Get all expense categories and subcategories
	 */
	getExpenseCategory: async (_parent: unknown, _args: unknown, context: Context): Promise<PopulatedExpenseCategory[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const sortCriteria: Record<string, SortValues> = { name: 'asc' };
		const allExpenseCategories = await context.di.model.ExpenseCategory
			.find()
			.sort(sortCriteria)
			.populate<{ subcategories: IExpenseSubcategory[] }>('subcategories')
			.lean();

		return allExpenseCategories ?? [];
	},
	/**
	 * Get an expense category and their subcategories by category id
	 */
	getExpenseCategoryById: async (_parent: unknown, { category }: GetExpenseCategoryByIdArgs, context: Context): Promise<PopulatedExpenseCategory | null> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.parameterValidations.isValidObjectId(category);

		const sortCriteria: Record<string, SortValues> = { name: 'asc' };
		const result = await context.di.model.ExpenseCategory
			.findOne({ _id: category })
			.sort(sortCriteria)
			.populate<{ subcategories: IExpenseSubcategory[] }>('subcategories')
			.lean();

		return result;
	},
	/**
	 * Get the categories and subcategories this user has used the most within a period.
	 * The ranking counts how many expenses were registered per category/subcategory pair.
	 */
	getMostUsedExpenseCategories: async (_parent: unknown, { days, limit }: GetMostUsedExpenseCategoriesArgs, context: Context): Promise<MostUsedExpenseCategoryDTO[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);
		context.di.parameterValidations.isIntegerBetween(days, MIN_DAYS, MAX_DAYS);
		context.di.parameterValidations.isIntegerBetween(limit, MIN_LIMIT, MAX_LIMIT);

		const user = await context.di.authValidation.getUser(context);

		const startDate = new Date(Date.now() - (days * MILLISECONDS_IN_A_DAY));

		const usage = await context.di.model.Expenses.aggregate<CategoryUsageGroup>([
			{ $match: { user_id: user._id, date: { $gte: startDate } } },
			{ $group: { _id: { category: '$category', subcategory: '$subcategory' }, total: { $sum: 1 }, lastUsed: { $max: '$date' } } },
			{ $sort: { total: -1, lastUsed: -1, '_id.category': 1, '_id.subcategory': 1 } },
			{ $limit: limit }
		]);

		if (!usage.length) {
			return [];
		}

		const categoryIds = usage.map((group) => group._id.category);
		const subcategoryIds = usage
			.map((group) => group._id.subcategory)
			.filter((subcategoryId): subcategoryId is Types.ObjectId => Boolean(subcategoryId));

		const [categories, subcategories] = await Promise.all([
			context.di.model.ExpenseCategory.find({ _id: { $in: categoryIds } }).select('name emojis').lean(),
			context.di.model.ExpenseSubcategory.find({ _id: { $in: subcategoryIds } }).select('name emojis').lean()
		]);

		const categoriesById = new Map(categories.map((category) => [category._id.toString(), category]));
		const subcategoriesById = new Map(subcategories.map((subcategory) => [subcategory._id.toString(), subcategory]));

		return usage.flatMap((group) => {
			const category = categoriesById.get(group._id.category.toString());

			if (!category) {
				return [];
			}

			const subcategory = group._id.subcategory
				? subcategoriesById.get(group._id.subcategory.toString()) ?? null
				: null;

			return [mostUsedExpenseCategoryDTO({ category, subcategory, total: group.total })];
		});
	}
};

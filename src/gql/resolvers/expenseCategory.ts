import { SortValues } from 'mongoose';
import { Context } from '../auth/setContext.js';
import type { IExpenseCategory, IExpenseSubcategory } from '#/data/models/index.js';

interface GetExpenseCategoryByIdArgs {
	category: string;
}

interface PopulatedExpenseCategory extends Omit<IExpenseCategory, 'subcategories'> {
	subcategories: IExpenseSubcategory[];
}

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
		const allExpenseCategories = await context.di.model.ExpenseCategory.find().sort(sortCriteria).populate<{ subcategories: IExpenseSubcategory[] }>('subcategories').lean();

		return (allExpenseCategories || []) as unknown as PopulatedExpenseCategory[];
	},
	/**
	 * Get an expense category and their subcategories by category id
	 */
	getExpenseCategoryById: async (_parent: unknown, { category }: GetExpenseCategoryByIdArgs, context: Context): Promise<PopulatedExpenseCategory | null> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const sortCriteria: Record<string, SortValues> = { name: 'asc' };
		const result = await context.di.model.ExpenseCategory.findOne({ _id: category }).sort(sortCriteria).populate<{ subcategories: IExpenseSubcategory[] }>('subcategories').lean();

		return result as unknown as PopulatedExpenseCategory | null;
	}
};

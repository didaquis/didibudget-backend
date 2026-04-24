import { Context } from '../auth/setContext.js';

interface GetExpenseCategoryByIdArgs {
	category: string;
}

/**
 * All resolvers related to Expense Category
 */
export const Query = {
	/**
	 * Get all expense categories and subcategories
	 */
	getExpenseCategory: async (_parent: unknown, _args: unknown, context: Context): Promise<any[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const sortCriteria = { name: 'asc' };
		const allExpenseCategories = await context.di.model.ExpenseCategory.find().sort(sortCriteria).populate('subcategories').lean();

		return allExpenseCategories || [];
	},
	/**
	 * Get an expense category and their subcategories by category id
	 */
	getExpenseCategoryById: async (_parent: unknown, { category }: GetExpenseCategoryByIdArgs, context: Context): Promise<any | null> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const sortCriteria = { name: 'asc' };
		return context.di.model.ExpenseCategory.findOne({ _id: category }).sort(sortCriteria).populate('subcategories').lean();
	}
};

import { ExpenseCategory, ExpenseSubcategory, Expenses, MonthlyBalance, RecurringExpenseSuggestion } from '#/data/models/index.js';
import { logger } from '#/helpers/logger.js';


interface Subcategory {
	name: string;
	inmutableKey: string;
	emojis: string[];
}

export interface ExpenseCategoryInput {
	name: string;
	inmutableKey: string;
	emojis: string[];
	categoryType: string;
	subcategories: Subcategory[];
}

/**
 * The unique index { user_id, year, month } cannot be built while a document has no year or month, or a user has
 * two balances in the same month. Historical data must not take the API down: log it loudly and keep starting.
 * The check in `registerMonthlyBalance` still rejects repeated months.
 */
const createMonthlyBalanceIndexes = async (): Promise<void> => {
	try {
		await MonthlyBalance.createIndexes();
	} catch (error) {
		logger.error('Monthly balance indexes could not be created, so the unique index { user_id, year, month } is NOT active. Most likely some documents have no "year" or "month" field, or a user has two balances in the same month.', error);
	}
};

/**
 * Ensure all Mongoose schema indexes are created in MongoDB.
 * Idempotent — safe to call on every startup.
 */
export const createDatabaseIndexes = async (): Promise<void> => {
	await Expenses.createIndexes();
	await createMonthlyBalanceIndexes();
	await RecurringExpenseSuggestion.createIndexes();
	await ExpenseCategory.createIndexes();
	await ExpenseSubcategory.createIndexes();
};

/**
 * Save default data of expense categories and subcategories to the database.
 * This function never deletes documents, but creates new documents if the default data changes.
 */
export const upsertDBWithExpenseCategories = async (expenseCategories: ExpenseCategoryInput[] = []): Promise<void> => {
	for (const category of expenseCategories) {
		const upsertSubcategories = category.subcategories.map((subcategory) => {
			return ExpenseSubcategory.findOneAndUpdate({ inmutableKey: subcategory.inmutableKey }, { name: subcategory.name, inmutableKey: subcategory.inmutableKey, emojis: subcategory.emojis }, { upsert: true, new: true, setDefaultsOnInsert: true });
		});

		const listOfSubcategories = await Promise.all(upsertSubcategories);

		const listOfSubcategoriesId = listOfSubcategories.map((subcategory) => subcategory._id);

		await ExpenseCategory.findOneAndUpdate({ inmutableKey: category.inmutableKey }, { name: category.name, inmutableKey: category.inmutableKey, subcategories: listOfSubcategoriesId, emojis: category.emojis, categoryType: category.categoryType }, { upsert: true, new: true, setDefaultsOnInsert: true });
	}
};

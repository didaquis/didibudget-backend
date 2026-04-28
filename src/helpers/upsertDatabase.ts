/* Home doc */
/**
 * Insert default data on database if not exist yet
 */

/* Module doc */
/**
 * Insert default data on database if not exist yet
 */


import { ExpenseCategory, ExpenseSubcategory } from '#/data/models/index.js';


interface Subcategory {
	name: string;
	inmutableKey: string;
	emojis: string[];
}

interface ExpenseCategoryInput {
	name: string;
	inmutableKey: string;
	emojis: string[];
	categoryType: string;
	subcategories: Subcategory[];
}

/**
 * Save default data of expense categories and subcategories to the database.
 * This function never deletes documents, but creates new documents if the default data changes.
 */
export const upsertDBWithExpenseCategories = async (expenseCategories: ExpenseCategoryInput[] = []): Promise<void> => {
	await ExpenseCategory.createIndexes();
	await ExpenseSubcategory.createIndexes();
	expenseCategories.forEach(async (category) => {
		const upsertSubcategories = category.subcategories.map((subcategory) => {
			return ExpenseSubcategory.findOneAndUpdate({ inmutableKey: subcategory.inmutableKey }, { name: subcategory.name, inmutableKey: subcategory.inmutableKey, emojis: subcategory.emojis }, { upsert: true, new: true, setDefaultsOnInsert: true });
		});

		const listOfSubcategories = await Promise.all(upsertSubcategories);

		const listOfSubcategoriesId = listOfSubcategories.map((subcategory) => subcategory._id);

		await ExpenseCategory.findOneAndUpdate({ inmutableKey: category.inmutableKey }, { name: category.name, inmutableKey: category.inmutableKey, subcategories: listOfSubcategoriesId, emojis: category.emojis, categoryType: category.categoryType }, { upsert: true, new: true, setDefaultsOnInsert: true });
	});
};

'use strict';

/* Home doc */
/**
 * @file Insert default data on database if not exist yet
 * @see module:upsertDatabase
 */

/* Module doc */
/**
 * Insert default data on database if not exist yet
 * @module upsertDatabase
 */


const { ExpenseCategory, ExpenseSubcategory } = require('../data/models/index');


/**
 * @typedef {Object} Subcategory
 * @property {string} name - Name of the subcategory
 * @property {string} inmutableKey - Immutable key of the subcategory
 * @property {Array<string>} emojis - Emojis identifying the subcategory
 */

/**
 * @typedef {Object} ExpenseCategory
 * @property {string} name - Name of the expense category
 * @property {string} inmutableKey - Static and private identifier for the category, consistent across environments/persistence layers
 * @property {Array<string>} emojis - Emojis identifying the category
 * @property {string} categoryType - Type of the expense category (see CategoryType)
 * @property {Array<Subcategory>} subcategories - Array of subcategory objects (may be empty)
 */

/**
 * Save default data of expense categories and subcategories to the database.
 * This function never deletes documents, but creates new documents if the default data changes.
 *
 * @async
 * @param {Array<ExpenseCategory>} expenseCategories - List of expense categories to upsert
 */
const upsertDBWithExpenseCategories = async (expenseCategories = []) => {
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


module.exports = { upsertDBWithExpenseCategories };

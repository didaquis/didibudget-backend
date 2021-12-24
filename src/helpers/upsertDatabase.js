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
 * Save on the database the default data related to expense categories and subcategories. This function never delete documents on the dabatase, but should generate a new document if content of default data change
 * @param {Array.<Object>} expenseCategories - A list of literal objects
 * @param {string} expenseCategories.name - Name of expense category
 * @param {Array.<{name: string}>} expenseCategories.subcategories - A list of literal objects. Every object should contain the property name. Can be an empty array
 */
const upsertDBWithExpenseCategories = ({ expenseCategories } = []) => {
	expenseCategories.forEach(async (category) => {
		const upsertSubcategories = category.subcategories.map((subcategory) => {
			return ExpenseSubcategory.findOneAndUpdate({ name: subcategory.name }, { name: subcategory.name }, { upsert: true, new: true, setDefaultsOnInsert: true });
		});

		const listOfSubcategories = await Promise.all(upsertSubcategories);

		const listOfSubcategoriesId = listOfSubcategories.map((subcategory) => subcategory._id);

		await ExpenseCategory.findOneAndUpdate({ name: category.name }, { name: category.name, subcategories: listOfSubcategoriesId }, { upsert: true, new: true, setDefaultsOnInsert: true });
	});
};


module.exports = { upsertDBWithExpenseCategories };

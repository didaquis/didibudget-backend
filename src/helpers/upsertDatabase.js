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
 * Save on database the default data related to expense categories and subcategories. This function never delete documents on the dabatase, but should generate a new document if content of default data change
 * @param  {Object[]} expenseCategories - A list of literal objects
 * @param  {String} expenseCategories[].name - Name of expense category
 * @param  {Array} expenseCategories[].subcategories - Name of related subcategories. Can be an empty array
 * @param  {String} expenseCategories[].subcategories[].name - Name of subcategory
 */
const upsertDBWithExpenseCategories = ({ expenseCategories } = []) => {
	expenseCategories.forEach(async (category) => {
		const upsertSubcategories = category.subcategories.map((subcategory) => {
			return ExpenseSubcategory.findOneAndUpdate({ name: subcategory }, { name: subcategory }, { upsert: true, new: true, setDefaultsOnInsert: true });
		});

		const listOfSubcategories = await Promise.all(upsertSubcategories);

		const listOfSubcategoriesId = listOfSubcategories.map((subcategory) => subcategory._id);
		await ExpenseCategory.findOneAndUpdate({ name: category.name }, { name: category.name, subcategories: listOfSubcategoriesId }, { upsert: true, new: true, setDefaultsOnInsert: true });
	});
};


module.exports = { upsertDBWithExpenseCategories };

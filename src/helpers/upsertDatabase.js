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
 * @param {string} expenseCategories.inmutableKey - A static and private identifier for every expense category. The value should be consistent across differents environments or persistence layer.
 * @param {Array.<{name: string, inmutableKey: string}>} expenseCategories.subcategories - A list of literal objects. Every object should contain the properties name and inmutableKey. May be an empty array
 */
const upsertDBWithExpenseCategories = ({ expenseCategories } = []) => {
	ExpenseCategory.createIndexes();
	ExpenseSubcategory.createIndexes();
	expenseCategories.forEach(async (category) => {
		const upsertSubcategories = category.subcategories.map((subcategory) => {
			return ExpenseSubcategory.findOneAndUpdate({ inmutableKey: subcategory.inmutableKey }, { name: subcategory.name, inmutableKey: subcategory.inmutableKey }, { upsert: true, new: true, setDefaultsOnInsert: true });
		});

		const listOfSubcategories = await Promise.all(upsertSubcategories);

		const listOfSubcategoriesId = listOfSubcategories.map((subcategory) => subcategory._id);

		await ExpenseCategory.findOneAndUpdate({ inmutableKey: category.inmutableKey }, { name: category.name, inmutableKey: category.inmutableKey, subcategories: listOfSubcategoriesId }, { upsert: true, new: true, setDefaultsOnInsert: true });
	});
};


module.exports = { upsertDBWithExpenseCategories };

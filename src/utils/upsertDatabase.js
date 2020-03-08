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

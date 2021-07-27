'use strict';

/**
 * Builds a DTO of expense
 * @param {Expense} expense - An Expense
 * @returns {Object}
 */
const expenseDTO = (expense) => {
	return {
		category: expense.category,
		subcategory: expense.subcategory,
		quantity: expense.quantity.toString(),
		date: expense.date,
		currencyISO: expense.currencyISO,
		uuid: expense.uuid
	};
};

module.exports = { expenseDTO };

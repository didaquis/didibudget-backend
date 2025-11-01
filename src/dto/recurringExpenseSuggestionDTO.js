'use strict';

/**
 * Builds a DTO of recurring expense suggestion
 * @param {RecurringExpenseSuggestion} recurringExpenseSuggestion - A Recurring Expense Suggestion
 * @returns {Object}
 */
const recurringExpenseSuggestionDTO = (recurringExpenseSuggestion) => {
	return {
		isActive: recurringExpenseSuggestion.isActive,
		startDay: recurringExpenseSuggestion.startDay,
		endDay: recurringExpenseSuggestion.endDay,
		uuid: recurringExpenseSuggestion.uuid,
		suggestedExpense: buildSuggestedExpenseDTO(recurringExpenseSuggestion.suggestedExpense)
	};
};

const buildSuggestedExpenseDTO = (suggestedExpense) => {
	return {
		category: suggestedExpense.category,
		subcategory: suggestedExpense.subcategory,
		quantity: suggestedExpense.quantity.toString()
	};
};

module.exports = { recurringExpenseSuggestionDTO };

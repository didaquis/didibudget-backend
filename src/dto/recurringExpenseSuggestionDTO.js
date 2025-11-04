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
		category: suggestedExpense.category._id,
		categoryName: suggestedExpense.category.name || null,
		categoryEmojis: suggestedExpense.category.emojis || [],
		subcategory: suggestedExpense.subcategory?._id || null,
		subcategoryName: suggestedExpense.subcategory?.name || null,
		subcategoryEmojis: suggestedExpense.subcategory?.emojis || [],
		quantity: suggestedExpense.quantity.toString(),
	};
};

module.exports = { recurringExpenseSuggestionDTO };

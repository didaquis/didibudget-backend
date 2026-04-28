import { IRecurringExpenseSuggestion } from '#/data/models/schemas/RecurringExpenseSuggestionSchema.js';
import { ISuggestedExpense } from '#/data/models/schemas/SuggestedExpenseSchema.js';

interface SuggestedExpenseDTO {
	category: string;
	subcategory: string | null;
	quantity: string;
}

export interface RecurringExpenseSuggestionDTO {
	isActive: boolean;
	startDay: number;
	endDay: number;
	uuid: string;
	suggestedExpense: SuggestedExpenseDTO;
}

/**
 * Builds a DTO of recurring expense suggestion
 */
export const recurringExpenseSuggestionDTO = (recurringExpenseSuggestion: IRecurringExpenseSuggestion): RecurringExpenseSuggestionDTO => {
	return {
		isActive: recurringExpenseSuggestion.isActive,
		startDay: recurringExpenseSuggestion.startDay,
		endDay: recurringExpenseSuggestion.endDay,
		uuid: recurringExpenseSuggestion.uuid,
		suggestedExpense: buildSuggestedExpenseDTO(recurringExpenseSuggestion.suggestedExpense)
	};
};

const buildSuggestedExpenseDTO = (suggestedExpense: ISuggestedExpense): SuggestedExpenseDTO => {
	return {
		category: suggestedExpense.category._id.toString(),
		subcategory: suggestedExpense.subcategory?._id.toString() || null,
		quantity: suggestedExpense.quantity.toString(),
	};
};

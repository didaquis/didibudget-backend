import { Types } from 'mongoose';
import { IRecurringExpenseSuggestion } from '#/data/models/schemas/RecurringExpenseSuggestionSchema.js';
interface SuggestedExpenseDTO {
	category: Types.ObjectId;
	categoryName: string;
	categoryEmojis: string[];
	subcategory: Types.ObjectId | null;
	subcategoryName: string | null;
	subcategoryEmojis: string[];
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

const buildSuggestedExpenseDTO = (suggestedExpense): SuggestedExpenseDTO => {
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

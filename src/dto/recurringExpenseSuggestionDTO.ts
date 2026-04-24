interface SuggestedExpenseDTO {
	category: string;
	categoryName: string | null;
	categoryEmojis: string[];
	subcategory: string | null;
	subcategoryName: string | null;
	subcategoryEmojis: string[];
	quantity: string;
}

export interface RecurringExpenseSuggestionDTO {
	isActive: boolean;
	startDay: number;
	endDay: number | null;
	uuid: string;
	suggestedExpense: SuggestedExpenseDTO;
}

/**
 * Builds a DTO of recurring expense suggestion
 */
export const recurringExpenseSuggestionDTO = (recurringExpenseSuggestion: {
	isActive: boolean;
	startDay: number;
	endDay: number | null;
	uuid: string;
	suggestedExpense: {
		category: {
			_id: string;
			name?: string;
			emojis?: string[];
		};
		subcategory?: {
			_id: string;
			name?: string;
			emojis?: string[];
		} | null;
		quantity: number | string;
	};
}): RecurringExpenseSuggestionDTO => {
	return {
		isActive: recurringExpenseSuggestion.isActive,
		startDay: recurringExpenseSuggestion.startDay,
		endDay: recurringExpenseSuggestion.endDay,
		uuid: recurringExpenseSuggestion.uuid,
		suggestedExpense: buildSuggestedExpenseDTO(recurringExpenseSuggestion.suggestedExpense)
	};
};

const buildSuggestedExpenseDTO = (suggestedExpense: {
	category: {
		_id: string;
		name?: string;
		emojis?: string[];
	};
	subcategory?: {
		_id: string;
		name?: string;
		emojis?: string[];
	} | null;
	quantity: number | string;
}): SuggestedExpenseDTO => {
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

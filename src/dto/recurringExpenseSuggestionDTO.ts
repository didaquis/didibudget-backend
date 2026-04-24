import type { Types } from 'mongoose';

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

interface CategoryInput {
	_id: string | Types.ObjectId;
	name?: string;
	emojis?: string[];
}

interface SubcategoryInput {
	_id: string | Types.ObjectId;
	name?: string;
	emojis?: string[];
}

interface SuggestedExpenseInput {
	category: CategoryInput;
	subcategory?: SubcategoryInput | null;
	quantity: number | string | Types.Decimal128;
}

interface RecurringExpenseSuggestionInput {
	isActive: boolean;
	startDay: number;
	endDay: number | null;
	uuid: string;
	suggestedExpense: SuggestedExpenseInput;
}

/**
 * Builds a DTO of recurring expense suggestion
 */
export const recurringExpenseSuggestionDTO = (recurringExpenseSuggestion: RecurringExpenseSuggestionInput): RecurringExpenseSuggestionDTO => {
	return {
		isActive: recurringExpenseSuggestion.isActive,
		startDay: recurringExpenseSuggestion.startDay,
		endDay: recurringExpenseSuggestion.endDay,
		uuid: recurringExpenseSuggestion.uuid,
		suggestedExpense: buildSuggestedExpenseDTO(recurringExpenseSuggestion.suggestedExpense)
	};
};

const buildSuggestedExpenseDTO = (suggestedExpense: SuggestedExpenseInput): SuggestedExpenseDTO => {
	return {
		category: suggestedExpense.category._id.toString(),
		categoryName: suggestedExpense.category.name || null,
		categoryEmojis: suggestedExpense.category.emojis || [],
		subcategory: suggestedExpense.subcategory?._id.toString() || null,
		subcategoryName: suggestedExpense.subcategory?.name || null,
		subcategoryEmojis: suggestedExpense.subcategory?.emojis || [],
		quantity: suggestedExpense.quantity.toString(),
	};
};

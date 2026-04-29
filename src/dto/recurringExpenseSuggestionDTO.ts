import { FlattenMaps, Types } from 'mongoose';
import { IRecurringExpenseSuggestion } from '#/data/models/schemas/RecurringExpenseSuggestionSchema.js';
import { ISuggestedExpense } from '#/data/models/schemas/SuggestedExpenseSchema.js';
import { IExpenseCategory } from '#/data/models/schemas/ExpenseCategorySchema.js';
import { IExpenseSubcategory } from '#/data/models/schemas/ExpenseSubcategorySchema.js';

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
 * Represents the suggestedExpense subdocument after populating category and subcategory references.
 * The FlattenMaps wrapper matches what Mongoose's lean() returns for nested documents.
 */
export interface SuggestedExpensePopulated extends Omit<FlattenMaps<ISuggestedExpense>, 'category' | 'subcategory'> {
	category: FlattenMaps<IExpenseCategory>;
	subcategory?: FlattenMaps<IExpenseSubcategory>;
}

/**
 * Represents a RecurringExpenseSuggestion document after lean() with category and subcategory populated.
 * Matches the shape Mongoose returns from .populate(...).lean() queries.
 */
export interface RecurringExpenseSuggestionLean extends Omit<FlattenMaps<IRecurringExpenseSuggestion>, 'suggestedExpense'> {
	suggestedExpense: SuggestedExpensePopulated;
}

/**
 * Builds a DTO of recurring expense suggestion
 */
export const recurringExpenseSuggestionDTO = (recurringExpenseSuggestion: RecurringExpenseSuggestionLean): RecurringExpenseSuggestionDTO => {
	return {
		isActive: recurringExpenseSuggestion.isActive,
		startDay: recurringExpenseSuggestion.startDay,
		endDay: recurringExpenseSuggestion.endDay,
		uuid: recurringExpenseSuggestion.uuid,
		suggestedExpense: buildSuggestedExpenseDTO(recurringExpenseSuggestion.suggestedExpense)
	};
};

const buildSuggestedExpenseDTO = (suggestedExpense: SuggestedExpensePopulated): SuggestedExpenseDTO => {
	return {
		category: suggestedExpense.category._id,
		categoryName: suggestedExpense.category.name,
		categoryEmojis: suggestedExpense.category.emojis || [],
		subcategory: suggestedExpense.subcategory?._id ?? null,
		subcategoryName: suggestedExpense.subcategory?.name ?? null,
		subcategoryEmojis: suggestedExpense.subcategory?.emojis ?? [],
		quantity: suggestedExpense.quantity.toString(),
	};
};

import type { Types } from 'mongoose';

export interface ExpenseDTO {
	category: string;
	subcategory: string;
	quantity: string;
	date: string;
	currencyISO: string;
	uuid: string;
}

interface ExpenseDTOInput {
	category: string | Types.ObjectId;
	subcategory?: string | Types.ObjectId | null;
	quantity: number | string | Types.Decimal128;
	date: string | Date;
	currencyISO: string;
	uuid: string;
}

/**
 * Builds a DTO of expense
 */
export const expenseDTO = (expense: ExpenseDTOInput): ExpenseDTO => {
	return {
		category: expense.category.toString(),
		subcategory: expense.subcategory?.toString() || '',
		quantity: expense.quantity.toString(),
		date: expense.date as string,
		currencyISO: expense.currencyISO,
		uuid: expense.uuid
	};
};

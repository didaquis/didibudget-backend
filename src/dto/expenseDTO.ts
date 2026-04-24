export interface ExpenseDTO {
	category: string;
	subcategory: string;
	quantity: string;
	date: string;
	currencyISO: string;
	uuid: string;
}

/**
 * Builds a DTO of expense
 */
export const expenseDTO = (expense: {
	category: string;
	subcategory: string;
	quantity: number | string;
	date: string;
	currencyISO: string;
	uuid: string;
}): ExpenseDTO => {
	return {
		category: expense.category,
		subcategory: expense.subcategory,
		quantity: expense.quantity.toString(),
		date: expense.date,
		currencyISO: expense.currencyISO,
		uuid: expense.uuid
	};
};

export interface ExpenseSumByTypeDTO {
	categoryType: string;
	currencyISO: string;
	sum: number;
}

/**
 * Builds a DTO for ExpenseSumByType
 */
export const expenseSumByTypeDTO = (
	categoryType: string,
	currencyISO: string,
	sum: number
): ExpenseSumByTypeDTO => {
	return {
		categoryType,
		currencyISO,
		sum
	};
};

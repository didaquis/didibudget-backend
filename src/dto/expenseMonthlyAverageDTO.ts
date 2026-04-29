import { roundToTwoDecimals } from '#/helpers/roundToTwoDecimals.js';

export interface ExpenseMonthlyAverageDTO {
	average: number;
	currencyISO: string;
}

/**
 * Builds a DTO of ExpensesMonthlyAverage
 */
export const expenseMonthlyAverageDTO = (
	average: number,
	currencyISO: string
): ExpenseMonthlyAverageDTO => {
	return {
		average: roundToTwoDecimals(average),
		currencyISO
	};
};

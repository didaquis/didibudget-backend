import type { Types } from 'mongoose';

import { roundToTwoDecimals } from '#/helpers/roundToTwoDecimals.js';
import type { ExpenseDTO } from '#/dto/expenseDTO.js';
import type { PaginationDTO } from '#/dto/paginationDTO.js';

export interface ExpenseBreakdownEntryDTO {
	category: string;
	subcategory: string | null;
	sum: number;
	count: number;
}

export interface ExpenseSearchResultDTO {
	expenses: ExpenseDTO[];
	pagination: PaginationDTO;
	totalSum: number;
	currencyISO: string;
	breakdown: ExpenseBreakdownEntryDTO[];
}

interface ExpenseBreakdownEntryInput {
	category: string | Types.ObjectId;
	subcategory?: string | Types.ObjectId | null;
	sum: number;
	count: number;
}

/**
 * Builds a DTO of the result of a search of expenses
 */
export const expenseSearchDTO = (
	expenses: ExpenseDTO[],
	pagination: PaginationDTO,
	totalSum: number,
	currencyISO: string,
	breakdown: ExpenseBreakdownEntryInput[]
): ExpenseSearchResultDTO => {
	return {
		expenses,
		pagination,
		totalSum: roundToTwoDecimals(totalSum),
		currencyISO,
		breakdown: breakdown.map((entry) => ({
			category: entry.category.toString(),
			subcategory: entry.subcategory?.toString() ?? null,
			sum: roundToTwoDecimals(entry.sum),
			count: entry.count
		}))
	};
};

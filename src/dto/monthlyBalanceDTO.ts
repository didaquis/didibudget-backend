import type { Types } from 'mongoose';

import { MonthValue } from '#/data/Month.js';
import { getMonthName } from '#/helpers/monthlyBalanceMonth.js';

export interface MonthlyBalanceDTO {
	balance: string;
	year: number;
	month: MonthValue;
	currencyISO: string;
	uuid: string;
}

interface MonthlyBalanceDTOInput {
	balance: Types.Decimal128;
	year: number;
	month: number;
	currencyISO: string;
	uuid: string;
}

/**
 * Builds a DTO of monthly balance
 */
export const monthlyBalanceDTO = (monthlyBalance: MonthlyBalanceDTOInput): MonthlyBalanceDTO => {
	return {
		balance: monthlyBalance.balance.toString(),
		year: monthlyBalance.year,
		month: getMonthName(monthlyBalance.month),
		currencyISO: monthlyBalance.currencyISO,
		uuid: monthlyBalance.uuid
	};
};

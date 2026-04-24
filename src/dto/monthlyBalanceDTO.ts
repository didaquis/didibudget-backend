import type { Types } from 'mongoose';

export interface MonthlyBalanceDTO {
	balance: string;
	date: string;
	currencyISO: string;
	uuid: string;
}

interface MonthlyBalanceDTOInput {
	balance: number | string | Types.Decimal128;
	date: string | Date;
	currencyISO: string;
	uuid: string;
}

/**
 * Builds a DTO of monthly balance
 */
export const monthlyBalanceDTO = (monthlyBalance: MonthlyBalanceDTOInput): MonthlyBalanceDTO => {
	return {
		balance: monthlyBalance.balance.toString(),
		date: monthlyBalance.date as string,
		currencyISO: monthlyBalance.currencyISO,
		uuid: monthlyBalance.uuid
	};
};

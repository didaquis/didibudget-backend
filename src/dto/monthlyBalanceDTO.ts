export interface MonthlyBalanceDTO {
	balance: string;
	date: string;
	currencyISO: string;
	uuid: string;
}

/**
 * Builds a DTO of monthly balance
 */
export const monthlyBalanceDTO = (monthlyBalance: {
	balance: number | string;
	date: string;
	currencyISO: string;
	uuid: string;
}): MonthlyBalanceDTO => {
	return {
		balance: monthlyBalance.balance.toString(),
		date: monthlyBalance.date,
		currencyISO: monthlyBalance.currencyISO,
		uuid: monthlyBalance.uuid
	};
};

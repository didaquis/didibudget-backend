'use strict';

/**
 * Builds a DTO of monthly balance
 * @param {MonthlyBalance} monthlyBalance - A Monthly Balance
 * @returns {Object}
 */
const monthlyBalanceDTO = (monthlyBalance) => {
	return {
		balance: monthlyBalance.balance.toString(),
		date: monthlyBalance.date,
		currencyISO: monthlyBalance.currencyISO,
		uuid: monthlyBalance.uuid
	};
};

module.exports = { monthlyBalanceDTO };

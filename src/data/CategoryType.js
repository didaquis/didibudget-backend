'use strict';

/**
 * Available category types
 * @readonly
 * @enum {string}
 * @property {string} EXPENSE    	- Regular expenses
 * @property {string} INVESTMENT 	- Investments and assets (investment portfolio)
 * @property {string} PENSION_PLAN 	- Pension plan contributions
 */
const CategoryType = Object.freeze({
	EXPENSE: 'expense',
	INVESTMENT: 'investment',
	PENSION_PLAN: 'pension_plan'
});

module.exports = { CategoryType };

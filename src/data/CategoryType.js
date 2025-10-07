'use strict';

/**
 * Available category types
 * @readonly
 * @enum {string}
 * @property {string} EXPENSE    - Regular expenses
 * @property {string} INVESTMENT - Investments and assets (investment portfolio)
 * @property {string} SAVING     - Savings and reserves (retirement plan)
 */
const CategoryType = Object.freeze({
	EXPENSE: 'expense',
	INVESTMENT: 'investment',
	SAVING: 'saving'
});

module.exports = { CategoryType };

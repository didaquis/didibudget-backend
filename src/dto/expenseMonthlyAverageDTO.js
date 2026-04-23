'use strict';

import { roundToTwoDecimals } from '../helpers/roundToTwoDecimals.js';

/**
 * Builds a DTO of ExpensesMonthlyAverage
 * 	@param {number} average
 *  @param {string} currencyISO
 * @returns {Object}
 */
const expenseMonthlyAverageDTO = (average, currencyISO) => {
	return {
		average: roundToTwoDecimals(average),
		currencyISO
	};
};

export { expenseMonthlyAverageDTO };

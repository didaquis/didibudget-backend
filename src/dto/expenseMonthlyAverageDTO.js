'use strict';

const { roundToTwoDecimals } = require('../helpers/roundToTwoDecimals');

/**
 * Builds a DTO of expense
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

module.exports = { expenseMonthlyAverageDTO };

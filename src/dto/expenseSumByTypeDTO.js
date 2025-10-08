'use strict';


/**
 * Builds a DTO for ExpenseSumByType
 * @param {string} categoryType
 * @param {string} currencyISO
 * @param {number} sum
 * @returns {Object}
 */
const expenseSumByTypeDTO = (categoryType, currencyISO, sum) => {
	return {
		categoryType,
		currencyISO,
		sum: sum
	};
};

module.exports = { expenseSumByTypeDTO };

'use strict';

/**
 * Rounds a number to 2 decimal places safely. Returns 0 if the input is not a valid number.
 * @param value The number to round
 * @returns The rounded number
 */
const roundToTwoDecimals = (value) => {
	const num = Number(value);

	if (isNaN(num)) {

		return 0;
	}

	const decimals = 2;
	return Number(num.toFixed(decimals));
};

module.exports = { roundToTwoDecimals };

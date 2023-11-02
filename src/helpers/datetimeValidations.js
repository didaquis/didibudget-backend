'use strict';

const { UserInputError } = require('apollo-server-express');

/**
 * Datetime validations repository
 * @typedef {Object}
 */
const datetimeValidations = {

	/**
	 * Check if date provided is valid
	 * @param {Date|string|number} value - A date value
	 */
	ensureDateIsValid: (value) => {
		const date = new Date(value);

		if (isNaN(date.getTime())) {
			throw new UserInputError('The date provided is not valid');
		}
	},

	/**
	 * Check if a date is earlier than other
	 * @param {Date} startDate - A date value
	 * @param {Date} endDate - A date value
	 */
	ensureStartDateIsEarlierThanEndDate: (startDate, endDate) => {
		if (startDate >= endDate) {
			throw new UserInputError('The start date is not earlier than the end date');
		}
	}
};

/* Datetime validations repository */
module.exports = { datetimeValidations };
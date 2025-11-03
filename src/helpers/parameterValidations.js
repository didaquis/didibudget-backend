'use strict';

const { UserInputError } = require('apollo-server-express');

/**
* Parameter validations repository
* @typedef {Object}
*/
const parameterValidations = {
	/**
	* Check if the parameter is include in enum pattern object
	* @param {any} value - value to validate
	* @param {object} enumObj - object with valid values (enum pattern)
	* @throws {UserInputError} If value is not included in the enum object
	*/
	isValidEnumValue: (value, enumObj) => {
		if (!Object.values(enumObj).includes(value)) {
			throw new UserInputError(`Invalid parameter. Allowed values are: ${Object.values(enumObj).join(', ')}`);
		}
	},

	/**
	* Check if the parameter is an integer between min and max (inclusive) in enum pattern object
	* @param {number} value
	* @param {number} min
	* @param {number} max
	* @throws {UserInputError} If value is not an integer between min and max (inclusive)
	*/
	isIntegerBetween: (value, min, max) => {
		if (!Number.isInteger(value)) {
			throw new UserInputError('The value provided should be an integer');
		}

		if (value < min || value > max) {
			throw new UserInputError(`The value provided should be an integer between ${min} and ${max}`);
		}
	},
};

/* Paging validations repository */
module.exports = { parameterValidations };
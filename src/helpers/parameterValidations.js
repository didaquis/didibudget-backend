'use strict';

const { UserInputError } = require('apollo-server-express');

/**
* Parameter validations repository
* @typedef {Object}
*/
const parameterValidations = {
	/**
	* Check if the parameter is include on enum pattern object
	* @param {any} value - value to validate
	* @param {object} enumObj - object with valid values (enum pattern)
	*/
	isValidEnumValue: (value, enumObj) => {
		if (!Object.values(enumObj).includes(value)) {
			throw new UserInputError(`Invalid parameter. Allowed values are: ${Object.values(enumObj).join(', ')}`);
		}
	},
};

/* Paging validations repository */
module.exports = { parameterValidations };
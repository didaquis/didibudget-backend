'use strict';

const { UserInputError } = require('apollo-server-express');

/**
 * Paging validations repository
 * @typedef {Object}
 */
const pagingValidations = {
	/**
	 * Check if the page value is valid. Should be greather than zero
	 * @param {number} page - The number of page
	 * @throws {UserInputError} If value is not allowed
	 */
	ensurePageValueIsValid: (page) => {
		if (!Number.isInteger(page) || Number(page) <= 0) {
			throw new UserInputError('The page value should be an integer greather than 0');
		}
	},

	/**
	 * Check if the page size value is valid. Should be an integer within the supported range
	 * @param {number} pageSize	- The page size
	 * @throws {UserInputError} If value is not allowed
	 */
	ensurePageSizeValueIsValid: (pageSize) => {
		const minPageSizeAllowed = 10;
		const maxPageSizeAllowed = 100;
		if (!Number.isInteger(pageSize) || Number(pageSize) < minPageSizeAllowed || Number(pageSize) > maxPageSizeAllowed) {
			throw new UserInputError(`The page size value should be an integer between ${minPageSizeAllowed} and ${maxPageSizeAllowed}`);
		}
	},
};

/* Paging validations repository */
module.exports = { pagingValidations };
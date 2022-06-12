'use strict';

const { SyntaxError } = require('apollo-server-express');

/**
 * Paging validations repository
 * @typedef {Object}
 */
const pagingValidations = {
	/**
	 * Check if the page value is valid. Should be greather than zero
	 * @param {number} page 	- The number of page
	 */
	ensurePageValueIsValid: (page) => {
		if (!Number.isInteger(page) || Number(page) <= 0) {
			throw new SyntaxError('The page value should be an integer greather than 0');
		}
	},

	/**
	 * Check if the page size value is valid. Should be an integer between twenty and one hundred
	 * @param {number} pageSize	- The page size
	 */
	ensurePageSizeValueIsValid: (pageSize) => {
		const minPageSizeAllowed = 20;
		const maxPageSizeAllowed = 100;
		if (!Number.isInteger(pageSize) || Number(pageSize) < minPageSizeAllowed || Number(pageSize) > maxPageSizeAllowed) {
			throw new SyntaxError(`The page size value should be an integer between ${minPageSizeAllowed} and ${maxPageSizeAllowed}`);
		}
	},
};

/* Paging validations repository */
module.exports = { pagingValidations };
'use strict';

/**
 * Calc the offset value from the pagination parameters
 * @param {number} page 		- The number of page
 * @param {number} pageSize 	- The value of page size
 * @returns {number}
 */
const getOffset = (page, pageSize) => {
	const offsetAdjustement = 1;
	return (page - offsetAdjustement) * pageSize;
};

/**
 * Calc the number of pages from the total count and page size
 * @param {number} totalCount	- The total count of results
 * @param {number} pageSize		- The page size
 * @returns {number}
 */
const getNumberOfPages = (totalCount, pageSize) => {
	return Math.ceil(totalCount / pageSize);
};

module.exports = { getOffset, getNumberOfPages };
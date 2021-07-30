'use strict';

/* Home doc */
/**
 * @file Environment options available for the application
 * @see module:enrironment
 */

/* Module doc */
/**
 * Environment options available for the application
 * @module enrironment
 */


/**
 *  Environments options
 * @typedef ENVIRONMENT
 * @type {Object}
 */
const ENVIRONMENT = Object.freeze({
	DEVELOPMENT: 'development',
	PRODUCTION: 'production'
});

module.exports = { ENVIRONMENT };
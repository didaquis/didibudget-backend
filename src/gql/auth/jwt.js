'use strict';

const jwt = require('jsonwebtoken');

const { securityVariablesConfig } = require('../../config/appConfig');

/**
 * Create a new JSON Web Token
 * @param {Object} 		userData 			- Payload object
 * @param {string} 		userData.email 		- Payload data: User email
 * @param {boolean} 	userData.isAdmin 	- Payload data: If user is admin or not
 * @param {boolean} 	userData.isActive 	- Payload data: If user is active or not
 * @param {string} 		userData.uuid 		- Payload data: An uuid token
 * @param {string} 		secret 				- Secret or private key
 * @param {string} 		[timeOfExpiration] 	- Time of token expiration. Default value '2h'
 * @returns	{string}						- Json Web Token
 */
const createAuthToken = ({ email, isAdmin, isActive, uuid }, secret, timeOfExpiration = '2h') => {
	return jwt.sign({ email, isAdmin, isActive, uuid }, secret, { expiresIn: timeOfExpiration });
};

/**
 * Validate an existing JSON Web Token and retrieve data from payload
 * @param {string} token - A token
 * @returns {Object}       - User data retrieved from payload
 */
const validateAuthToken = async (token) => {
	const user = await jwt.verify(token, securityVariablesConfig.secret);
	return user;
};

module.exports = { createAuthToken, validateAuthToken };

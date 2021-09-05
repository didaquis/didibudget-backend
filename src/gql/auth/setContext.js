'use strict';

const { validateAuthToken } = require('./jwt');
const { enviromentVariablesConfig } = require('../../config/appConfig');
const { ENVIRONMENT } = require('../../config/environment');
const { logger } = require('../../helpers/logger');

const models = require('../../data/models/index');

/**
 * Context function from Apollo Server
 */
const setContext = async ({ req }) => {
	const context = {
		di: {
			models: {
				...models
			}
		}
	};

	let token = req.headers['authorization'];

	if (token && typeof token === 'string') {
		try {
			const authenticationScheme = 'Bearer ';
			if (token.startsWith(authenticationScheme)) {
				token = token.slice(authenticationScheme.length, token.length);
			}
			const user = await validateAuthToken(token);
			context.user = user; // Add to Apollo Server context the user who is doing the request if auth token is provided and it's a valid token
		} catch (error) {
			if (enviromentVariablesConfig.enviroment !== ENVIRONMENT.PRODUCTION) {
				logger.debug(error.message);
			}
		}
	}

	return context;
};

module.exports = { setContext };
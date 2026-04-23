'use strict';

import { validateAuthToken, createAuthToken } from './jwt.js';
import { environmentVariablesConfig } from '../../config/appConfig.js';
import { authValidations } from '../auth/authValidations.js';
import { pagingValidations } from '../../helpers/pagingValidations.js';
import { datetimeValidations } from '../../helpers/datetimeValidations.js';
import { parameterValidations } from '../../helpers/parameterValidations.js';
import { ENVIRONMENT } from '../../config/environment.js';
import { logger } from '../../helpers/logger.js';

import * as models from '../../data/models/index.js';

/**
 * Context function from Apollo Server
 */
const setContext = async ({ req }) => {
	const context = {
		di: {
			model: {
				...models
			},
			jwt: {
				createAuthToken: createAuthToken
			},
			authValidation: {
				...authValidations
			},
			pagingValidation: {
				...pagingValidations
			},
			datetimeValidation: {
				...datetimeValidations
			},
			parameterValidations: {
				...parameterValidations
			},
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
			if (environmentVariablesConfig.environment !== ENVIRONMENT.PRODUCTION) {
				logger.debug(error.message);
			}
		}
	}

	return context;
};

export { setContext };

import { validateAuthToken, createAuthToken } from './jwt.js';
import { environmentVariablesConfig } from '#/config/appConfig.js';
import { authValidations } from './authValidations.js';
import { pagingValidations } from '#/helpers/pagingValidations.js';
import { datetimeValidations } from '#/helpers/datetimeValidations.js';
import { parameterValidations } from '#/helpers/parameterValidations.js';
import { ENVIRONMENT } from '#/config/environment.js';
import { logger } from '#/helpers/logger.js';

import * as models from '#/data/models/index.js';

export interface Context {
	req?: {
		headers: {
			authorization?: string;
		};
	};
	user?: any;
	di: {
		model: Record<string, any>;
		jwt: {
			createAuthToken: (email: string, isAdmin: boolean, isActive: boolean, uuid: string, registrationDate: string) => string;
		};
		authValidation: {
			ensureLimitOfUsersIsNotReached: (numberOfCurrentlyUsersRegistered: number, usersLimit: number) => void;
			ensureThatUserIsLogged: (context: Context) => void;
			getUser: (context: Context) => Promise<any | null>;
			ensureThatUserIsAdministrator: (context: Context) => void;
		};
		pagingValidation: {
			ensurePageValueIsValid: (page: unknown) => void;
			ensurePageSizeValueIsValid: (pageSize: unknown) => void;
		};
		datetimeValidation: {
			ensureDateIsValid: (value: unknown) => void;
			ensureStartDateIsEarlierThanEndDate: (startDate: Date | string, endDate: Date | string) => void;
		};
		parameterValidations: {
			isValidEnumValue: (value: unknown, enumObj: Record<string, unknown>) => void;
			isIntegerBetween: (value: unknown, min: number, max: number) => void;
		};
	};
}

/**
 * Context function from Apollo Server
 */
const setContext = async ({ req }: { req: { headers: { authorization?: string } } }): Promise<Context> => {
	const context: Context = {
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
				logger.debug((error as Error).message);
			}
		}
	}

	return context;
};

export { setContext };

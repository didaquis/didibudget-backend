import { validateAuthToken, createAuthToken } from './jwt.js';
import type { JwtTokenPayload } from './jwt.js';
import { environmentVariablesConfig } from '#/config/appConfig.js';
import { authValidations } from './authValidations.js';
import { pagingValidations } from '#/helpers/pagingValidations.js';
import { datetimeValidations } from '#/helpers/datetimeValidations.js';
import { parameterValidations } from '#/helpers/parameterValidations.js';
import { rateLimitValidations } from '#/helpers/rateLimitValidations.js';
import { ENVIRONMENT } from '#/config/environment.js';
import { logger } from '#/helpers/logger.js';
import type { ExpressContextFunctionArgument } from '@as-integrations/express4';

import * as models from '#/data/models/index.js';
import type { ModelsMap, IUser } from '#/data/models/index.js';

/**
 * Application context produced by setContext and available in all resolvers via the context argument.
 */
export interface Context {
	user?: JwtTokenPayload;
	/** Client IP of the incoming request, used as the key for login rate limiting. */
	clientIp?: string;
	di: {
		model: ModelsMap;
		jwt: {
			createAuthToken: (email: string, isAdmin: boolean, isActive: boolean, uuid: string, registrationDate: Date) => string;
		};
		authValidation: {
			ensureLimitOfUsersIsNotReached: (numberOfCurrentlyUsersRegistered: number, usersLimit: number) => void;
			ensureThatUserIsLogged: (context: Context) => void;
			getUser: (context: Context) => Promise<IUser>;
			ensureThatUserIsAdministrator: (context: Context) => void;
		};
		rateLimitValidation: {
			ensureLoginRateLimitNotExceeded: (key: string) => Promise<void>;
			ensureRegisterRateLimitNotExceeded: (key: string) => Promise<void>;
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
 * Context function for Apollo Server. Receives the Express request/response pair and returns
 * the application context available to all resolvers.
 */
const setContext = async ({ req }: ExpressContextFunctionArgument): Promise<Context> => {
	const context: Context = {
		di: {
			model: models,
			jwt: {
				createAuthToken: createAuthToken
			},
			authValidation: {
				...authValidations
			},
			rateLimitValidation: {
				...rateLimitValidations
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

	// req.ip is resolved from X-Forwarded-For thanks to the Express "trust proxy" setting (see server.ts).
	context.clientIp = req.ip ?? req.socket?.remoteAddress ?? 'unknown';

	let token = req.headers['authorization'];

	if (token && typeof token === 'string') {
		try {
			const authenticationScheme = 'Bearer ';
			if (token.startsWith(authenticationScheme)) {
				token = token.slice(authenticationScheme.length, token.length);
			}
			context.user = validateAuthToken(token); // Add to Apollo Server context the user who is doing the request if auth token is provided and it's a valid token
		} catch (error) {
			if (environmentVariablesConfig.environment !== ENVIRONMENT.PRODUCTION) {
				logger.debug((error as Error).message);
			}
		}
	}

	return context;
};

export { setContext };

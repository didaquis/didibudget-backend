import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

import { securityVariablesConfig } from '#/config/appConfig.js';

/**
 * Shape of the payload encoded in auth tokens issued by this application.
 * `registrationDate` is serialized as an ISO string by jwt.sign (Date → JSON → string).
 */
export interface JwtTokenPayload extends JwtPayload {
	email: string;
	isAdmin: boolean;
	isActive: boolean;
	uuid: string;
	registrationDate: string;
}

/**
 * Create a new JSON Web Token
 */
const createAuthToken = (email: string, isAdmin: boolean, isActive: boolean, uuid: string, registrationDate: Date): string => {
	return jwt.sign(
		{ email, isAdmin, isActive, uuid, registrationDate },
		securityVariablesConfig.secret,
		{ expiresIn: securityVariablesConfig.timeExpiration }
	);
};

/**
 * Validate an existing JSON Web Token and retrieve data from payload.
 * Returns the decoded payload, or throws if the token is invalid or expired.
 */
const validateAuthToken = (token: string): JwtTokenPayload => {
	const decoded = jwt.verify(token, securityVariablesConfig.secret);
	if (typeof decoded === 'string') {
		throw new Error('Unexpected string payload from jwt.verify');
	}
	return decoded as JwtTokenPayload;
};

export { createAuthToken, validateAuthToken };

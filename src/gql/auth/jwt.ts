import jwt from 'jsonwebtoken';

import { securityVariablesConfig } from '#/config/appConfig.js';

/**
 * Create a new JSON Web Token
 */
const createAuthToken = (email: string, isAdmin: boolean, isActive: boolean, uuid: string, registrationDate: Date): string => {
	return jwt.sign({ email, isAdmin, isActive, uuid, registrationDate }, securityVariablesConfig.secret, { expiresIn: securityVariablesConfig.timeExpiration } as jwt.SignOptions);
};

/**
 * Validate an existing JSON Web Token and retrieve data from payload
 */
const validateAuthToken = async (token: string): Promise<jwt.JwtPayload | string> => {
	const user = await jwt.verify(token, securityVariablesConfig.secret);
	return user;
};

export { createAuthToken, validateAuthToken };

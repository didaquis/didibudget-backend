/**
 * Environment options available for the application
 */

export const ENVIRONMENT = Object.freeze({
	DEVELOPMENT: 'development',
	PRODUCTION: 'production'
} as const);

export type Environment = typeof ENVIRONMENT[keyof typeof ENVIRONMENT];

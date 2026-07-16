import { GraphQLError } from 'graphql';

/**
 * Application error types.
 *
 * These replace the error classes previously provided by apollo-server-errors
 * (removed in Apollo Server v4+). Each one sets the same `extensions.code` that
 * apollo-server-errors assigned, so the API error contract — and any client that
 * branches on `error.extensions.code` — keeps working unchanged after the migration.
 */

/**
 * Missing or invalid authentication. Serialized with code `UNAUTHENTICATED`.
 */
export class AuthenticationError extends GraphQLError {
	constructor(message: string) {
		super(message, { extensions: { code: 'UNAUTHENTICATED' } });
		this.name = 'AuthenticationError';
	}
}

/**
 * Authenticated but not allowed to perform the action. Serialized with code `FORBIDDEN`.
 */
export class ForbiddenError extends GraphQLError {
	constructor(message: string) {
		super(message, { extensions: { code: 'FORBIDDEN' } });
		this.name = 'ForbiddenError';
	}
}

/**
 * Invalid user input. Serialized with code `BAD_USER_INPUT`.
 */
export class UserInputError extends GraphQLError {
	constructor(message: string) {
		super(message, { extensions: { code: 'BAD_USER_INPUT' } });
		this.name = 'UserInputError';
	}
}

/**
 * Failed business-logic validation. Serialized with code `GRAPHQL_VALIDATION_FAILED`.
 */
export class ValidationError extends GraphQLError {
	constructor(message: string) {
		super(message, { extensions: { code: 'GRAPHQL_VALIDATION_FAILED' } });
		this.name = 'ValidationError';
	}
}

'use strict';

const { GraphQLError } = require('graphql');

class AuthenticationError extends GraphQLError {
	constructor (message) {
		super(message, { extensions: { code: 'UNAUTHENTICATED' } });
		this.name = 'AuthenticationError';
	}
}

module.exports = AuthenticationError;
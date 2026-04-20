'use strict';

const { GraphQLError } = require('graphql');

class ForbiddenError extends GraphQLError {
	constructor (message) {
		super(message, { extensions: { code: 'FORBIDDEN' } });
		this.name = 'ForbiddenError';
	}
}

module.exports = ForbiddenError;
'use strict';

const { GraphQLError } = require('graphql');

class ValidationError extends GraphQLError {
	constructor (message) {
		super(message, { extensions: { code: 'VALIDATION_ERROR' } });
		this.name = 'ValidationError';
	}
}

module.exports = ValidationError;
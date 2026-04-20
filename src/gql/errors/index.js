'use strict';

const AuthenticationError = require('./AuthenticationError');
const ForbiddenError = require('./ForbiddenError');
const ValidationError = require('./ValidationError');

module.exports = {
	AuthenticationError,
	ForbiddenError,
	ValidationError,
};
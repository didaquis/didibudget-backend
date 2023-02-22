'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type User {
		email: String
		isAdmin: Boolean
		isActive: Boolean
		uuid: String
		registrationDate: String
		lastLogin: String
	}

	type Query {
		""" Get list of users """
		listAllUsers: [User]
	}
`;

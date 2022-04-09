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
		""" Get list of all users registered on database """
		listAllUsers: [User]
	}

	type Mutation {
		""" It allows register a monthly balance """
		registerMonthlyBalance(balance: Float!, date: String!): MonthlyBalance

		""" It allows delete a register of monthly balance """
		deleteMonthlyBalance(uuid: String!): MonthlyBalance

		""" It allows delete all registers of monthly balance """
		deleteAllMonthlyBalances: DeleteResult
	}
`;

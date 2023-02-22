'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type MonthlyBalance {
		user_id: ID!
		balance: Float!
		date: String!
		currencyISO: String!
		uuid: String!
	}

	type Query {
		""" Get list of all monthly balance registers from an specific user """
		getMonthlyBalances: [MonthlyBalance]
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

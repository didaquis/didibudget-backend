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

	type PaginatedMonthlyBalances {
		monthlyBalances: [MonthlyBalance]
		pagination: PaginationData
	}

	type Query {
		""" Get list of all monthly balances registers from an specific user """
		getMonthlyBalances: [MonthlyBalance]

		""" Get list of monthly balances registers from an specific user using pagination """
		getMonthlyBalancesWithPagination(page: Int!, pageSize: Int!): PaginatedMonthlyBalances
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

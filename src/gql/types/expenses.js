'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type Expense {
		user_id: ID!
		category: ID!
		subcategory: ID
		quantity: Float!
		date: String!
		currencyISO: String!
		uuid: String!
	}

	type PaginatedExpenses {
		expenses: [Expense]
		pagination: PaginationData
	}

	type Query {
		""" Get list of expenses for a specific user """
		getExpenses: [Expense]

		""" Get list of expenses for a specific user using pagination """
		getExpensesWithPagination(page: Int!, pageSize: Int!): PaginatedExpenses
	}

	type Mutation {
		""" It allows register an expense """
		registerExpense(category: ID!, subcategory: ID, quantity: Float!, date: String!): Expense

		""" It allows delete an expense """
		deleteExpense(uuid: String!): Expense

		""" It allows delete all expenses """
		deleteAllExpenses: DeleteResult
	}
`;

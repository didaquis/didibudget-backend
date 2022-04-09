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

	type Query {
		""" Get list of all expense registers from an specific user """
		getExpenses: [Expense]
	}

	type Mutation {
		""" It allows register an expense """
		registerExpense(category: ID!, subcategory: ID, quantity: Float!, date: String!): Expense

		""" It allows delete a register of expense """
		deleteExpense(uuid: String!): Expense

		""" It allows delete all registers of expense """
		deleteAllExpenses: DeleteResult
	}
`;

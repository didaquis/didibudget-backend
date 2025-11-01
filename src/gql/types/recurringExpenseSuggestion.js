'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type RecurringExpenseSuggestion {
		isActive: Boolean!
		startDay: Int!
		endDay: Int!
		uuid: String!
		suggestedExpense: SuggestedExpense!
	}

	type SuggestedExpense {
		category: ID!
		subcategory: ID
		quantity: Float!
	}

	type Query {
		""" Get list of recurring expense suggestion for a specific user """
		getRecurringExpenseSuggestion: [RecurringExpenseSuggestion]
	}

	input SuggestedExpenseInput {
		category: ID!
		subcategory: ID
		quantity: Float!
	}

	type Mutation {
		""" It allows register a recurring expense suggestion """
		registerRecurringExpenseSuggestion(isActive: Boolean!, startDay: Int!, endDay: Int!, suggestedExpense: SuggestedExpenseInput!): RecurringExpenseSuggestion
	}
`;

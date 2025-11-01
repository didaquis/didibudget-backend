'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type RecurringExpenseSuggestion {
		user_id: ID!
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

	type Mutation {
		""" It allows register a recurring expense suggestion """
		registerRecurringExpenseSuggestion(): RecurringExpenseSuggestion
	}
`;

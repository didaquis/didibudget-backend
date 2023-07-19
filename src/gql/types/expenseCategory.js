'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type ExpenseCategory {
		_id: ID!
		name: String!
		subcategories: [ExpenseSubcategory]!
		emojis: [String]!
		uuid: String!
	}

	type ExpenseSubcategory {
		_id: ID!
		name: String!
		emojis: [String]!
		uuid: String!
	}

  	type Query {
		""" Get list of expense categories """
		getExpenseCategory: [ExpenseCategory]

		""" Get an expense category by id """
		getExpenseCategoryById(category: ID!): ExpenseCategory
	}
`;

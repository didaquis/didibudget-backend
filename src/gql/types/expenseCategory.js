'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	enum CategoryType {
		expense
		investment
		pension_plan
	}

	type ExpenseCategory {
		_id: ID!
		name: String!
		subcategories: [ExpenseSubcategory]!
		emojis: [String]!
		uuid: String!
		categoryType: CategoryType!
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

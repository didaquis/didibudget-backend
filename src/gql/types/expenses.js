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

	type ExpenseSumByType {
		categoryType: String!
		currencyISO: String!
		sum: Float!
	}

	type ExpensesMonthlyAverage {
		average: Float!
		currencyISO: String!
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

		""" Get list of expenses for a specific user between two dates """
		getExpensesBetweenDates(startDate: String!, endDate: String!): [Expense]
		
		""" Get the total expenses of a specific type for a user """
		getExpensesSumByType(categoryType: CategoryType!): ExpenseSumByType!

		""" Get the average monthly expenses for a user over the last N months (excluding the current month), optionally ignoring expenses of specified category types. """
		getExpensesMonthlyAverage(lastNMonths: Int!, excludedCategoryTypes: [CategoryType!]!): ExpensesMonthlyAverage!
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

const expenseCategory: string = `
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

	type MostUsedExpenseCategory {
		category: ID!
		categoryName: String!
		categoryEmojis: [String]!
		subcategory: ID
		subcategoryName: String
		subcategoryEmojis: [String]!
		total: Int!
	}

  	type Query {
		""" Get list of expense categories """
		getExpenseCategory: [ExpenseCategory]

		""" Get an expense category by id """
		getExpenseCategoryById(category: ID!): ExpenseCategory

		""" Get the expense categories this user has used the most within a period """
		getMostUsedExpenseCategories(days: Int = 90, limit: Int = 6): [MostUsedExpenseCategory]!
	}
`;

export default expenseCategory;

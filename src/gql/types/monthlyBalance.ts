const monthlyBalance: string = `
	enum Month {
		JANUARY
		FEBRUARY
		MARCH
		APRIL
		MAY
		JUNE
		JULY
		AUGUST
		SEPTEMBER
		OCTOBER
		NOVEMBER
		DECEMBER
	}

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
		""" Get list of monthly balances for a specific user """
		getMonthlyBalances: [MonthlyBalance]

		""" Get list of monthly balances for a specific user using paging """
		getMonthlyBalancesWithPagination(page: Int!, pageSize: Int!): PaginatedMonthlyBalances
	}

	type Mutation {
		""" It allows register a monthly balance """
		registerMonthlyBalance(balance: Float!, year: Int!, month: Month!): MonthlyBalance

		""" It allows delete a monthly balance """
		deleteMonthlyBalance(uuid: String!): MonthlyBalance

		""" It allows delete all monthly balances """
		deleteAllMonthlyBalances: DeleteResult
	}
`;

export default monthlyBalance;

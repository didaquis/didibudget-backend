const shared: string = `
	""" Delete Result """
	type DeleteResult {
		deletedCount: Int!
	}

	""" Pagination data """
	type PaginationData {
		currentPage: Int!
		totalPages: Int!
		totalCount: Int!
	}
`;

export default shared;

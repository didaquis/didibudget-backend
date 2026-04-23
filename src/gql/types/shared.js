'use strict';

import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
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

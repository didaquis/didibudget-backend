'use strict';

const gql = require('graphql-tag');

module.exports = /* GraphQL */ gql`
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

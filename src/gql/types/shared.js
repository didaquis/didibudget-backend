'use strict';

const { gql } = require('apollo-server-express');

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
	# """ Pagination data """
	# type PaginationData {
	# 	count: Int!
	# 	totalCount: Int!
	# }
`;

'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	""" Delete Result """
	type DeleteResult {
		deletedCount: Int!
	}
`;
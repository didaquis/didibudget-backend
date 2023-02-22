'use strict';

const { gql } = require('apollo-server-express');

module.exports = /* GraphQL */ gql`
	type Token {
		token: String
	}

	type Mutation {
		""" It allows register an user """
		registerUser(email: String!, password: String!): Token

		""" It allows users to authenticate """
		authUser(email: String!, password: String!): Token

		""" It allows users to delete their account permanently """
		deleteMyUserAccount: DeleteResult
	}
`;

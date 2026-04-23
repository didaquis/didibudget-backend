'use strict';

import { gql } from 'apollo-server-express';

export default /* GraphQL */ gql`
	type User {
		email: String
		isAdmin: Boolean
		isActive: Boolean
		uuid: String
		registrationDate: String
		lastLogin: String
	}

	type Query {
		""" Get list of users """
		listAllUsers: [User]
	}
`;

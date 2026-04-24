const users: string = `
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

export default users;

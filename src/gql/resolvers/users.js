'use strict';

const { authValidations } = require('../auth/authValidations');

/**
 * All resolvers related to users
 * @typedef {Object}
 */
module.exports = {
	Query: {
		/**
		 * It allows to administrators to list all users registered
		 */
		listAllUsers:  async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			authValidations.ensureThatUserIsAdministrator(context);

			const allUsers = await context.di.model.Users.find({}).lean();
			return allUsers;
		}
	},
	Mutation: {
	}
};

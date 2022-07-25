'use strict';

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
			context.di.authValidation.ensureThatUserIsLogged(context);

			context.di.authValidation.ensureThatUserIsAdministrator(context);

			const sortCriteria = { isAdmin: 'desc', registrationDate: 'asc' };
			return context.di.model.Users.find().sort(sortCriteria).lean();
		}
	},
	Mutation: {
	}
};

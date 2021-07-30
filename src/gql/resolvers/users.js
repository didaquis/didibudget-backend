'use strict';

const { Users } = require('../../data/models/index');
const { authValidations } = require('../auth/authValidations');

/**
 * All resolvers related to users
 * @type {Object}
 */
module.exports = {
	Query: {
		/**
		 * It allows to administrators users to list all users registered
		 */
		listAllUsers:  async (parent, args, context) => {
			authValidations.ensureThatUserIsLogged(context);

			authValidations.ensureThatUserIsAdministrator(context);

			const allUsers = await Users.find({}).lean();
			return allUsers;
		}
	},
	Mutation: {
	}
};

import { Context } from '../auth/setContext.js';

/**
 * All resolvers related to users
 */
export const Query = {
	/**
	 * It allows to administrators to list all users registered
	 */
	listAllUsers:  async (_parent: unknown, _args: unknown, context: Context): Promise<any[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		context.di.authValidation.ensureThatUserIsAdministrator(context);

		const sortCriteria = { isAdmin: 'desc', registrationDate: 'asc' };
		return context.di.model.Users.find().sort(sortCriteria).lean();
	}
};

export const Mutation = {
};

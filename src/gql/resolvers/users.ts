import { SortValues } from 'mongoose';
import { Context } from '../auth/setContext.js';
import type { IUser } from '#/data/models/index.js';

/**
 * All resolvers related to users
 */
export const Query = {
	/**
	 * It allows to administrators to list all users registered
	 */
	listAllUsers: async (_parent: unknown, _args: unknown, context: Context): Promise<IUser[]> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		context.di.authValidation.ensureThatUserIsAdministrator(context);

		const sortCriteria: Record<string, SortValues> = { isAdmin: 'desc', registrationDate: 'asc' };
		return context.di.model.Users.find().sort(sortCriteria).lean();
	}
};

export const Mutation = {
};

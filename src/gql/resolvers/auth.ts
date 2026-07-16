import { DeleteResult } from 'mongoose';
import { UserInputError } from '#/gql/errors.js';
import bcrypt from 'bcrypt';
import { isValidEmail, isStrongPassword } from '#/helpers/validations.js';
import { globalVariablesConfig } from '#/config/appConfig.js';
import { Context } from '../auth/setContext.js';

/**
 * A valid bcrypt hash that no real password matches. When authentication fails because the
 * account does not exist, the password is still compared against this hash so that the request
 * takes the same time as a comparison against a real user's hash. This prevents attackers from
 * telling registered from unregistered emails by measuring response times (user enumeration).
 */
const DUMMY_PASSWORD_HASH = '$2b$10$DdgJQVj02TFFtsStN1eJguwFzHyWGrHILqfFBjhkHMXZNoSeSqncm';

interface RegisterUserArgs {
	email: string;
	password: string;
}

interface AuthUserArgs {
	email: string;
	password: string;
}

/**
 * All resolvers related to auth
 */
export const Query = {
};

export const Mutation = {
	/**
	 * It allows to users to register as long as the limit of allowed users has not been reached
	 */
	registerUser: async (_parent: unknown, { email, password }: RegisterUserArgs, context: Context): Promise<{ token: string }> => {
		if (!email || !password) {
			throw new UserInputError('Data provided is not valid');
		}

		if (!isValidEmail(email)) {
			throw new UserInputError('The email is not valid');
		}

		if (!isStrongPassword(password)) {
			throw new UserInputError('The password is not secure enough');
		}

		const registeredUsersCount = await context.di.model.Users.find().estimatedDocumentCount();

		context.di.authValidation.ensureLimitOfUsersIsNotReached(registeredUsersCount, globalVariablesConfig.limitOfUsersRegistered);

		const isAnEmailAlreadyRegistered = await context.di.model.Users.findOne({ email }).lean();

		if (isAnEmailAlreadyRegistered) {
			throw new UserInputError('Data provided is not valid');
		}

		await new context.di.model.Users({ email, password }).save();

		const user = await context.di.model.Users.findOne({ email }).lean();

		if (!user) {
			throw new UserInputError('Data provided is not valid');
		}

		return {
			token: context.di.jwt.createAuthToken(user.email, user.isAdmin, user.isActive, user.uuid, user.registrationDate)
		};
	},
	/**
	 * It allows users to authenticate. Users with property isActive with value false are not allowed to authenticate. When an user authenticates the value of lastLogin will be updated
	 */
	authUser: async (_parent: unknown, { email, password }: AuthUserArgs, context: Context): Promise<{ token: string }> => {
		await context.di.rateLimitValidation.ensureLoginRateLimitNotExceeded(context.clientIp ?? 'unknown');

		if (!email || !password) {
			throw new UserInputError('Invalid credentials');
		}

		const user = await context.di.model.Users.findOne({ email, isActive: true }).lean();

		// Always run a bcrypt comparison — against the real hash when the user exists, against a
		// dummy hash otherwise — so response timing does not reveal whether the email is registered.
		const passwordHashToCompare = user ? user.password : DUMMY_PASSWORD_HASH;
		const isCorrectPassword = await bcrypt.compare(password, passwordHashToCompare);

		if (!user || !isCorrectPassword) {
			throw new UserInputError('Invalid credentials');
		}

		await context.di.model.Users.findOneAndUpdate({ email }, { lastLogin: new Date() }, { new: true }).lean();

		return {
			token: context.di.jwt.createAuthToken(user.email, user.isAdmin, user.isActive, user.uuid, user.registrationDate)
		};
	},
	/**
	 * It allows to user to delete their account permanently (this action does not delete the records associated with the user, it only deletes their user account)
	 */
	deleteMyUserAccount: async (_parent: unknown, _args: unknown, context: Context): Promise<DeleteResult> => {
		context.di.authValidation.ensureThatUserIsLogged(context);

		const user = await context.di.authValidation.getUser(context);

		return context.di.model.Users.deleteOne({ uuid: user.uuid });
	}
};

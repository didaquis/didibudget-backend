import { describe, expect, test, beforeEach, vi } from 'vitest';
import { AuthenticationError, ForbiddenError, ValidationError } from '#/gql/errors.js';
import { Users } from '#/data/models/index.js';
import { authValidations } from '#/gql/auth/authValidations.js';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';

vi.mock('../../../src/data/models/index.js', () => ({
	Users: {
		findOne: vi.fn(() => ({
			lean: vi.fn()
		}))
	}
}));

/** Minimal context with an authenticated user */
const ctxWithUser = (userFields: Partial<JwtTokenPayload>): Context => ({
	user: userFields as JwtTokenPayload,
	di: {} as Context['di'],
});

/** Minimal context without a user */
const ctxWithoutUser = (): Context => ({
	di: {} as Context['di'],
});

describe('authValidations', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('ensureLimitOfUsersIsNotReached', () => {
		test('Should not throw if usersLimit is 0', () => {
			expect(() => authValidations.ensureLimitOfUsersIsNotReached(100, 0)).not.toThrow();
		});

		test('Should not throw if registered users are less than limit', () => {
			expect(() => authValidations.ensureLimitOfUsersIsNotReached(5, 10)).not.toThrow();
		});

		test('Should throw ValidationError if registered users reached the limit', () => {
			expect(() => authValidations.ensureLimitOfUsersIsNotReached(10, 10)).toThrow(ValidationError);
		});

		test('Should throw ValidationError if registered users exceeded the limit', () => {
			expect(() => authValidations.ensureLimitOfUsersIsNotReached(11, 10)).toThrow(ValidationError);
		});

		test('Should throw with correct message', () => {
			expect(() => authValidations.ensureLimitOfUsersIsNotReached(10, 10)).toThrow('The maximum number of users allowed has been reached. You must contact the administrator of the service in order to register');
		});
	});

	describe('ensureThatUserIsLogged', () => {
		test('Should not throw if context contains user', () => {
			expect(() => authValidations.ensureThatUserIsLogged(ctxWithUser({}))).not.toThrow();
		});

		test('Should throw AuthenticationError if context does not contain user', () => {
			expect(() => authValidations.ensureThatUserIsLogged(ctxWithoutUser())).toThrow(AuthenticationError);
		});
	});

	describe('ensureThatUserIsAdministrator', () => {
		test('Should not throw if user is admin', () => {
			expect(() => authValidations.ensureThatUserIsAdministrator(ctxWithUser({ isAdmin: true }))).not.toThrow();
		});

		test('Should throw ForbiddenError if user is not admin', () => {
			expect(() => authValidations.ensureThatUserIsAdministrator(ctxWithUser({ isAdmin: false }))).toThrow(ForbiddenError);
		});

		test('Should throw ForbiddenError if context has no user', () => {
			expect(() => authValidations.ensureThatUserIsAdministrator(ctxWithoutUser())).toThrow(ForbiddenError);
		});
	});

	describe('getUser', () => {
		test('Should throw AuthenticationError if context has no user', async () => {
			await expect(authValidations.getUser(ctxWithoutUser())).rejects.toThrow(AuthenticationError);
		});

		test('Should return user data if found in database', async () => {
			const mockUser = { uuid: 'user-1', email: 'test@test.com' };
			(Users.findOne as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				lean: vi.fn().mockResolvedValueOnce(mockUser)
			});

			const result = await authValidations.getUser(ctxWithUser({ uuid: 'user-1' }));
			expect(result).toEqual(mockUser);
			expect(Users.findOne).toHaveBeenCalledWith({ uuid: 'user-1' });
		});

		test('Should throw AuthenticationError if user is not found in database', async () => {
			(Users.findOne as ReturnType<typeof vi.fn>).mockReturnValueOnce({
				lean: vi.fn().mockResolvedValueOnce(null)
			});

			await expect(authValidations.getUser(ctxWithUser({ uuid: 'missing' }))).rejects.toThrow(AuthenticationError);
		});
	});
});

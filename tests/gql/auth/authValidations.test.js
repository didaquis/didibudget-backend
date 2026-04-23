import { vi, describe, test, expect, beforeEach } from 'vitest';
import { AuthenticationError, ForbiddenError, ValidationError } from 'apollo-server-express';
import { Users } from '../../../src/data/models/index.js';
import { authValidations } from '../../../src/gql/auth/authValidations.js';

vi.mock('../../../src/data/models/index.js', () => ({
	Users: {
		findOne: vi.fn(() => ({
			lean: vi.fn()
		}))
	}
}));

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
			expect(() => authValidations.ensureThatUserIsLogged({ user: {} })).not.toThrow();
		});

		test('Should throw AuthenticationError if context does not contain user', () => {
			expect(() => authValidations.ensureThatUserIsLogged({})).toThrow(AuthenticationError);
		});

		test('Should throw AuthenticationError if user is null', () => {
			expect(() => authValidations.ensureThatUserIsLogged({ user: null })).toThrow(AuthenticationError);
		});
	});

	describe('ensureThatUserIsAdministrator', () => {
		test('Should not throw if user is admin', () => {
			expect(() => authValidations.ensureThatUserIsAdministrator({ user: { isAdmin: true } })).not.toThrow();
		});

		test('Should throw ForbiddenError if user is not admin', () => {
			expect(() => authValidations.ensureThatUserIsAdministrator({ user: { isAdmin: false } })).toThrow(ForbiddenError);
		});

		test('Should throw ForbiddenError if context has no user', () => {
			expect(() => authValidations.ensureThatUserIsAdministrator({})).toThrow(ForbiddenError);
		});
	});

	describe('getUser', () => {
		test('Should return null if context has no user', async () => {
			const result = await authValidations.getUser({});
			expect(result).toBeNull();
		});

		test('Should return user data if found in database', async () => {
			const mockUser = { uuid: 'user-1', email: 'test@test.com' };
			Users.findOne.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockUser) });

			const result = await authValidations.getUser({ user: { uuid: 'user-1' } });
			expect(result).toEqual(mockUser);
			expect(Users.findOne).toHaveBeenCalledWith({ uuid: 'user-1' });
		});

		test('Should throw AuthenticationError if user is not found in database', async () => {
			Users.findOne.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(null) });

			await expect(authValidations.getUser({ user: { uuid: 'missing' } })).rejects.toThrow(AuthenticationError);
		});
	});
});

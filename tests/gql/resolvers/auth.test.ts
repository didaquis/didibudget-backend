import { describe, expect, test, beforeEach, vi } from 'vitest';
import { UserInputError } from '#/gql/errors.js';
import { Mutation } from '#/gql/resolvers/auth.js';
import * as bcryptModule from 'bcrypt';
import { createMockContext, mockUser } from '../../mocks/createMockContext.js';

vi.mock('bcrypt', () => ({
	default: {
		compare: vi.fn().mockResolvedValue(true)
	},
	compare: vi.fn().mockResolvedValue(true)
}));

interface MockUsersModel {
	find: ReturnType<typeof vi.fn>;
	findOne: ReturnType<typeof vi.fn>;
	findOneAndUpdate: ReturnType<typeof vi.fn>;
	deleteOne: ReturnType<typeof vi.fn>;
}

const { mockSave, MockUsersConstructor } = vi.hoisted(() => {
	const mockSave = vi.fn();

	const MockUsersConstructor = vi.fn(function () {
		return { save: mockSave };
	}) as unknown as ReturnType<typeof vi.fn> & MockUsersModel;

	MockUsersConstructor.find = vi.fn();
	MockUsersConstructor.findOne = vi.fn();
	MockUsersConstructor.findOneAndUpdate = vi.fn();
	MockUsersConstructor.deleteOne = vi.fn();

	return { mockSave, MockUsersConstructor };
});

vi.mock('#/data/models/index.js', () => ({
	Users: MockUsersConstructor
}));

const mockStoredUser = {
	...mockUser,
	password: 'hashedPassword',
	isAdmin: false,
	isActive: true,
	registrationDate: new Date('2024-01-01')
};

const createAuthContext = () => createMockContext({ user: mockStoredUser, clientIp: '203.0.113.5' });

const getBcryptCompare = () => {
	const mocked = vi.mocked(bcryptModule.default);
	return mocked.compare as ReturnType<typeof vi.fn>;
};

describe('auth resolvers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getBcryptCompare().mockResolvedValue(true);
	});

	describe('registerUser', () => {
		test('Should throw UserInputError if email is empty', async () => {
			const context = createAuthContext();
			await expect(Mutation.registerUser({}, { email: '', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is empty', async () => {
			const context = createAuthContext();
			await expect(Mutation.registerUser({}, { email: 'test@example.com', password: '' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if email format is invalid', async () => {
			const context = createAuthContext();
			await expect(Mutation.registerUser({}, { email: 'invalid-email', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is weak', async () => {
			const context = createAuthContext();
			await expect(Mutation.registerUser({}, { email: 'test@example.com', password: 'weak' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if email is already registered', async () => {
			const context = createAuthContext();
			const mockFind = vi.fn(() => ({
				estimatedDocumentCount: vi.fn().mockResolvedValueOnce(0)
			}));
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			MockUsersConstructor.find = mockFind;
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.registerUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should return token on successful registration', async () => {
			const context = createAuthContext();
			const mockFind = vi.fn(() => ({
				estimatedDocumentCount: vi.fn().mockResolvedValueOnce(0)
			}));
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(null) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockStoredUser) });
			MockUsersConstructor.find = mockFind;
			MockUsersConstructor.findOne = mockFindOne;

			mockSave.mockResolvedValueOnce(mockStoredUser);

			const result = await Mutation.registerUser({}, { email: 'new@example.com', password: 'Valid1Pass' }, context);

			expect(result).toHaveProperty('token');
			expect(typeof result.token).toBe('string');
		});

		test('Should enforce the registration rate limit using the client IP', async () => {
			const context = createAuthContext();
			const mockFind = vi.fn(() => ({
				estimatedDocumentCount: vi.fn().mockResolvedValueOnce(0)
			}));
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(null) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockStoredUser) });
			MockUsersConstructor.find = mockFind;
			MockUsersConstructor.findOne = mockFindOne;
			mockSave.mockResolvedValueOnce(mockStoredUser);

			await Mutation.registerUser({}, { email: 'new@example.com', password: 'Valid1Pass' }, context);

			expect(context.di.rateLimitValidation.ensureRegisterRateLimitNotExceeded).toHaveBeenCalledWith('203.0.113.5');
		});

		test('Should reject without touching the database when the registration rate limit is exceeded', async () => {
			const context = createAuthContext();
			const rateLimitError = new Error('Too many registration attempts, please try again later');
			(context.di.rateLimitValidation.ensureRegisterRateLimitNotExceeded as ReturnType<typeof vi.fn>).mockRejectedValueOnce(rateLimitError);
			const mockFind = vi.fn(() => ({
				estimatedDocumentCount: vi.fn().mockResolvedValueOnce(0)
			}));
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(null)
			}));
			MockUsersConstructor.find = mockFind;
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.registerUser({}, { email: 'new@example.com', password: 'Valid1Pass' }, context))
				.rejects.toThrow(rateLimitError);
			expect(mockFind).not.toHaveBeenCalled();
			expect(mockFindOne).not.toHaveBeenCalled();
			expect(mockSave).not.toHaveBeenCalled();
		});
	});

	describe('authUser', () => {
		test('Should throw UserInputError if email is empty', async () => {
			const context = createAuthContext();
			await expect(Mutation.authUser({}, { email: '', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is empty', async () => {
			const context = createAuthContext();
			await expect(Mutation.authUser({}, { email: 'test@example.com', password: '' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should enforce the login rate limit using the client IP', async () => {
			const context = createAuthContext();
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			const mockFindOneAndUpdate = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;
			MockUsersConstructor.findOneAndUpdate = mockFindOneAndUpdate;

			await Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context);

			expect(context.di.rateLimitValidation.ensureLoginRateLimitNotExceeded).toHaveBeenCalledWith('203.0.113.5');
		});

		test('Should reject without touching the database when the rate limit is exceeded', async () => {
			const context = createAuthContext();
			const rateLimitError = new Error('Too many login attempts, please try again later');
			(context.di.rateLimitValidation.ensureLoginRateLimitNotExceeded as ReturnType<typeof vi.fn>).mockRejectedValueOnce(rateLimitError);
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context))
				.rejects.toThrow(rateLimitError);
			expect(mockFindOne).not.toHaveBeenCalled();
		});

		test('Should throw UserInputError if user not found or inactive', async () => {
			const context = createAuthContext();
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(null)
			}));
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should use the same generic error message whether the user is missing or the password is wrong', async () => {
			// User not found
			const contextMissing = createAuthContext();
			MockUsersConstructor.findOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(null)
			}));
			const missingError = await Mutation.authUser({}, { email: 'ghost@example.com', password: 'Valid1Pass' }, contextMissing)
				.catch((err: Error) => err);

			// User found but wrong password
			getBcryptCompare().mockResolvedValueOnce(false);
			const contextWrongPass = createAuthContext();
			MockUsersConstructor.findOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			const wrongPassError = await Mutation.authUser({}, { email: 'test@example.com', password: 'WrongPass1' }, contextWrongPass)
				.catch((err: Error) => err);

			expect((missingError as Error).message).toBe('Invalid credentials');
			expect((wrongPassError as Error).message).toBe('Invalid credentials');
		});

		test('Should run a password comparison even when the user does not exist (avoid timing-based user enumeration)', async () => {
			const context = createAuthContext();
			MockUsersConstructor.findOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(null)
			}));

			await Mutation.authUser({}, { email: 'ghost@example.com', password: 'Valid1Pass' }, context)
				.catch(() => undefined);

			expect(getBcryptCompare()).toHaveBeenCalled();
		});

		test('Should throw UserInputError if password is incorrect', async () => {
			getBcryptCompare().mockResolvedValueOnce(false);

			const context = createAuthContext();
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.authUser({}, { email: 'test@example.com', password: 'WrongPass1' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should return token on successful authentication', async () => {
			const context = createAuthContext();
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockStoredUser) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockStoredUser) });
			const mockFindOneAndUpdate = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;
			MockUsersConstructor.findOneAndUpdate = mockFindOneAndUpdate;

			const result = await Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context);

			expect(result).toHaveProperty('token');
			expect(typeof result.token).toBe('string');
		});

		test('Should update lastLogin on successful authentication', async () => {
			const context = createAuthContext();
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockStoredUser) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockStoredUser) });
			const mockFindOneAndUpdate = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockStoredUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;
			MockUsersConstructor.findOneAndUpdate = mockFindOneAndUpdate;

			await Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context);

			expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
				{ email: 'test@example.com' },
				{ lastLogin: expect.any(Date) },
				{ new: true }
			);
		});
	});

	describe('deleteMyUserAccount', () => {
		test('Should check authentication before deletion', async () => {
			const context = createAuthContext();
			const mockDeleteResult = { deletedCount: 1 };
			const mockDeleteOne = vi.fn().mockResolvedValueOnce(mockDeleteResult);
			MockUsersConstructor.deleteOne = mockDeleteOne;

			await Mutation.deleteMyUserAccount({}, {}, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should delete user by uuid', async () => {
			const context = createAuthContext();
			const mockDeleteResult = { deletedCount: 1 };
			const mockDeleteOne = vi.fn().mockResolvedValueOnce(mockDeleteResult);
			MockUsersConstructor.deleteOne = mockDeleteOne;

			const result = await Mutation.deleteMyUserAccount({}, {}, context);

			expect(mockDeleteOne).toHaveBeenCalledWith({ uuid: 'user-uuid-1' });
			expect(result).toEqual(mockDeleteResult);
		});
	});
});

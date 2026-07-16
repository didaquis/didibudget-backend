import { describe, expect, test, beforeEach, vi } from 'vitest';
import { UserInputError } from '#/gql/errors.js';
import { Mutation } from '#/gql/resolvers/auth.js';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';
import * as bcryptModule from 'bcrypt';

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

const mockSave = vi.fn();

const MockUsersConstructor = vi.fn(() => ({
	save: mockSave
})) as unknown as ReturnType<typeof vi.fn> & MockUsersModel;

MockUsersConstructor.find = vi.fn();
MockUsersConstructor.findOne = vi.fn();
MockUsersConstructor.findOneAndUpdate = vi.fn();
MockUsersConstructor.deleteOne = vi.fn();

vi.mock('#/data/models/index.js', () => ({
	Users: MockUsersConstructor
}));

const mockUser = {
	_id: 'mock-id',
	uuid: 'user-uuid-1',
	email: 'test@example.com',
	password: 'hashedPassword',
	isAdmin: false,
	isActive: true,
	registrationDate: new Date('2024-01-01')
};

const mockJwtPayload: JwtTokenPayload = {
	email: 'test@example.com',
	isAdmin: false,
	isActive: true,
	uuid: 'user-uuid-1',
	registrationDate: '2024-01-01T00:00:00.000Z'
};

const createMockContext = (): Context => ({
	user: mockJwtPayload,
	di: {
		model: {
			Users: MockUsersConstructor
		} as unknown as Context['di']['model'],
		jwt: {
			createAuthToken: vi.fn(() => 'mock-token')
		},
		authValidation: {
			ensureLimitOfUsersIsNotReached: vi.fn(),
			ensureThatUserIsLogged: vi.fn(),
			getUser: vi.fn().mockResolvedValue(mockUser),
			ensureThatUserIsAdministrator: vi.fn()
		},
		pagingValidation: {
			ensurePageValueIsValid: vi.fn(),
			ensurePageSizeValueIsValid: vi.fn()
		},
		datetimeValidation: {
			ensureDateIsValid: vi.fn(),
			ensureStartDateIsEarlierThanEndDate: vi.fn()
		},
		parameterValidations: {
			isValidEnumValue: vi.fn(),
			isIntegerBetween: vi.fn()
		}
	}
});

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
			const context = createMockContext();
			await expect(Mutation.registerUser({}, { email: '', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is empty', async () => {
			const context = createMockContext();
			await expect(Mutation.registerUser({}, { email: 'test@example.com', password: '' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if email format is invalid', async () => {
			const context = createMockContext();
			await expect(Mutation.registerUser({}, { email: 'invalid-email', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is weak', async () => {
			const context = createMockContext();
			await expect(Mutation.registerUser({}, { email: 'test@example.com', password: 'weak' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if email is already registered', async () => {
			const context = createMockContext();
			const mockFind = vi.fn(() => ({
				estimatedDocumentCount: vi.fn().mockResolvedValueOnce(0)
			}));
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockUser)
			}));
			MockUsersConstructor.find = mockFind;
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.registerUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should return token on successful registration', async () => {
			const context = createMockContext();
			const mockFind = vi.fn(() => ({
				estimatedDocumentCount: vi.fn().mockResolvedValueOnce(0)
			}));
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(null) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockUser) });
			MockUsersConstructor.find = mockFind;
			MockUsersConstructor.findOne = mockFindOne;

			mockSave.mockResolvedValueOnce(mockUser);

			const result = await Mutation.registerUser({}, { email: 'new@example.com', password: 'Valid1Pass' }, context);

			expect(result).toHaveProperty('token');
			expect(typeof result.token).toBe('string');
		});
	});

	describe('authUser', () => {
		test('Should throw UserInputError if email is empty', async () => {
			const context = createMockContext();
			await expect(Mutation.authUser({}, { email: '', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is empty', async () => {
			const context = createMockContext();
			await expect(Mutation.authUser({}, { email: 'test@example.com', password: '' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if user not found or inactive', async () => {
			const context = createMockContext();
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(null)
			}));
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should throw UserInputError if password is incorrect', async () => {
			getBcryptCompare().mockResolvedValueOnce(false);

			const context = createMockContext();
			const mockFindOne = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;

			await expect(Mutation.authUser({}, { email: 'test@example.com', password: 'WrongPass1' }, context))
				.rejects.toThrow(UserInputError);
		});

		test('Should return token on successful authentication', async () => {
			const context = createMockContext();
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockUser) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockUser) });
			const mockFindOneAndUpdate = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockUser)
			}));
			MockUsersConstructor.findOne = mockFindOne;
			MockUsersConstructor.findOneAndUpdate = mockFindOneAndUpdate;

			const result = await Mutation.authUser({}, { email: 'test@example.com', password: 'Valid1Pass' }, context);

			expect(result).toHaveProperty('token');
			expect(typeof result.token).toBe('string');
		});

		test('Should update lastLogin on successful authentication', async () => {
			const context = createMockContext();
			const mockFindOne = vi.fn()
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockUser) })
				.mockReturnValueOnce({ lean: vi.fn().mockResolvedValueOnce(mockUser) });
			const mockFindOneAndUpdate = vi.fn(() => ({
				lean: vi.fn().mockResolvedValueOnce(mockUser)
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
			const context = createMockContext();
			const mockDeleteResult = { deletedCount: 1 };
			const mockDeleteOne = vi.fn().mockResolvedValueOnce(mockDeleteResult);
			MockUsersConstructor.deleteOne = mockDeleteOne;

			await Mutation.deleteMyUserAccount({}, {}, context);

			expect(context.di.authValidation.ensureThatUserIsLogged).toHaveBeenCalledWith(context);
		});

		test('Should delete user by uuid', async () => {
			const context = createMockContext();
			const mockDeleteResult = { deletedCount: 1 };
			const mockDeleteOne = vi.fn().mockResolvedValueOnce(mockDeleteResult);
			MockUsersConstructor.deleteOne = mockDeleteOne;

			const result = await Mutation.deleteMyUserAccount({}, {}, context);

			expect(mockDeleteOne).toHaveBeenCalledWith({ uuid: 'user-uuid-1' });
			expect(result).toEqual(mockDeleteResult);
		});
	});
});

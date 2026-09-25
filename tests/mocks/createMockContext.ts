import { vi } from 'vitest';
import type { Context } from '#/gql/auth/setContext.js';
import type { JwtTokenPayload } from '#/gql/auth/jwt.js';
import * as models from '#/data/models/index.js';

export const mockJwtPayload: JwtTokenPayload = {
	email: 'test@example.com',
	isAdmin: false,
	isActive: true,
	uuid: 'user-uuid-1',
	registrationDate: '2024-01-01T00:00:00.000Z'
};

export const mockUser = {
	_id: 'user-id-1',
	uuid: 'user-uuid-1',
	email: 'test@example.com'
};

interface MockContextOptions {
	/** User document returned by `authValidation.getUser`. */
	user?: unknown;
	clientIp?: string;
}

/**
 * `di.model` is the models module as seen by the calling test file, so each test file
 * must mock it with `vi.mock('#/data/models/index.js')` to control what resolvers read.
 */
export const createMockContext = ({ user = mockUser, clientIp }: MockContextOptions = {}): Context => ({
	user: mockJwtPayload,
	...(clientIp !== undefined && { clientIp }),
	di: {
		model: models as unknown as Context['di']['model'],
		jwt: {
			createAuthToken: vi.fn(() => 'mock-token')
		},
		authValidation: {
			ensureLimitOfUsersIsNotReached: vi.fn(),
			ensureThatUserIsLogged: vi.fn(),
			getUser: vi.fn().mockResolvedValue(user),
			ensureThatUserIsAdministrator: vi.fn()
		},
		rateLimitValidation: {
			ensureLoginRateLimitNotExceeded: vi.fn(),
			ensureRegisterRateLimitNotExceeded: vi.fn()
		},
		pagingValidation: {
			ensurePageValueIsValid: vi.fn(),
			ensurePageSizeValueIsValid: vi.fn()
		},
		datetimeValidation: {
			ensureDateIsValid: vi.fn(),
			ensureStartDateIsEarlierThanEndDate: vi.fn(),
			ensureStartDateIsNotLaterThanEndDate: vi.fn()
		},
		parameterValidations: {
			isValidEnumValue: vi.fn(),
			isIntegerBetween: vi.fn(),
			isValidObjectId: vi.fn(),
			isNumberGreaterThanOrEqualToZero: vi.fn(),
			isMinNotGreaterThanMax: vi.fn()
		}
	}
});

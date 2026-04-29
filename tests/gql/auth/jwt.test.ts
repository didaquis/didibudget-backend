import { describe, expect, test } from 'vitest';
import jwt from 'jsonwebtoken';
import { createAuthToken, validateAuthToken } from '#/gql/auth/jwt.js';

const validPayload = {
	email: 'test@example.com',
	isAdmin: false,
	isActive: true,
	uuid: 'abc-123',
	registrationDate: new Date('2024-01-01T00:00:00.000Z'),
};

describe('createAuthToken', () => {
	test('returns a non-empty string', () => {
		const token = createAuthToken(
			validPayload.email,
			validPayload.isAdmin,
			validPayload.isActive,
			validPayload.uuid,
			validPayload.registrationDate
		);
		expect(typeof token).toBe('string');
		expect(token.length).toBeGreaterThan(0);
	});

	test('produced token has three JWT segments', () => {
		const token = createAuthToken(
			validPayload.email,
			validPayload.isAdmin,
			validPayload.isActive,
			validPayload.uuid,
			validPayload.registrationDate
		);
		expect(token.split('.')).toHaveLength(3);
	});
});

describe('validateAuthToken', () => {
	test('returns payload with correct fields for a valid token', () => {
		const token = createAuthToken(
			validPayload.email,
			validPayload.isAdmin,
			validPayload.isActive,
			validPayload.uuid,
			validPayload.registrationDate
		);
		const payload = validateAuthToken(token);

		expect(payload.email).toBe(validPayload.email);
		expect(payload.isAdmin).toBe(validPayload.isAdmin);
		expect(payload.isActive).toBe(validPayload.isActive);
		expect(payload.uuid).toBe(validPayload.uuid);
		// registrationDate is serialized to ISO string by jwt.sign
		expect(payload.registrationDate).toBe(validPayload.registrationDate.toISOString());
	});

	test('throws for a tampered token', () => {
		const token = createAuthToken(
			validPayload.email,
			validPayload.isAdmin,
			validPayload.isActive,
			validPayload.uuid,
			validPayload.registrationDate
		);
		const tampered = token.slice(0, -5) + 'XXXXX';
		expect(() => validateAuthToken(tampered)).toThrow();
	});

	test('throws for an expired token', () => {
		const expiredToken = jwt.sign(
			{ ...validPayload },
			'yoursecret',
			{ expiresIn: 0 }
		);
		expect(() => validateAuthToken(expiredToken)).toThrow();
	});
});

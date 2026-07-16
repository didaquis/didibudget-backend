import { describe, expect, test } from 'vitest';
import { ensureJwtSecretIsSecure } from '#/config/appConfig.js';
import { ENVIRONMENT } from '#/config/environment.js';

describe('ensureJwtSecretIsSecure', () => {
	test('Should throw in production if the secret is the insecure default value', () => {
		expect(() => ensureJwtSecretIsSecure('yoursecret', ENVIRONMENT.PRODUCTION)).toThrow('The SECRET environment variable must be set to a strong value in production');
	});

	test('Should throw in production if the secret is empty', () => {
		expect(() => ensureJwtSecretIsSecure('', ENVIRONMENT.PRODUCTION)).toThrow('The SECRET environment variable must be set to a strong value in production');
	});

	test('Should not throw in production if the secret is a custom value', () => {
		expect(() => ensureJwtSecretIsSecure('a-strong-and-private-secret', ENVIRONMENT.PRODUCTION)).not.toThrow();
	});

	test('Should not throw in development even if the secret is the insecure default value', () => {
		expect(() => ensureJwtSecretIsSecure('yoursecret', ENVIRONMENT.DEVELOPMENT)).not.toThrow();
	});

	test('Should not throw in development if the secret is a custom value', () => {
		expect(() => ensureJwtSecretIsSecure('a-strong-and-private-secret', ENVIRONMENT.DEVELOPMENT)).not.toThrow();
	});
});

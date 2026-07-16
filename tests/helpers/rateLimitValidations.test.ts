import { describe, expect, test } from 'vitest';
import { TooManyRequestsError } from '#/gql/errors.js';
import { rateLimitValidations, LOGIN_MAX_ATTEMPTS, REGISTER_MAX_ATTEMPTS } from '#/helpers/rateLimitValidations.js';

describe('rateLimitValidations', () => {
	describe('ensureLoginRateLimitNotExceeded', () => {
		test('Should not throw while the number of attempts is within the limit', async () => {
			const key = 'ip-within-limit';

			for (let attempt = 0; attempt < LOGIN_MAX_ATTEMPTS; attempt++) {
				await expect(rateLimitValidations.ensureLoginRateLimitNotExceeded(key)).resolves.toBeUndefined();
			}
		});

		test('Should throw TooManyRequestsError once the attempt limit is exceeded', async () => {
			const key = 'ip-over-limit';

			for (let attempt = 0; attempt < LOGIN_MAX_ATTEMPTS; attempt++) {
				await rateLimitValidations.ensureLoginRateLimitNotExceeded(key);
			}

			await expect(rateLimitValidations.ensureLoginRateLimitNotExceeded(key)).rejects.toThrow(TooManyRequestsError);
		});

		test('Should keep separate counters per key', async () => {
			const exhaustedKey = 'ip-exhausted';
			const freshKey = 'ip-fresh';

			for (let attempt = 0; attempt <= LOGIN_MAX_ATTEMPTS; attempt++) {
				await rateLimitValidations.ensureLoginRateLimitNotExceeded(exhaustedKey).catch(() => undefined);
			}

			await expect(rateLimitValidations.ensureLoginRateLimitNotExceeded(freshKey)).resolves.toBeUndefined();
		});
	});

	describe('ensureRegisterRateLimitNotExceeded', () => {
		test('Should not throw while the number of attempts is within the limit', async () => {
			const key = 'register-ip-within-limit';

			for (let attempt = 0; attempt < REGISTER_MAX_ATTEMPTS; attempt++) {
				await expect(rateLimitValidations.ensureRegisterRateLimitNotExceeded(key)).resolves.toBeUndefined();
			}
		});

		test('Should throw TooManyRequestsError once the attempt limit is exceeded', async () => {
			const key = 'register-ip-over-limit';

			for (let attempt = 0; attempt < REGISTER_MAX_ATTEMPTS; attempt++) {
				await rateLimitValidations.ensureRegisterRateLimitNotExceeded(key);
			}

			await expect(rateLimitValidations.ensureRegisterRateLimitNotExceeded(key)).rejects.toThrow(TooManyRequestsError);
		});

		test('Should keep separate counters per key', async () => {
			const exhaustedKey = 'register-ip-exhausted';
			const freshKey = 'register-ip-fresh';

			for (let attempt = 0; attempt <= REGISTER_MAX_ATTEMPTS; attempt++) {
				await rateLimitValidations.ensureRegisterRateLimitNotExceeded(exhaustedKey).catch(() => undefined);
			}

			await expect(rateLimitValidations.ensureRegisterRateLimitNotExceeded(freshKey)).resolves.toBeUndefined();
		});

		test('Should track login and registration limits independently', async () => {
			const key = 'shared-ip';

			for (let attempt = 0; attempt <= REGISTER_MAX_ATTEMPTS; attempt++) {
				await rateLimitValidations.ensureRegisterRateLimitNotExceeded(key).catch(() => undefined);
			}

			// Exhausting the registration limit must not consume the login budget for the same key.
			await expect(rateLimitValidations.ensureLoginRateLimitNotExceeded(key)).resolves.toBeUndefined();
		});
	});
});

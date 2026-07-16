import { describe, expect, test } from 'vitest';
import { TooManyRequestsError } from '#/gql/errors.js';
import { rateLimitValidations, LOGIN_MAX_ATTEMPTS } from '#/helpers/rateLimitValidations.js';

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
});

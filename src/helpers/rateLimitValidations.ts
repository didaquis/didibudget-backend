import { RateLimiterMemory } from 'rate-limiter-flexible';

import { TooManyRequestsError } from '#/gql/errors.js';

/**
 * Login throttling configuration.
 *
 * A single sliding window per client (keyed by IP): after LOGIN_MAX_ATTEMPTS attempts within
 * LOGIN_WINDOW_SECONDS, further attempts from the same key are rejected until the window frees up.
 * The counter lives in process memory, which is enough for a single-instance deployment. If the app
 * is ever scaled to several instances, swap RateLimiterMemory for the Redis-backed limiter from the
 * same library so the limit is shared across processes.
 */
export const LOGIN_MAX_ATTEMPTS = 10;
export const LOGIN_WINDOW_SECONDS = 15 * 60; // eslint-disable-line no-magic-numbers

const loginRateLimiter = new RateLimiterMemory({
	points: LOGIN_MAX_ATTEMPTS,
	duration: LOGIN_WINDOW_SECONDS
});

/**
 * Rate limit validations repository
 */
export const rateLimitValidations = {
	/**
	 * Consume one attempt for the given key (typically the client IP) and throw a TooManyRequestsError
	 * if the key has exceeded the allowed number of attempts within the window. Because it is called
	 * once per resolver invocation, GraphQL aliasing cannot be used to smuggle extra attempts past it.
	 */
	ensureLoginRateLimitNotExceeded: async (key: string): Promise<void> => {
		try {
			await loginRateLimiter.consume(key);
		} catch (rejection) {
			// The limiter rejects with a RateLimiterRes when the limit is hit; a real Error only appears
			// on an unexpected internal failure, which must not be masked as a rate-limit response.
			if (rejection instanceof Error) {
				throw rejection;
			}
			throw new TooManyRequestsError('Too many login attempts, please try again later');
		}
	}
};

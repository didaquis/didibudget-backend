import { UserInputError } from 'apollo-server-express';

/**
 * Paging validations repository
 */
export const pagingValidations = {
	/**
	 * Check if the page value is valid. Should be greather than zero
	 */
	ensurePageValueIsValid: (page: unknown): void => {
		if (!Number.isInteger(page) || Number(page) <= 0) {
			throw new UserInputError('The page value should be an integer greather than 0');
		}
	},

	/**
	 * Check if the page size value is valid. Should be an integer within the supported range
	 */
	ensurePageSizeValueIsValid: (pageSize: unknown): void => {
		const minPageSizeAllowed = 10;
		const maxPageSizeAllowed = 100;
		if (!Number.isInteger(pageSize) || Number(pageSize) < minPageSizeAllowed || Number(pageSize) > maxPageSizeAllowed) {
			throw new UserInputError(`The page size value should be an integer between ${minPageSizeAllowed} and ${maxPageSizeAllowed}`);
		}
	},
};

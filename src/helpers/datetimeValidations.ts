import { UserInputError } from '#/gql/errors.js';

/**
 * Datetime validations repository
 */
export const datetimeValidations = {

	/**
	 * Check if date provided is valid
	 */
	ensureDateIsValid: (value: unknown): void => {
		const date = new Date(value as Date | string | number);

		if (isNaN(date.getTime())) {
			throw new UserInputError('The date provided is not valid');
		}
	},

	/**
	 * Check if a date is earlier than other
	 */
	ensureStartDateIsEarlierThanEndDate: (startDate: Date | string, endDate: Date | string): void => {
		if (startDate >= endDate) {
			throw new UserInputError('The start date is not earlier than the end date');
		}
	}
};

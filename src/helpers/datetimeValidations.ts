import { UserInputError } from '#/gql/errors.js';
import { isProvided } from '#/helpers/isProvided.js';
import { isValidDay, isValidMonth } from '#/helpers/spendingDay.js';

/**
 * Datetime validations repository
 */
export const datetimeValidations = {

	/**
	 * Check if a day is a real calendar day as `YYYY-MM-DD`
	 */
	ensureDayIsValid: (value: unknown): void => {
		if (!isValidDay(value)) {
			throw new UserInputError('The day provided is not valid');
		}
	},

	/**
	 * Check if a month is valid as `YYYY-MM`
	 */
	ensureMonthIsValid: (value: unknown): void => {
		if (!isValidMonth(value)) {
			throw new UserInputError('The month provided is not valid');
		}
	},

	/**
	 * Check a range of days, both inclusive. An end that is not provided leaves the range open on that side;
	 * an end that is provided must be a valid `YYYY-MM-DD` day, and the start can't be later than the end
	 */
	ensureDayRangeIsValid: (startDay?: unknown, endDay?: unknown): void => {
		[startDay, endDay].filter(isProvided).forEach(datetimeValidations.ensureDayIsValid);

		// Valid days sort as text in the same order as dates
		if (isProvided(startDay) && isProvided(endDay) && String(startDay) > String(endDay)) {
			throw new UserInputError('The start day is later than the end day');
		}
	}
};

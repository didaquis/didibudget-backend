import { UserInputError } from '#/gql/errors.js';
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
	 * Check if a day is not later than other. Both days must be valid `YYYY-MM-DD` strings, which sort as dates
	 */
	ensureStartDayIsNotLaterThanEndDay: (startDay: string, endDay: string): void => {
		if (startDay > endDay) {
			throw new UserInputError('The start date is later than the end date');
		}
	},

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
	},

	/**
	 * Check if a date is not later than other. Both ends of the range are considered valid
	 */
	ensureStartDateIsNotLaterThanEndDate: (startDate: Date | string, endDate: Date | string): void => {
		if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
			throw new UserInputError('The start date is later than the end date');
		}
	}
};

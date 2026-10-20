import { describe, expect, test } from 'vitest';
import { UserInputError } from '#/gql/errors.js';
import { datetimeValidations } from '#/helpers/datetimeValidations.js';

describe('datetimeValidations', () => {
	describe('ensureDateIsValid', () => {
		test('Should not throw for valid ISO date string', () => {
			expect(() => datetimeValidations.ensureDateIsValid('2024-01-15')).not.toThrow();
		});

		test('Should not throw for valid Date object', () => {
			expect(() => datetimeValidations.ensureDateIsValid(new Date('2024-01-15'))).not.toThrow();
		});

		test('Should not throw for valid timestamp number', () => {
			expect(() => datetimeValidations.ensureDateIsValid(1705276800000)).not.toThrow();
		});

		test('Should not throw for valid datetime string', () => {
			expect(() => datetimeValidations.ensureDateIsValid('2024-01-15T10:30:00Z')).not.toThrow();
		});

		test('Should throw UserInputError for invalid date string', () => {
			expect(() => datetimeValidations.ensureDateIsValid('not-a-date')).toThrow(UserInputError);
		});

		test('Should throw UserInputError for empty string', () => {
			expect(() => datetimeValidations.ensureDateIsValid('')).toThrow(UserInputError);
		});

		test('Should not throw for null (creates epoch date)', () => {
			expect(() => datetimeValidations.ensureDateIsValid(null)).not.toThrow();
		});

		test('Should throw UserInputError for undefined', () => {
			expect(() => datetimeValidations.ensureDateIsValid(undefined)).toThrow(UserInputError);
		});

		test('Should throw with correct error message', () => {
			expect(() => datetimeValidations.ensureDateIsValid('invalid')).toThrow('The date provided is not valid');
		});
	});

	describe('ensureStartDateIsEarlierThanEndDate', () => {
		test('Should not throw when start date is earlier than end date', () => {
			expect(() => datetimeValidations.ensureStartDateIsEarlierThanEndDate('2024-01-01', '2024-12-31')).not.toThrow();
		});

		test('Should not throw when start date is earlier with Date objects', () => {
			const start = new Date('2024-01-01');
			const end = new Date('2024-12-31');
			expect(() => datetimeValidations.ensureStartDateIsEarlierThanEndDate(start, end)).not.toThrow();
		});

		test('Should throw UserInputError when dates are equal', () => {
			expect(() => datetimeValidations.ensureStartDateIsEarlierThanEndDate('2024-06-15', '2024-06-15')).toThrow(UserInputError);
		});

		test('Should throw UserInputError when start date is later than end date', () => {
			expect(() => datetimeValidations.ensureStartDateIsEarlierThanEndDate('2024-12-31', '2024-01-01')).toThrow(UserInputError);
		});

		test('Should throw with correct error message', () => {
			expect(() => datetimeValidations.ensureStartDateIsEarlierThanEndDate('2024-12-31', '2024-01-01')).toThrow('The start date is not earlier than the end date');
		});
	});

	describe('ensureStartDateIsNotLaterThanEndDate', () => {
		test('Should not throw if start date is earlier than end date', () => {
			expect(() => datetimeValidations.ensureStartDateIsNotLaterThanEndDate('2024-01-01', '2024-12-31')).not.toThrow();
		});

		test('Should not throw if both dates are equal', () => {
			expect(() => datetimeValidations.ensureStartDateIsNotLaterThanEndDate('2024-06-15', '2024-06-15')).not.toThrow();
		});

		test('Should throw UserInputError if start date is later than end date', () => {
			expect(() => datetimeValidations.ensureStartDateIsNotLaterThanEndDate('2024-12-31', '2024-01-01')).toThrow(UserInputError);
			expect(() => datetimeValidations.ensureStartDateIsNotLaterThanEndDate('2024-12-31', '2024-01-01')).toThrow('The start date is later than the end date');
		});

		test('Should compare dates as instants and not as text', () => {
			const startDate = '2024-06-15T00:00:00.000Z';
			const endDate = '2024-06-15T02:00:00.000+01:00';

			expect(() => datetimeValidations.ensureStartDateIsNotLaterThanEndDate(startDate, endDate)).not.toThrow();
		});
	});

	describe('ensureDayIsValid', () => {
		test('Should not throw for a real calendar day', () => {
			expect(() => datetimeValidations.ensureDayIsValid('2028-02-29')).not.toThrow();
		});

		test('Should throw UserInputError for a day that does not exist, an instant or a missing value', () => {
			['2026-02-30', '2026-03-01T00:00:00.000Z', undefined].forEach((value) => {
				expect(() => datetimeValidations.ensureDayIsValid(value)).toThrow(UserInputError);
				expect(() => datetimeValidations.ensureDayIsValid(value)).toThrow('The day provided is not valid');
			});
		});
	});

	describe('ensureMonthIsValid', () => {
		test('Should not throw for a month', () => {
			expect(() => datetimeValidations.ensureMonthIsValid('2026-04')).not.toThrow();
		});

		test('Should throw UserInputError for a month that does not exist, a day or a missing value', () => {
			['2026-13', '2026-04-01', undefined].forEach((value) => {
				expect(() => datetimeValidations.ensureMonthIsValid(value)).toThrow(UserInputError);
				expect(() => datetimeValidations.ensureMonthIsValid(value)).toThrow('The month provided is not valid');
			});
		});
	});

	describe('ensureStartDayIsNotLaterThanEndDay', () => {
		test('Should not throw for a range of a single day', () => {
			expect(() => datetimeValidations.ensureStartDayIsNotLaterThanEndDay('2026-03-15', '2026-03-15')).not.toThrow();
		});

		test('Should not throw when the start day is earlier', () => {
			expect(() => datetimeValidations.ensureStartDayIsNotLaterThanEndDay('2025-12-31', '2026-01-01')).not.toThrow();
		});

		test('Should throw UserInputError when the start day is later', () => {
			expect(() => datetimeValidations.ensureStartDayIsNotLaterThanEndDay('2026-03-16', '2026-03-15')).toThrow(UserInputError);
			expect(() => datetimeValidations.ensureStartDayIsNotLaterThanEndDay('2026-03-16', '2026-03-15')).toThrow('The start date is later than the end date');
		});
	});
});

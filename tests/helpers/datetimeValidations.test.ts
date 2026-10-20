import { describe, expect, test } from 'vitest';
import { UserInputError } from '#/gql/errors.js';
import { datetimeValidations } from '#/helpers/datetimeValidations.js';

describe('datetimeValidations', () => {
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

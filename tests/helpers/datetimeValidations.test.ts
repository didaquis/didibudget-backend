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
});

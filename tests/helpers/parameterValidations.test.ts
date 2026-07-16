import { describe, expect, test } from 'vitest';
import { parameterValidations } from '#/helpers/parameterValidations.js';
import { UserInputError } from '#/gql/errors.js';

describe('parameterValidations', () => {
	describe('isValidEnumValue', () => {
		test('Should not throw if value is in enum object', () => {
			const enumObj = { FOO: 'foo', BAR: 'bar' };
			expect(() => parameterValidations.isValidEnumValue('foo', enumObj)).not.toThrow();
		});

		test('Should throw UserInputError if value is not in enum object', () => {
			const enumObj = { FOO: 'foo', BAR: 'bar' };
			expect(() => parameterValidations.isValidEnumValue('baz', enumObj)).toThrow(UserInputError);
			expect(() => parameterValidations.isValidEnumValue('baz', enumObj)).toThrow('Invalid parameter. Allowed values are: foo, bar');
		});
	});

	describe('isIntegerBetween', () => {
		test('Should not throw if value is an integer between min and max', () => {
			expect(() => parameterValidations.isIntegerBetween(5, 1, 10)).not.toThrow();
			expect(() => parameterValidations.isIntegerBetween(1, 1, 10)).not.toThrow();
			expect(() => parameterValidations.isIntegerBetween(10, 1, 10)).not.toThrow();
		});

		test('Should throw UserInputError if value is not an integer', () => {
			expect(() => parameterValidations.isIntegerBetween(5.5, 1, 10)).toThrow(UserInputError);
			expect(() => parameterValidations.isIntegerBetween('5', 1, 10)).toThrow(UserInputError);
			expect(() => parameterValidations.isIntegerBetween(5.5, 1, 10)).toThrow('The value provided should be an integer');
		});

		test('Should throw UserInputError if value is outside range', () => {
			expect(() => parameterValidations.isIntegerBetween(0, 1, 10)).toThrow(UserInputError);
			expect(() => parameterValidations.isIntegerBetween(11, 1, 10)).toThrow(UserInputError);
			expect(() => parameterValidations.isIntegerBetween(0, 1, 10)).toThrow('The value provided should be an integer between 1 and 10');
		});
	});
});

import { UserInputError } from 'apollo-server-express';
import { pagingValidations } from '#/helpers/pagingValidations.js';

describe('pagingValidations', () => {
	describe('ensurePageValueIsValid', () => {
		test('Should not throw if page is a positive integer', () => {
			expect(() => pagingValidations.ensurePageValueIsValid(1)).not.toThrow();
			expect(() => pagingValidations.ensurePageValueIsValid(10)).not.toThrow();
			expect(() => pagingValidations.ensurePageValueIsValid(100)).not.toThrow();
		});

		test('Should throw UserInputError if page is not an integer', () => {
			expect(() => pagingValidations.ensurePageValueIsValid(1.5)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageValueIsValid('1')).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageValueIsValid(null)).toThrow(UserInputError);
		});

		test('Should throw UserInputError if page is less than or equal to 0', () => {
			expect(() => pagingValidations.ensurePageValueIsValid(0)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageValueIsValid(-1)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageValueIsValid(0)).toThrow('The page value should be an integer greather than 0');
		});
	});

	describe('ensurePageSizeValueIsValid', () => {
		test('Should not throw if pageSize is an integer between 10 and 100', () => {
			expect(() => pagingValidations.ensurePageSizeValueIsValid(10)).not.toThrow();
			expect(() => pagingValidations.ensurePageSizeValueIsValid(50)).not.toThrow();
			expect(() => pagingValidations.ensurePageSizeValueIsValid(100)).not.toThrow();
		});

		test('Should throw UserInputError if pageSize is not an integer', () => {
			expect(() => pagingValidations.ensurePageSizeValueIsValid(10.5)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageSizeValueIsValid('10')).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageSizeValueIsValid(null)).toThrow(UserInputError);
		});

		test('Should throw UserInputError if pageSize is less than 10', () => {
			expect(() => pagingValidations.ensurePageSizeValueIsValid(9)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageSizeValueIsValid(0)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageSizeValueIsValid(-1)).toThrow(UserInputError);
		});

		test('Should throw UserInputError if pageSize is greater than 100', () => {
			expect(() => pagingValidations.ensurePageSizeValueIsValid(101)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageSizeValueIsValid(200)).toThrow(UserInputError);
			expect(() => pagingValidations.ensurePageSizeValueIsValid(101)).toThrow('The page size value should be an integer between 10 and 100');
		});
	});
});

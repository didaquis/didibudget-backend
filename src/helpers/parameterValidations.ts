import { UserInputError } from '#/gql/errors.js';

/**
 * Parameter validations repository
 */
export const parameterValidations = {
	/**
	 * Check if the parameter is include in enum pattern object
	 */
	isValidEnumValue: (value: unknown, enumObj: Record<string, unknown>): void => {
		if (!Object.values(enumObj).includes(value)) {
			throw new UserInputError(`Invalid parameter. Allowed values are: ${Object.values(enumObj).join(', ')}`);
		}
	},

	/**
	 * Check if the parameter is an integer between min and max (inclusive) in enum pattern object
	 */
	isIntegerBetween: (value: unknown, min: number, max: number): void => {
		if (!Number.isInteger(value)) {
			throw new UserInputError('The value provided should be an integer');
		}

		const num = value as number;
		if (num < min || num > max) {
			throw new UserInputError(`The value provided should be an integer between ${min} and ${max}`);
		}
	},

	/**
	 * Check if the parameter is a well formed MongoDB identifier
	 */
	isValidObjectId: (value: unknown): void => {
		const objectIdPattern = /^[a-fA-F0-9]{24}$/;

		if (typeof value !== 'string' || !objectIdPattern.test(value)) {
			throw new UserInputError('The identifier provided is not valid');
		}
	},

	/**
	 * Check if the parameter is a number greater than or equal to zero
	 */
	isNumberGreaterThanOrEqualToZero: (value: unknown): void => {
		if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
			throw new UserInputError('The value provided should be a number greater than or equal to zero');
		}
	},

	/**
	 * Check that a minimum value is not greater than its maximum value
	 */
	isMinNotGreaterThanMax: (min: number, max: number): void => {
		if (min > max) {
			throw new UserInputError('The minimum value provided is greater than the maximum value');
		}
	},
};

import { UserInputError } from 'apollo-server-express';

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
};

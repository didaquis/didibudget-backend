const { authValidations } = require('../src/gql/auth/validations');

describe('validations', () => {
	test('Should be an object', () => {
		const whatTypeIs = (element) => {
			// eslint-disable-next-line no-magic-numbers
			return Object.prototype.toString.call(element).slice(8, -1);
		};

		expect(whatTypeIs(authValidations) === 'Object').toBe(true);
	});

	describe('isValidEmail', () => {
		test('Should return false if no receive params', () => {
			expect(authValidations.isValidEmail()).toBe(false);
		});

		test('Should return false if no receive a valid data', () => {
			const fakeData = ['foo', '', 'foo@@foo.foo', 'bar@bar..com', 'biz@biz.', '@foo.mail'];

			fakeData.forEach( data => {
				expect(authValidations.isValidEmail(data)).toBe(false);
			});
		});

		test('Should return true if receive a valid data', () => {
			const fakeData = ['maria@mail.com', 'john.doe@gmail.com', 'santi72@hotmail.es'];

			fakeData.forEach( data => {
				expect(authValidations.isValidEmail(data)).toBe(true);
			});
		});
	});
});